/**
 * Product catalogue for the design builder.
 *
 * The builder needs real product ids so the selection can be written as
 * DesignProduct rows — without them a custom design has no equipment, which is
 * why its equipment cards used to read N/A while a package's showed real kit.
 */
export type BuilderProductCategory = "Solar Panel" | "Inverter" | "Battery";

export type BuilderProduct = {
  id: string;
  name: string;
  brand: string;
  category: BuilderProductCategory;
  /** Watts for panels; inverters carry kW in specs instead. */
  wattage: number | null;
  price: number;
  specs?: unknown;
};

type BackendProduct = {
  id: string;
  name: string;
  brand?: string | null;
  category: string;
  wattage?: number | null;
  price?: number | null;
  specs?: unknown;
};

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

const UNKNOWN_BRAND = "Other";

function toBuilderProduct(
  product: BackendProduct,
  category: BuilderProductCategory,
): BuilderProduct {
  return {
    id: product.id,
    name: product.name,
    brand: product.brand?.trim() || UNKNOWN_BRAND,
    category,
    wattage: product.wattage ?? null,
    price: product.price ?? 0,
    ...(product.specs !== undefined ? { specs: product.specs } : {}),
  };
}

/**
 * One category's active products. Capped at the API's max page size — these
 * feed two dropdowns, not an exhaustive browse.
 */
export async function fetchBuilderProducts(
  category: BuilderProductCategory,
): Promise<BuilderProduct[]> {
  const params = new URLSearchParams({
    category,
    limit: "100",
    active: "true",
  });

  const res = await fetch(`/api/products?${params.toString()}`, {
    cache: "no-store",
  });
  const json = (await res.json().catch(() => ({}))) as ApiEnvelope<
    BackendProduct[]
  >;

  if (!res.ok) {
    throw new Error(json.message || `Could not load ${category} options`);
  }

  return Array.isArray(json.data)
    ? json.data.map((product) => toBuilderProduct(product, category))
    : [];
}

/** Distinct brands, alphabetical, for the first dropdown. */
export function brandsOf(products: readonly BuilderProduct[]): string[] {
  return [...new Set(products.map((p) => p.brand))].sort((a, b) =>
    a.localeCompare(b),
  );
}

/** Models for one brand, for the second dropdown. */
export function modelsOf(
  products: readonly BuilderProduct[],
  brand: string,
): BuilderProduct[] {
  return products
    .filter((p) => p.brand === brand)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function builderProductLabel(product: BuilderProduct): string {
  return `${product.brand} ${product.name}`;
}
