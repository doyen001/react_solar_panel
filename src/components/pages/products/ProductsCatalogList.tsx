"use client";

import { ProductCard } from "@/components/pages/products/ProductCard";
import { ProductsPagination } from "@/components/pages/products/ProductsPagination";
import { matchesFilter } from "@/components/pages/products/matchesFilter";
import {
  MAX_COMPARE_PRODUCTS,
  PRODUCTS_PAGE_SIZE,
} from "@/components/pages/products/productsData";
import type { FilterChipDef, Product } from "@/components/pages/products/types";

type Props = {
  products: Product[];
  filters: FilterChipDef[];
  activeFilterKey: string;
  compareIds: Set<string>;
  onToggleCompare: (id: string) => void;
  page: number;
  onPageChange: (page: number) => void;
};

export function ProductsCatalogList({
  products,
  filters,
  activeFilterKey,
  compareIds,
  onToggleCompare,
  page,
  onPageChange,
}: Props) {
  const activeFilter = filters.find((filter) => filter.key === activeFilterKey);
  const visibleProducts = products.filter((product) =>
    matchesFilter(product, activeFilter),
  );

  if (visibleProducts.length === 0) {
    return (
      <div className="w-full rounded-2xl border border-dashed border-warm-border bg-white px-6 py-12 text-center">
        <p className="font-inter text-[15px] font-semibold text-warm-ink">
          No matching products
        </p>
        <p className="mt-1 font-dm-sans text-[12px] text-warm-gray">
          Try a different filter or category.
        </p>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(visibleProducts.length / PRODUCTS_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PRODUCTS_PAGE_SIZE;
  const pageProducts = visibleProducts.slice(pageStart, pageStart + PRODUCTS_PAGE_SIZE);
  const compareFull = compareIds.size >= MAX_COMPARE_PRODUCTS;

  return (
    <div className="flex w-full flex-col gap-5">
      <p className="font-dm-sans text-[12px] text-warm-ink/70">
        Showing {pageStart + 1}–{Math.min(pageStart + PRODUCTS_PAGE_SIZE, visibleProducts.length)} of{" "}
        {visibleProducts.length} products
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pageProducts.map((product) => {
          const inCompare = compareIds.has(product.id);
          return (
            <ProductCard
              key={product.id}
              product={product}
              inCompare={inCompare}
              compareDisabled={compareFull && !inCompare}
              onToggleCompare={() => onToggleCompare(product.id)}
            />
          );
        })}
      </div>

      <ProductsPagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
