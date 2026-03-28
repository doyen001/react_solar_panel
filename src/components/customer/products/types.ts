export type SolarProductCategory = "panel" | "inverter" | "battery";

export type SolarProduct = {
  id: string;
  category: SolarProductCategory;
  name: string;
  rating: number;
  reviewCount: number;
  price: string;
  bestSeller?: boolean;
};

export type DesignSummaryItem = {
  id: string;
  name: string;
  detail: string;
  icon: "sun" | "cpu";
};
