import type { FilterChipDef, Product } from "@/components/pages/products/types";

export function matchesFilter(product: Product, filter: FilterChipDef | undefined) {
  if (!filter || filter.kind === "all") return true;
  if (filter.kind === "segment") return product.segment === filter.segment;
  const aboveMin = filter.min === undefined || product.specValue >= filter.min;
  const belowMax = filter.max === undefined || product.specValue < filter.max;
  return aboveMin && belowMax;
}
