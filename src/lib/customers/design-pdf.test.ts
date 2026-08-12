import { describe, expect, it } from "vitest";
import { designToProposalState, proposalFileName } from "./design-pdf";
import { DESIGN_PROPOSAL_DEFAULTS } from "@/lib/store/designProposalSlice";
import type { CustomerDesign } from "./designs";

const OWNER = {
  id: "1e389718-d0a5-4b17-a98f-b97f22d19132",
  firstName: "Ryan",
  lastName: "Ben",
  email: "customer1@gmail.com",
  phone: "+61 417 119 217",
  address: "50 Harbour Dr, Townsville, QLD 4810",
};

const DESIGN = {
  id: "caa3b3a2-2d9f-4d76-b756-c318b90643c7",
  userId: OWNER.id,
  title: "Battery Add-on — 6.6 kW",
  address: "50 Harbour Dr, Townsville, QLD 4810",
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
  ],
} as unknown as CustomerDesign;

describe("designToProposalState", () => {
  it("produces a complete state the PDF generator can consume", () => {
    const state = designToProposalState(DESIGN);

    // Every section present, so the generator never reads undefined.
    expect(Object.keys(state).sort()).toEqual(
      ["customer", "equipment", "pricing", "solarDesign", "summary"].sort(),
    );
  });

  it("carries the design's own details over the defaults", () => {
    const state = designToProposalState(DESIGN);

    expect(state.customer.name).toBe("Ryan Ben");
    expect(state.customer.email).toBe("customer1@gmail.com");
    expect(state.customer.address).toBe("50 Harbour Dr, Townsville, QLD 4810");
    expect(state.equipment.solarPanelName).toBe("AE Solar GmbH AE400MD-108");
    expect(state.equipment.numberOfPanels).toBe("16");
  });

  it("keeps defaults for fields the design cannot source", () => {
    const state = designToProposalState(DESIGN);
    // No battery attached, so the default label survives rather than becoming
    // undefined and rendering as "undefined" in the PDF.
    expect(state.equipment.batteryName).toBe(
      DESIGN_PROPOSAL_DEFAULTS.equipment.batteryName,
    );
  });

  it("tolerates a design with no products or owner", () => {
    const bare = {
      ...DESIGN,
      products: [],
      user: null,
      wizardData: null,
    } as unknown as CustomerDesign;

    const state = designToProposalState(bare);
    expect(state.customer.name).toBe(DESIGN_PROPOSAL_DEFAULTS.customer.name);
    expect(state.solarDesign).toBeNull();
  });
});

describe("proposalFileName", () => {
  it("builds a filesystem-safe name from the customer", () => {
    expect(proposalFileName(DESIGN)).toBe(
      "Solar-Energy-Proposal-Ryan-Ben.pdf",
    );
  });
});
