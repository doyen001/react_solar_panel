import { describe, expect, it } from "vitest";
import { designToProposalPayload, proposalToDesignInput } from "./custom-design";
import type { CustomerDesign } from "./designs";
import { DESIGN_PROPOSAL_DEFAULTS } from "@/lib/store/designProposalSlice";

/** Trimmed from a real GET /api/customers/designs response. */
const OWNER = {
  id: "1e389718-d0a5-4b17-a98f-b97f22d19132",
  firstName: "Ryan",
  lastName: "Ben",
  email: "customer1@gmail.com",
  phone: "+61 417 119 217",
  address: "50 Harbour Dr, Townsville, QLD 4810",
};

/** A materialised package: real products, no wizardData. */
const PACKAGE_DESIGN = {
  id: "caa3b3a2-2d9f-4d76-b756-c318b90643c7",
  userId: OWNER.id,
  title: "Battery Add-on — 6.6 kW",
  address: "50 Harbour Dr, Townsville, QLD 4810",
  latitude: null,
  longitude: null,
  roofArea: null,
  annualSunlight: null,
  panelCount: 16,
  estimatedSavings: 2580,
  status: "DRAFT",
  packageKey: "battery",
  wizardData: null,
  createdAt: "2026-08-11T20:36:42.721Z",
  updatedAt: "2026-08-11T22:59:45.354Z",
  user: OWNER,
  products: [
    {
      id: "p1",
      quantity: 16,
      totalPrice: 4160,
      product: {
        id: "prod-panel",
        name: "AE400MD-108",
        brand: "AE Solar GmbH",
        category: "Solar Panel",
        wattage: 400,
        price: 260,
        specs: { cecApproved: true },
      },
    },
    {
      id: "p2",
      quantity: 1,
      totalPrice: 400,
      product: {
        id: "prod-inverter",
        name: "STH-6KTL-HS (AS4777-2 2020)",
        brand: "Ningbo Sunways Technologies Co Ltd",
        category: "Inverter",
        wattage: 600,
        price: 400,
        specs: { series: "STH-3K~8KTL", ratedKw: 0.6, cecApproved: true },
      },
    },
    {
      id: "p3",
      quantity: 1,
      totalPrice: 1500,
      product: {
        id: "prod-battery",
        name: "A48-40",
        brand: "Zenaji",
        category: "Battery",
        wattage: null,
        price: 1500,
        specs: {
          series: "AEON",
          cecApproved: true,
          usableCapacityKwh: 1.93,
          nominalCapacityKwh: 1.93,
        },
      },
    },
  ],
} as unknown as CustomerDesign;

/** The custom design: rich wizardData, no products attached yet. */
const CUSTOM_DESIGN = {
  id: "75dd23cb-3c97-48dd-831c-971bc044aa92",
  userId: OWNER.id,
  title: "Custom design — 63.0 kW",
  address: "50 Harbour Dr, Townsville, QLD 4810",
  latitude: -19.2589,
  longitude: 146.8169,
  roofArea: 299.48272081821614,
  annualSunlight: 1891,
  panelCount: 126,
  estimatedSavings: 1584,
  status: "DRAFT",
  packageKey: null,
  solarData: { yearlyEnergyDcKwh: 12000 },
  wizardData: {
    pricing: { totalSystemPrice: "$8,450", monthlySavings: "$132" },
    summary: { systemSize: "63.0 kW", totalPanels: "126" },
    customer: {
      name: "Ryan Ben",
      email: "customer1@gmail.com",
      phoneNumber: "61417119222",
      address: "50 Harbour Dr, Townsville, QLD 4810",
      property: "Residential",
      mapLat: -19.2589,
      mapLng: 146.8169,
    },
    equipment: {
      batteryName: "TRINA",
      batteryWatts: "400 W",
      inverterName: "Ningbo Sunways STS-10KTL",
      inverterWatts: "10 kW",
      numberOfPanels: "126",
      solarPanelName: "8 Star Energy ENSP48NDG3455BF",
      solarPanelWatts: "630 W",
    },
    solarDesign: { pinLat: -19.2589, pinLng: 146.8169, savedRoofs: [[]] },
  },
  createdAt: "2026-08-11T20:00:00.000Z",
  updatedAt: "2026-08-11T22:59:44.985Z",
  user: OWNER,
  products: [],
} as unknown as CustomerDesign;

describe("designToProposalPayload — package design (no wizardData)", () => {
  const payload = designToProposalPayload(PACKAGE_DESIGN)!;

  it("prefills the customer step from the owner record", () => {
    expect(payload.customer).toMatchObject({
      name: "Ryan Ben",
      email: "customer1@gmail.com",
      phoneNumber: "+61 417 119 217",
      address: "50 Harbour Dr, Townsville, QLD 4810",
    });
  });

  it("prefills equipment from the attached products", () => {
    expect(payload.equipment).toMatchObject({
      solarPanelName: "AE Solar GmbH AE400MD-108",
      solarPanelWatts: "400 W",
      inverterName: "Ningbo Sunways Technologies Co Ltd STH-6KTL-HS (AS4777-2 2020)",
      inverterWatts: "0.6 kW",
      batteryName: "Zenaji A48-40",
      batteryWatts: "1.93 kWh",
      numberOfPanels: "16",
    });
  });

  it("derives system size from the real panel wattage", () => {
    expect(payload.summary?.systemSize).toBe("6.4 kW");
    expect(payload.pricing?.totalSystemPrice).toBe("$6,060");
  });
});

describe("designToProposalPayload — custom design (wizardData, no products)", () => {
  const payload = designToProposalPayload(CUSTOM_DESIGN)!;

  it("falls back to the snapshot for equipment the design cannot source", () => {
    expect(payload.equipment).toMatchObject({
      solarPanelName: "8 Star Energy ENSP48NDG3455BF",
      solarPanelWatts: "630 W",
      inverterName: "Ningbo Sunways STS-10KTL",
      batteryName: "TRINA",
    });
  });

  it("still overrides panel count from the design column", () => {
    expect(payload.equipment?.numberOfPanels).toBe("126");
  });

  it("keeps the account record authoritative for identity", () => {
    // The snapshot carried a different phone; the user record wins.
    expect(payload.customer?.phoneNumber).toBe("+61 417 119 217");
    expect(payload.customer?.property).toBe("Residential");
  });

  it("keeps the map pin and roof outline from the snapshot", () => {
    expect(payload.customer?.mapLat).toBe(-19.2589);
    expect(payload.solarDesign?.savedRoofs).toEqual([[]]);
  });
});

describe("proposalToDesignInput — equipment persistence", () => {
  it("sends the selected products so equipment survives the save", () => {
    const input = proposalToDesignInput({
      ...DESIGN_PROPOSAL_DEFAULTS,
      equipment: {
        ...DESIGN_PROPOSAL_DEFAULTS.equipment,
        numberOfPanels: "16",
        solarPanelProductId: "panel-1",
        inverterProductId: "inverter-1",
        batteryProductId: "battery-1",
      },
    });

    expect(input.products).toEqual([
      { productId: "panel-1", quantity: 16 },
      { productId: "inverter-1", quantity: 1 },
      { productId: "battery-1", quantity: 1 },
    ]);
  });

  it("omits products entirely when nothing was picked", () => {
    const input = proposalToDesignInput(DESIGN_PROPOSAL_DEFAULTS);
    // Omitted rather than empty: an empty array would wipe equipment the
    // installer attached.
    expect(input.products).toBeUndefined();
  });

  it("skips categories with no selection", () => {
    const input = proposalToDesignInput({
      ...DESIGN_PROPOSAL_DEFAULTS,
      equipment: {
        ...DESIGN_PROPOSAL_DEFAULTS.equipment,
        numberOfPanels: "12",
        solarPanelProductId: "panel-1",
      },
    });

    expect(input.products).toEqual([{ productId: "panel-1", quantity: 12 }]);
  });
});

describe("products win over a stale snapshot", () => {
  it("does not show a battery the design does not have", () => {
    // Same custom design, but with the package's real products attached.
    const merged = {
      ...CUSTOM_DESIGN,
      products: PACKAGE_DESIGN.products,
    } as unknown as CustomerDesign;

    const payload = designToProposalPayload(merged)!;

    expect(payload.equipment?.batteryName).toBe("Zenaji A48-40");
    expect(payload.equipment?.batteryWatts).toBe("1.93 kWh");
    expect(payload.equipment?.batteryName).not.toBe("TRINA");
  });
});
