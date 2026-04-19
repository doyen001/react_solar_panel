import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { DESIGNS_REGISTER_STEP } from "@/utils/constant";
import type { RootState } from "./store";

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

export type DesignProposalEquipment = {
  solarPanelName: string;
  solarPanelWatts: string;
  inverterName: string;
  inverterWatts: string;
  batteryName: string;
  batteryWatts: string;
  numberOfPanels: string;
  co2Offset: string;
};

export type DesignProposalPricing = {
  totalSystemPrice: string;
  monthlySavings: string;
  currentBill: string;
  newBill: string;
};

export type DesignProposalState = {
  summary: DesignProposalSummary;
  customer: DesignProposalCustomer;
  equipment: DesignProposalEquipment;
  pricing: DesignProposalPricing;
};

export type DesignProposalPayload = {
  summary?: Partial<DesignProposalSummary>;
  customer?: Partial<DesignProposalCustomer>;
  equipment?: Partial<DesignProposalEquipment>;
  pricing?: Partial<DesignProposalPricing>;
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
  },
  pricing: {
    totalSystemPrice: "$11,200",
    monthlySavings: "$132",
    currentBill: "$500",
    newBill: "$368",
  },
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
        state.equipment = { ...state.equipment, ...action.payload.equipment };
      }
      if (action.payload.pricing) {
        state.pricing = { ...state.pricing, ...action.payload.pricing };
      }
    },
    resetProposalData: () => DESIGN_PROPOSAL_DEFAULTS,
  },
});

export const { mergeProposalData, resetProposalData } =
  designProposalSlice.actions;
export const selectDesignProposal = (state: RootState) => state.designProposal;
export default designProposalSlice.reducer;
