"use client";

import { useMemo, useState } from "react";
import { CustomerDashboardHeader } from "@/components/customer/dashboard/CustomerDashboardHeader";
import type { FilterValue } from "@/components/customer/products/CategoryFilterChips";
import { CategoryFilterChips } from "@/components/customer/products/CategoryFilterChips";
import { SelectedDesignProductsSection } from "@/components/customer/products/SelectedDesignProductsSection";
import { SolarProductCard } from "@/components/customer/products/SolarProductCard";
import {
  SELECTED_DESIGN_PRODUCTS,
  SOLAR_PRODUCTS,
} from "@/components/customer/products/solarProductsData";
import { useAppSelector } from "@/lib/store/hooks";

export default function SolarProductsPage() {
  const user = useAppSelector((s) => s.customerAuth.user);
  const [filter, setFilter] = useState<FilterValue>("all");
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set());

  const filteredProducts = useMemo(() => {
    if (filter === "all") return SOLAR_PRODUCTS;
    return SOLAR_PRODUCTS.filter((p) => p.category === filter);
  }, [filter]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <CustomerDashboardHeader
        firstName={user?.firstName}
        lastName={user?.lastName}
        activeNav="products"
      />

      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-4 px-4 py-5 md:gap-5 md:px-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div>
            <h1 className="font-[family-name:var(--font-inter)] text-lg font-bold leading-[27px] text-[#2a2622]">
              Solar Products
            </h1>
            <p
              className="mt-0.5 font-[family-name:var(--font-dm-sans)] text-xs font-normal leading-[18px] text-[#7c736a]"
              style={{ fontVariationSettings: "'opsz' 9" }}
            >
              Browse our range of certified solar equipment
            </p>
          </div>
          <CategoryFilterChips value={filter} onChange={setFilter} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <SolarProductCard
              key={product.id}
              product={product}
              favorited={favorites.has(product.id)}
              onToggleFavorite={() => toggleFavorite(product.id)}
              onAdd={() => {}}
            />
          ))}
        </div>

        <SelectedDesignProductsSection items={SELECTED_DESIGN_PRODUCTS} />
      </main>
    </div>
  );
}
