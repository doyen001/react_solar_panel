/**
 * Placeholder catalogs for the proposal step's Panel Tier and Battery Capacity
 * selectors. Prices are illustrative deltas/absolutes, not real product data —
 * swap for real catalogue-backed values when available.
 */

export type PanelTierOption = {
  id: string;
  label: string;
  wattageLabel: string;
  brandModel: string;
  /** Additional cost vs. the base (Standard) tier. 0 = "Included". */
  priceDelta: number;
  recommended?: boolean;
};

export const PANEL_TIER_OPTIONS: PanelTierOption[] = [
  {
    id: "standard",
    label: "Standard",
    wattageLabel: "440W",
    brandModel: "Trina Vertex",
    priceDelta: 0,
  },
  {
    id: "premium",
    label: "Premium",
    wattageLabel: "480W",
    brandModel: "Sigenergy N-type",
    priceDelta: 680,
    recommended: true,
  },
  {
    id: "allBlack",
    label: "All-black",
    wattageLabel: "440W",
    brandModel: "premium finish",
    priceDelta: 920,
  },
];

export const DEFAULT_PANEL_TIER_ID = "standard";

export type BatteryCapacityOption = {
  id: string;
  label: string;
  /** Absolute add-on price for this capacity. 0 = no battery. */
  price: number;
};

export const BATTERY_CAPACITY_OPTIONS: BatteryCapacityOption[] = [
  { id: "none", label: "None", price: 0 },
  { id: "9.2kwh", label: "9.2kWh", price: 9990 },
  { id: "14.6kwh", label: "14.6kWh", price: 14990 },
  { id: "20kwh", label: "20kWh", price: 19990 },
  { id: "40kwh", label: "40kWh", price: 27990 },
  { id: "60kwh", label: "60kWh", price: 39990 },
  { id: "80kwh", label: "80kWh", price: 49990 },
  { id: "100kwh", label: "100kWh", price: 59990 },
];

export const DEFAULT_BATTERY_CAPACITY_ID = "none";

export function findPanelTier(id: string | undefined): PanelTierOption {
  return (
    PANEL_TIER_OPTIONS.find((t) => t.id === id) ?? PANEL_TIER_OPTIONS[0]
  );
}

export function findBatteryCapacity(
  id: string | undefined,
): BatteryCapacityOption {
  return (
    BATTERY_CAPACITY_OPTIONS.find((b) => b.id === id) ??
    BATTERY_CAPACITY_OPTIONS[0]
  );
}
