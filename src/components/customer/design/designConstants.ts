import { designAssets } from "./designAssets";

export type SpecLine = { label: string; value: string };

export type EquipmentCardData = {
  id: string;
  title: string;
  iconSrc: string;
  rows: SpecLine[];
};

export const SELECTED_DESIGN_SPECS: SpecLine[] = [
  { label: "System Size", value: "6.6 kW" },
  { label: "Panel Model", value: "Jinko Tiger Neo 415W" },
  { label: "Panel Count", value: "16" },
  { label: "Inverter", value: "Fronius Primo 5.0" },
  { label: "Battery", value: "None" },
  { label: "Orientation", value: "North" },
  { label: "Tilt Angle", value: "22°" },
];

export const PERFORMANCE_ESTIMATES: SpecLine[] = [
  { label: "Daily Output", value: "26.4 kWh" },
  { label: "Annual Output", value: "9,636 kWh" },
  { label: "Self-Consumption", value: "68%" },
  { label: "Payback Period", value: "4.2 yrs" },
  { label: "CO₂ Offset", value: "7.8 t/yr" },
  { label: "Feed-in Tariff", value: "$0.08/kWh" },
];

export const EQUIPMENT_CARDS: EquipmentCardData[] = [
  {
    id: "panels",
    title: "Solar Panels",
    iconSrc: designAssets.cardIconPanels,
    rows: [
      { label: "Model", value: "Jinko Tiger Neo" },
      { label: "Watts", value: "415W" },
      { label: "Qty", value: "16" },
      { label: "Total", value: "6.64 kW" },
    ],
  },
  {
    id: "battery",
    title: "Battery",
    iconSrc: designAssets.cardIconBattery,
    rows: [
      { label: "Model", value: "N/A" },
      { label: "Capacity", value: "—" },
      { label: "Type", value: "—" },
    ],
  },
  {
    id: "inverter",
    title: "Inverter",
    iconSrc: designAssets.cardIconInverter,
    rows: [
      { label: "Model", value: "Fronius Primo 5.0" },
      { label: "Type", value: "String" },
      { label: "Monitoring", value: "Solar.web" },
    ],
  },
  {
    id: "site",
    title: "Site Details",
    iconSrc: designAssets.cardIconSite,
    rows: [
      { label: "Roof", value: "Tile" },
      { label: "Phase", value: "Single" },
      { label: "NMI", value: "6305XXXXXX" },
      { label: "Retailer", value: "AGL Energy" },
    ],
  },
];

export type DesignColumn = {
  id: string;
  label: string;
  selected?: boolean;
};

export const COMPARISON_DESIGNS: DesignColumn[] = [
  { id: "a", label: "Design A", selected: true },
  { id: "b", label: "Design B" },
  { id: "c", label: "Design C" },
  { id: "d", label: "Design D" },
];

export type ComparisonRow = {
  feature: string;
  values: [string, string, string, string];
};

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    feature: "System size",
    values: ["6.6 kW", "10.0 kW", "6.6 kW", "13.2 kW"],
  },
  {
    feature: "Panels",
    values: ["16", "24", "16", "32"],
  },
  {
    feature: "Inverter",
    values: [
      "Fronius Primo 5.0",
      "SolarEdge SE10K",
      "Fronius Primo 5.0",
      "Fronius Symo 12.5",
    ],
  },
  {
    feature: "Battery",
    values: [
      "None",
      "Tesla Powerwall 2",
      "Tesla Powerwall 2",
      "BYD HVS 10.2 kWh",
    ],
  },
  {
    feature: "Annual output",
    values: ["9,636 kWh", "14,600 kWh", "9,636 kWh", "19,272 kWh"],
  },
  {
    feature: "Savings",
    values: ["$1,840/yr", "$2,950/yr", "$2,580/yr", "$3,740/yr"],
  },
  {
    feature: "Price",
    values: ["$8,500", "$18,200", "$19,800", "$28,500"],
  },
];
