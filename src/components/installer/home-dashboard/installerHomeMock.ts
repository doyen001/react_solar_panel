export type HomeCustomer = {
  id: string;
  initials: string;
  name: string;
};

export const INSTALLER_HOME_CUSTOMERS: HomeCustomer[] = [
  { id: "1", initials: "ES", name: "Ethan Salvi" },
  { id: "2", initials: "MC", name: "Marcus Chen" },
  { id: "3", initials: "SJ", name: "Sarah Johnson" },
  { id: "4", initials: "DP", name: "David Park" },
  { id: "5", initials: "LM", name: "Lisa Monroe" },
  { id: "6", initials: "JW", name: "James Wright" },
  { id: "7", initials: "AT", name: "Angela Torres" },
  { id: "8", initials: "RK", name: "Ryan Kim" },
  { id: "9", initials: "NP", name: "Nina Patel" },
  { id: "10", initials: "TB", name: "Tom Bradley" },
  { id: "11", initials: "EC", name: "Emma Collins" },
  { id: "12", initials: "JR", name: "Jake Rivera" },
];

export const INSTALLER_HOME_SOLAR_DESIGN = {
  designSpecs: [
    { label: "Array Size", value: "6.64 kW" },
    { label: "Orientation", value: "North" },
    { label: "Tilt Angle", value: "22°" },
    { label: "Shading Factor", value: "3%" },
    { label: "String Config", value: "2 × 8 panels" },
  ],
  performance: [
    { label: "Daily Output", value: "26.4 kWh" },
    { label: "Annual Output", value: "9,636 kWh" },
    { label: "Self-Consumption", value: "68%" },
    { label: "Payback Period", value: "4.2 yrs" },
    { label: "CO₂ Offset", value: "7.8 t/yr" },
  ],
  footer: {
    status: "Design Approved",
    updated: "Last updated: 24 Feb 2026",
    savings: "Estimated savings: $1,840/yr",
  },
};

export const INSTALLER_HOME_EQUIPMENT = {
  solar: [
    { label: "System Size", value: "6.6 kW" },
    { label: "Panel Name", value: "Jinko Tiger Neo" },
    { label: "Model", value: "JKM415N-54HL4-V" },
    { label: "Panel Watts", value: "415W" },
    { label: "Qty", value: "16" },
  ],
  battery: [
    { label: "Battery Model", value: "Tesla Powerwall 2" },
    { label: "Type", value: "Lithium-ion" },
    { label: "Size", value: "13.5 kWh" },
    { label: "CEC Approved", value: "Yes" },
  ],
  equipment: [
    { label: "Inverter", value: "Fronius Primo 5.0" },
    { label: "Optimizer", value: "N/A" },
    { label: "Monitoring", value: "Fronius Solar.web" },
  ],
  site: [
    { label: "Annual Bill", value: "$2,400" },
    { label: "Retailer", value: "AGL Energy" },
    { label: "Phase", value: "Single" },
    { label: "NMI", value: "6305XXXXXX" },
    { label: "Roof Type", value: "Tile" },
  ],
};

export const INSTALLER_HOME_PROFILE = {
  name: "Ethan Salvi",
  ref: "REF #CST-20241087",
  phone: "0418 575 08",
  email: "precision2001@gmail.com",
  type: "Individual",
  salePrice: "$14,500",
  profit: "$3,200",
};

export const INSTALLER_HOME_FINANCE = [
  { label: "STC Panel", value: "$1,200" },
  { label: "STC BESS", value: "10 ($1,200)" },
  { label: "Payment Type", value: "Finance" },
  { label: "Payment Status", value: "Pending" },
  { label: "Installer Cost", value: "$8,500" },
  { label: "Equipment Cost", value: "$5,300" },
];

export const INSTALLER_HOME_TAGS = [
  "New Lead",
  "Qualified",
  "Site Visit",
  "Quote Sent",
  "Approved",
  "In Progress",
  "Installed",
  "Follow Up",
  "VIP",
  "Referral",
];

/** Installer home pipeline strip (Figma 3:8986): four horizontal segments */
export const INSTALLER_HOME_PIPELINE_PHASES = [
  "Design and Permissions",
  "Installation",
  "Commissioning",
  "Maintenance and Monitoring",
] as const;

/** Index of the highlighted segment (0–3). Matches Figma default (Design and Permissions). */
export const INSTALLER_HOME_PIPELINE_ACTIVE_PHASE_INDEX = 0;

export const INSTALLER_HOME_CHANNELS = [
  "AI Compose",
  "Email",
  "SMS",
  "WhatsApp",
  "Facebook",
  "LinkedIn",
  "Others",
] as const;
