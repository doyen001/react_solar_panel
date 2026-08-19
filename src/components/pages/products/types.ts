import type { IconType } from "@/components/ui/Icons";

export type SystemStepStatus = "required" | "current" | "optional";

export type SystemStep = {
  key: string;
  label: string;
  iconName: IconType;
  status: SystemStepStatus;
  statusLabel: string;
};

export type SystemStepConnector = "requires" | "dotted";

export type ProductCategoryKey =
  | "batteries"
  | "solar-panels"
  | "inverters"
  | "ev-chargers"
  | "heat-pumps";

export type ProductCategory = {
  key: ProductCategoryKey;
  label: string;
  iconName: IconType;
  count: number;
};

export type FilterChipDef =
  | { key: string; label: string; kind: "all" }
  | { key: string; label: string; kind: "segment"; segment: ProductSegment }
  | { key: string; label: string; kind: "band"; min?: number; max?: number };

export type ProductSegment = "residential" | "commercial";

export type ProductBadge = "Popular" | "Best Value" | "Best Seller" | "New";

export type Product = {
  id: string;
  categoryKey: ProductCategoryKey;
  segment: ProductSegment;
  /** kWh for batteries/heat pumps, kW for inverters, W for solar panels, kW for EV chargers */
  specValue: number;
  badge?: ProductBadge;
  brand: string;
  name: string;
  model: string;
  rating: number;
  hasDatasheet?: boolean;
  inStock?: boolean;
  features: string[];
  price: number;
  compareInitially?: boolean;
};
