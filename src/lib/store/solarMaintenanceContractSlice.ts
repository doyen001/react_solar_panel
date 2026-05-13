import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { SOLAR_MAINTENANCE_CONTRACT } from "@/utils/constant";
import type { RootState } from "./store";

export type SolarMaintenanceEquipmentId =
  (typeof SOLAR_MAINTENANCE_CONTRACT.equipmentRows)[number]["id"];

export type SolarMaintenanceEquipmentRowState = {
  size: string;
  qty: string;
  installedIso: string;
};

export type SolarMaintenanceDetailsState = {
  companyName: string;
  agreementDateIso: string;
  contractNumber: string;
  equipment: Record<SolarMaintenanceEquipmentId, SolarMaintenanceEquipmentRowState>;
  installationAddress: string;
  clientName: string;
  abn: string;
  clientDateIso: string;
  secondClientDateIso: string;
  clientCompany: string;
};

export type SolarMaintenanceServicesState = {
  initialTerm: string;
  visits: Record<string, boolean>;
  cleaning: string;
  serviceNotes: string;
};

export type SolarMaintenanceExhibitsState = {
  uploadFiles: boolean;
  systemInventory: boolean;
  maintenanceChecklist: boolean;
  insuranceCertificates: boolean;
  pricingSchedule: boolean;
};

export type SolarMaintenanceSignaturesState = {
  providerName: string;
  providerSignature: string;
  providerDateIso: string;
  providerSignatureFileName: string | null;
  clientSignature: string;
  clientDateIso: string;
  clientSignatureFileName: string | null;
  exhibitUploadFileNames: string[];
  exhibits: SolarMaintenanceExhibitsState;
};

export type SolarMaintenanceWizardStep = 1 | 2 | 3;

export type SolarMaintenanceContractState = {
  step: SolarMaintenanceWizardStep;
  details: SolarMaintenanceDetailsState;
  services: SolarMaintenanceServicesState;
  signatures: SolarMaintenanceSignaturesState;
  draftSavedAt: string | null;
};

function emptyEquipment(): SolarMaintenanceDetailsState["equipment"] {
  return {
    panels: { size: "", qty: "", installedIso: "" },
    inverter: { size: "", qty: "", installedIso: "" },
    battery: { size: "", qty: "", installedIso: "" },
    accessories: { size: "", qty: "", installedIso: "" },
  };
}

function defaultVisits(): SolarMaintenanceServicesState["visits"] {
  return {
    visual: true,
    electrical: true,
    battery: true,
    panelWash: false,
  };
}

function defaultExhibits(): SolarMaintenanceExhibitsState {
  return {
    uploadFiles: false,
    systemInventory: false,
    maintenanceChecklist: false,
    insuranceCertificates: false,
    pricingSchedule: false,
  };
}

export const SOLAR_MAINTENANCE_CONTRACT_DEFAULTS: SolarMaintenanceContractState =
  {
    step: 1,
    details: {
      companyName: "",
      agreementDateIso: "",
      contractNumber: "",
      equipment: emptyEquipment(),
      installationAddress: "",
      clientName: "",
      abn: "",
      clientDateIso: "",
      secondClientDateIso: "",
      clientCompany: "",
    },
    services: {
      initialTerm: "12",
      visits: defaultVisits(),
      cleaning: "soft",
      serviceNotes: "",
    },
    signatures: {
      providerName: "",
      providerSignature: "",
      providerDateIso: "",
      providerSignatureFileName: null,
      clientSignature: "",
      clientDateIso: "",
      clientSignatureFileName: null,
      exhibitUploadFileNames: [],
      exhibits: defaultExhibits(),
    },
    draftSavedAt: null,
  };

export type SolarMaintenanceDetailsPayload = Omit<
  Partial<SolarMaintenanceDetailsState>,
  "equipment"
> & {
  equipment?: Partial<
    Record<SolarMaintenanceEquipmentId, Partial<SolarMaintenanceEquipmentRowState>>
  >;
};

export type SolarMaintenanceSignaturesPayload = Omit<
  Partial<SolarMaintenanceSignaturesState>,
  "exhibits"
> & {
  exhibits?: Partial<SolarMaintenanceExhibitsState>;
};

export type SolarMaintenancePayload = {
  step?: SolarMaintenanceWizardStep;
  details?: SolarMaintenanceDetailsPayload;
  services?: Partial<SolarMaintenanceServicesState>;
  signatures?: SolarMaintenanceSignaturesPayload;
};

const solarMaintenanceContractSlice = createSlice({
  name: "solarMaintenanceContract",
  initialState: SOLAR_MAINTENANCE_CONTRACT_DEFAULTS,
  reducers: {
    mergeSolarMaintenanceContract: (
      state,
      action: PayloadAction<SolarMaintenancePayload>,
    ) => {
      const p = action.payload;
      if (p.step !== undefined) {
        state.step = p.step;
      }
      if (p.details) {
        const d = p.details;
        if (d.companyName !== undefined) state.details.companyName = d.companyName;
        if (d.agreementDateIso !== undefined) {
          state.details.agreementDateIso = d.agreementDateIso;
        }
        if (d.contractNumber !== undefined) {
          state.details.contractNumber = d.contractNumber;
        }
        if (d.installationAddress !== undefined) {
          state.details.installationAddress = d.installationAddress;
        }
        if (d.clientName !== undefined) state.details.clientName = d.clientName;
        if (d.abn !== undefined) state.details.abn = d.abn;
        if (d.clientDateIso !== undefined) {
          state.details.clientDateIso = d.clientDateIso;
        }
        if (d.secondClientDateIso !== undefined) {
          state.details.secondClientDateIso = d.secondClientDateIso;
        }
        if (d.clientCompany !== undefined) {
          state.details.clientCompany = d.clientCompany;
        }
        if (d.equipment) {
          for (const k of Object.keys(d.equipment) as SolarMaintenanceEquipmentId[]) {
            const patch = d.equipment[k];
            if (patch) {
              state.details.equipment[k] = {
                ...state.details.equipment[k],
                ...patch,
              };
            }
          }
        }
      }
      if (p.services) {
        const s = p.services;
        if (s.initialTerm !== undefined) state.services.initialTerm = s.initialTerm;
        if (s.cleaning !== undefined) state.services.cleaning = s.cleaning;
        if (s.serviceNotes !== undefined) {
          state.services.serviceNotes = s.serviceNotes;
        }
        if (s.visits) {
          state.services.visits = { ...state.services.visits, ...s.visits };
        }
      }
      if (p.signatures) {
        const g = p.signatures;
        if (g.providerName !== undefined) {
          state.signatures.providerName = g.providerName;
        }
        if (g.providerSignature !== undefined) {
          state.signatures.providerSignature = g.providerSignature;
        }
        if (g.providerDateIso !== undefined) {
          state.signatures.providerDateIso = g.providerDateIso;
        }
        if (g.clientSignature !== undefined) {
          state.signatures.clientSignature = g.clientSignature;
        }
        if (g.clientDateIso !== undefined) {
          state.signatures.clientDateIso = g.clientDateIso;
        }
        if (g.providerSignatureFileName !== undefined) {
          state.signatures.providerSignatureFileName =
            g.providerSignatureFileName;
        }
        if (g.clientSignatureFileName !== undefined) {
          state.signatures.clientSignatureFileName = g.clientSignatureFileName;
        }
        if (g.exhibitUploadFileNames !== undefined) {
          state.signatures.exhibitUploadFileNames = g.exhibitUploadFileNames;
        }
        if (g.exhibits) {
          state.signatures.exhibits = {
            ...state.signatures.exhibits,
            ...g.exhibits,
          };
        }
      }
    },
    setSolarMaintenanceStep: (
      state,
      action: PayloadAction<SolarMaintenanceWizardStep>,
    ) => {
      state.step = action.payload;
    },
    markSolarMaintenanceDraftSaved: (state) => {
      state.draftSavedAt = new Date().toISOString();
    },
    resetSolarMaintenanceContract: () => SOLAR_MAINTENANCE_CONTRACT_DEFAULTS,
  },
});

export const {
  mergeSolarMaintenanceContract,
  setSolarMaintenanceStep,
  markSolarMaintenanceDraftSaved,
  resetSolarMaintenanceContract,
} = solarMaintenanceContractSlice.actions;

export const selectSolarMaintenanceContract = (state: RootState) =>
  state.solarMaintenanceContract;

export default solarMaintenanceContractSlice.reducer;
