import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { DESIGNS_REGISTER_STEP } from "@/utils/constant";
import type { SolarPanel } from "@/types/solar";
import type { RootState } from "./store";

/** Serializable roof outline + generated layout for the solar step (restore after Back). */
export type DesignProposalSolarDesign = {
  pinLat: number;
  pinLng: number;
  savedRoofs: { lat: number; lng: number }[][];
  generatedPanels: SolarPanel[] | null;
  polygonTotalAreaM2: number | null;
  panelCountInput: string;
  /** PNG data URL from html2canvas on Save — for proposals / PDFs */
  mapScreenshotDataUrl: string | null;
};

export type DesignProposalSummary = {
  systemSize: string;
  totalPanels: string;
  yearlySavings: string;
  payback: string;
};

export type DesignProposalCustomer = {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  property: string;
  /** Pin from the location step map (decimal degrees). Used by the solar-panel step map. */
  mapLat?: number;
  mapLng?: number;
};

/** Every category the items step can add products to, in card order. */
export type EquipmentCategoryKey =
  | "solarPanel"
  | "battery"
  | "inverter"
  | "evCharger"
  | "heatPump";

export const EQUIPMENT_CATEGORY_KEYS: readonly EquipmentCategoryKey[] = [
  "solarPanel",
  "inverter",
  "battery",
  "evCharger",
  "heatPump",
];

/** One product a customer added to a category — the items step can add several per category. */
export type EquipmentItem = {
  productId: string;
  brand: string;
  name: string;
  quantity: number;
  /** "630 W" / "7.6 kWh" / "7.6 kW" — whatever unit that category's spec uses. */
  ratingLabel: string;
};

export type EquipmentItemsByCategory = Record<
  EquipmentCategoryKey,
  EquipmentItem[]
>;

export function emptyEquipmentItems(): EquipmentItemsByCategory {
  return {
    solarPanel: [],
    battery: [],
    inverter: [],
    evCharger: [],
    heatPump: [],
  };
}

export type DesignProposalEquipment = {
  solarPanelName: string;
  solarPanelWatts: string;
  inverterName: string;
  inverterWatts: string;
  batteryName: string;
  batteryWatts: string;
  numberOfPanels: string;
  co2Offset: string;
  /**
   * Catalogue ids for the chosen kit. Carried so the save can write real
   * DesignProduct rows — the display strings above cannot identify a product.
   * Empty when the customer has not picked from the catalogue.
   *
   * These singular ids describe only the FIRST item of their category — the
   * source of truth for "everything selected" is `items` below. They're kept
   * so PDF/summary reads that only need one representative product per
   * category don't need to change.
   */
  solarPanelProductId?: string;
  inverterProductId?: string;
  batteryProductId?: string;
  /** Every product added per category, including multiples. */
  items: EquipmentItemsByCategory;
};

/**
 * Old saved designs' `wizardData` predates `items` entirely (singular fields
 * only, no EV Charger/Heat Pump). Synthesizes single-entry arrays from those
 * legacy fields so every reader downstream can assume `items` is always
 * fully-shaped, never undefined.
 */
export function legacyEquipmentToItems(
  equipment: Partial<DesignProposalEquipment> | undefined,
): EquipmentItemsByCategory {
  if (equipment?.items) return equipment.items;

  const items = emptyEquipmentItems();
  if (equipment?.solarPanelProductId) {
    items.solarPanel = [
      {
        productId: equipment.solarPanelProductId,
        brand: equipment.solarPanelName ?? "",
        name: equipment.solarPanelName ?? "",
        quantity: 1,
        ratingLabel: equipment.solarPanelWatts ?? "",
      },
    ];
  }
  if (equipment?.inverterProductId) {
    items.inverter = [
      {
        productId: equipment.inverterProductId,
        brand: equipment.inverterName ?? "",
        name: equipment.inverterName ?? "",
        quantity: 1,
        ratingLabel: equipment.inverterWatts ?? "",
      },
    ];
  }
  if (equipment?.batteryProductId) {
    items.battery = [
      {
        productId: equipment.batteryProductId,
        brand: equipment.batteryName ?? "",
        name: equipment.batteryName ?? "",
        quantity: 1,
        ratingLabel: equipment.batteryWatts ?? "",
      },
    ];
  }
  return items;
}

/** How the user expresses their grid bill amount on the energy step (stored alongside monthly-normalized figures). */
export type DesignBillPeriod = "month" | "quarter" | "year";

export type DesignProposalPricing = {
  totalSystemPrice: string;
  monthlySavings: string;
  currentBill: string;
  newBill: string;
  billPeriod: DesignBillPeriod;
};

export type DesignProposalState = {
  summary: DesignProposalSummary;
  customer: DesignProposalCustomer;
  equipment: DesignProposalEquipment;
  pricing: DesignProposalPricing;
  solarDesign: DesignProposalSolarDesign | null;
};

export type DesignProposalPayload = {
  summary?: Partial<DesignProposalSummary>;
  customer?: Partial<DesignProposalCustomer>;
  // `items` merges per-category (see mergeProposalData), so a payload only
  // needs to name the categories it's actually changing.
  equipment?: Partial<Omit<DesignProposalEquipment, "items">> & {
    items?: Partial<EquipmentItemsByCategory>;
  };
  pricing?: Partial<DesignProposalPricing>;
  solarDesign?: DesignProposalSolarDesign | null;
};

export const DESIGN_PROPOSAL_DEFAULTS: DesignProposalState = {
  summary: {
    systemSize: "6.6 kW",
    totalPanels: "16",
    yearlySavings: "$1,580",
    payback: "7.1 yrs",
  },
  customer: {
    name: DESIGNS_REGISTER_STEP.defaultValues.name,
    email: DESIGNS_REGISTER_STEP.defaultValues.email,
    phoneNumber: DESIGNS_REGISTER_STEP.defaultValues.phone,
    address: "42 Bondi Rd, Bondi, NSW 2026",
    property: "Residential",
  },
  equipment: {
    solarPanelName: "TRINA",
    solarPanelWatts: "630 W",
    inverterName: "BLUETTI",
    inverterWatts: "7.6 kW",
    batteryName: "BLUETTI",
    batteryWatts: "7.6 kW",
    numberOfPanels: "16",
    co2Offset: "7.2 tonnes/year",
    items: emptyEquipmentItems(),
  },
  pricing: {
    totalSystemPrice: "$11,200",
    monthlySavings: "$132",
    currentBill: "$500",
    newBill: "$368",
    billPeriod: "quarter",
  },
  solarDesign: null,
};

const designProposalSlice = createSlice({
  name: "designProposal",
  initialState: DESIGN_PROPOSAL_DEFAULTS,
  reducers: {
    mergeProposalData: (state, action: PayloadAction<DesignProposalPayload>) => {
      if (action.payload.summary) {
        state.summary = { ...state.summary, ...action.payload.summary };
      }
      if (action.payload.customer) {
        state.customer = { ...state.customer, ...action.payload.customer };
      }
      if (action.payload.equipment) {
        state.equipment = {
          ...state.equipment,
          ...action.payload.equipment,
          // Per-category merge: a payload that sets `items.battery` replaces
          // only that category's array, leaving other categories untouched.
          items: {
            ...state.equipment.items,
            ...action.payload.equipment.items,
          },
        };
      }
      if (action.payload.pricing) {
        state.pricing = { ...state.pricing, ...action.payload.pricing };
      }
      if (action.payload.solarDesign !== undefined) {
        state.solarDesign = action.payload.solarDesign;
      }
    },
    resetProposalData: () => DESIGN_PROPOSAL_DEFAULTS,
  },
});

export const { mergeProposalData, resetProposalData } =
  designProposalSlice.actions;
export const selectDesignProposal = (state: RootState) => state.designProposal;
export default designProposalSlice.reducer;
