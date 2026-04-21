/** Figma 3:5259 — Pipeline status board copy & structure */

export const PIPELINE_STEPPER_HEADERS = [
  "Customer",
  "Appointment",
  "Site Assessment",
  "Designing",
  "Proposal Sent / Deposit",
  "Installing",
  "Payment Completed",
] as const;

export type PipelineStepperCellKind = "customer" | "lane" | "laneQuote";

/** Figma 3:5390 — one header row + one body row (lane cells use yellow cards; proposal shows Quote Sent on green). */
export const PIPELINE_STEPPER_ROW: {
  kind: PipelineStepperCellKind;
  label?: string;
}[] = [
  { kind: "customer", label: "Ethan Salvi" },
  { kind: "lane" },
  { kind: "lane" },
  { kind: "lane" },
  { kind: "laneQuote", label: "Quote Sent" },
  { kind: "lane" },
  { kind: "lane" },
];

export const PIPELINE_DESIGN_CHECKS = [
  "Proof of Connection",
  "STC Application",
  "Solar Panel Design",
] as const;

export const PIPELINE_ORDER_CHECKS = [
  "Ordered CEC Panels",
  "Ordered CEC Inverter",
  "Ordered CEC Battery",
  "Ordered Racking / Rails",
  "Ordered Equipment",
] as const;

export const PIPELINE_INSTALL_DATES = [
  { label: "Installation Start Date / Time", id: "start" },
  { label: "Installation End Date / Time", id: "end" },
] as const;

export const PIPELINE_INSTALL_CHECKLIST = [
  "Roof Condition",
  "Battery Location",
  "Racking Mounted",
  "Panels Installed",
  "Inverter Wired",
  "Battery Connected",
  "Safety Checks",
  "Emergency Shutdown",
] as const;

export const PIPELINE_ISSUES = [
  "Racking Incomplete",
  "Panels Two Different Sizes",
  "Inverter Incompatibility",
  "Battery Voltage Mismatch",
  "Safety Not Complete",
] as const;

export const PIPELINE_COMMISSIONING_TESTS = [
  "Electrical Safety Tests",
  "Continuity and Polarity Tests",
  "Insulation Resistance",
  "Earth Continuity and Resistance",
  "Hybrid System with Backup Tests",
  "Polarity and Continuity of PV Strings",
  "Functional Tests for DC Isolators",
  "Functional Test Array Protection",
  "Inverter and Grid Synchronisation Tests",
  "Verify and Test Export Limits",
] as const;

export const PIPELINE_MAINTENANCE_DOCS = [
  "Certificate of Compliance",
  "Panel Warranty",
  "Inverter Warranty",
  "Battery Warranty",
  "Workmanship Warranty",
  "Solar System Agreement",
  "Handover Documents and Guides",
] as const;

export const PIPELINE_MONITORING_CHECKS = [
  "Monthly and Quarterly Check",
  "Check App for Firmware Updates",
  "Annual Inspection Scheduled",
] as const;

/** Figma 3:6819 — first four columns (label-only rows) */
export const PIPELINE_EQUIPMENT_STRIP = {
  solar: [
    "System Size",
    "Panel Name",
    "Model",
    "Panel Size Watts",
    "Type",
  ],
  battery: ["Battery Model", "Type", "Size kW", "CEC Approved"],
  equipment: [
    "Product 1",
    "Details Product 1",
    "Product 2",
    "Details Product 3",
  ],
  site: [
    "Annual Bill",
    "Retailer",
    "Phase",
    "NMI",
    "Roof Type",
    "Existing System Details",
  ],
} as const;
