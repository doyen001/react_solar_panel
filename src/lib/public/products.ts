import type {
  DesignSummaryItem,
  SolarProduct,
  SolarProductCategory,
} from "@/components/customer/products/types";

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

type BackendProduct = {
  id: string;
  name: string;
  category: string;
  basePrice?: number;
  retailPrice?: number | null;
  wholesalePrice?: number | null;
  rating?: number | null;
  reviewCount?: number | null;
  bestSeller?: boolean | null;
};

function normalizeCategory(category: string): SolarProductCategory {
  const normalized = category.toLowerCase();
  if (normalized.includes("inverter")) return "inverter";
  if (normalized.includes("battery")) return "battery";
  return "panel";
}

function formatPrice(value?: number | null) {
  if (!value) return "Price on request";
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value);
}

function toSolarProduct(product: BackendProduct): SolarProduct {
  return {
    id: product.id,
    category: normalizeCategory(product.category),
    name: product.name,
    rating: product.rating ?? 4.7,
    reviewCount: product.reviewCount ?? 0,
    price: formatPrice(product.retailPrice ?? product.basePrice),
    bestSeller: product.bestSeller ?? false,
  };
}

export async function fetchPublicProducts(): Promise<SolarProduct[]> {
  const res = await fetch("/api/products?limit=24&active=true&bestSeller=true", {
    cache: "no-store",
  });
  const json = (await res.json()) as ApiEnvelope<BackendProduct[]>;
  if (!res.ok) throw new Error(json.message || "Failed to load products");
  return Array.isArray(json.data) ? json.data.map(toSolarProduct) : [];
}

export function selectedDesignProductsFromCatalog(products: SolarProduct[]): DesignSummaryItem[] {
  return products.slice(0, 2).map((product) => ({
    id: product.id,
    name: product.name,
    detail: product.category === "panel" ? "Panel" : product.category === "inverter" ? "Inverter" : "Battery",
    icon: product.category === "panel" ? "sun" : "cpu",
  }));
}
