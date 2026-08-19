"use client";

import { useState } from "react";
import { ProductsSystemStepper } from "@/components/pages/products/ProductsSystemStepper";
import { ProductsCategoryCards } from "@/components/pages/products/ProductsCategoryCards";
import { ProductsFilterChips } from "@/components/pages/products/ProductsFilterChips";
import { ProductsCatalogList } from "@/components/pages/products/ProductsCatalogList";
import { ProductsCompareBar } from "@/components/pages/products/ProductsCompareBar";
import { ProductsCompareModal } from "@/components/pages/products/ProductsCompareModal";
import {
  FILTERS_BY_CATEGORY,
  MAX_COMPARE_PRODUCTS,
  PRODUCT_BY_ID,
  PRODUCTS_BY_CATEGORY,
} from "@/components/pages/products/productsData";
import type { ProductCategoryKey } from "@/components/pages/products/types";

function initialCompareIds() {
  const ids = new Set<string>();
  for (const products of Object.values(PRODUCTS_BY_CATEGORY)) {
    for (const product of products) {
      if (product.compareInitially) ids.add(product.id);
    }
  }
  return ids;
}

export function ProductsPageSection() {
  const [activeCategory, setActiveCategory] =
    useState<ProductCategoryKey>("batteries");
  const [activeFilterKey, setActiveFilterKey] = useState("all");
  const [page, setPage] = useState(1);
  const [compareIds, setCompareIds] = useState<Set<string>>(initialCompareIds);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  const filters = FILTERS_BY_CATEGORY[activeCategory];
  const products = PRODUCTS_BY_CATEGORY[activeCategory];
  const compareProducts = Array.from(compareIds)
    .map((id) => PRODUCT_BY_ID[id])
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  const handleSelectCategory = (category: ProductCategoryKey) => {
    setActiveCategory(category);
    setActiveFilterKey("all");
    setPage(1);
  };

  const handleSelectFilter = (filterKey: string) => {
    setActiveFilterKey(filterKey);
    setPage(1);
  };

  const handleToggleCompare = (id: string) => {
    setCompareIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < MAX_COMPARE_PRODUCTS) {
        next.add(id);
      }
      return next;
    });
  };

  const handleRemoveFromCompare = (id: string) => {
    setCompareIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleClearCompare = () => {
    setCompareIds(new Set());
    setCompareModalOpen(false);
  };

  return (
    <section className="bg-linear-to-br from-gold-2 to-orange-amber py-10 sm:py-14">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-3 px-4 sm:px-6">
        <h1 className="font-inter text-[22px] font-extrabold uppercase leading-[28px] tracking-[0.02em] text-warm-ink sm:text-[26px]">
          Build Your System
        </h1>
        <p className="max-w-[560px] font-dm-sans text-[13px] leading-[19px] text-warm-ink/80 sm:text-[14px]">
          Batteries require an inverter and solar panels to complete a working
          system.
        </p>
      </div>

      <div className="mt-8 px-4 sm:px-6">
        <ProductsSystemStepper />
      </div>

      <div className="mt-8 flex flex-col gap-6 px-4 sm:px-6">
        <ProductsCategoryCards
          activeCategory={activeCategory}
          onSelect={handleSelectCategory}
        />
        <ProductsFilterChips
          filters={filters}
          activeFilterKey={activeFilterKey}
          onSelect={handleSelectFilter}
        />
        <ProductsCatalogList
          products={products}
          filters={filters}
          activeFilterKey={activeFilterKey}
          compareIds={compareIds}
          onToggleCompare={handleToggleCompare}
          page={page}
          onPageChange={setPage}
        />
      </div>

      {compareProducts.length > 0 ? <div className="h-20" aria-hidden /> : null}

      <ProductsCompareBar
        products={compareProducts}
        onRemove={handleRemoveFromCompare}
        onClear={handleClearCompare}
        onOpenCompare={() => setCompareModalOpen(true)}
      />

      {compareModalOpen ? (
        <ProductsCompareModal
          products={compareProducts}
          onClose={() => setCompareModalOpen(false)}
          onRemove={handleRemoveFromCompare}
        />
      ) : null}
    </section>
  );
}
