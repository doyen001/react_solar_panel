"use client";

import { useState } from "react";
import type { MasterProductCategoryId } from "@/utils/constant";
import { MasterProductsCatalogPanel } from "./MasterProductsCatalogPanel";
import { MasterProductsHero } from "./MasterProductsHero";
import {
  MasterProductsL1Tabs,
  type MasterProductsL1TabId,
} from "./MasterProductsL1Tabs";
import { MasterSpecialPricingPanel } from "./MasterSpecialPricingPanel";

const PLACEHOLDER_COPY: Record<Extract<MasterProductsL1TabId, "tiers">, string> =
  {
    tiers:
      "Define tier benefits, thresholds, and default pricing by installer level.",
  };

export function MasterProductsPricingContent() {
  const [activeTab, setActiveTab] = useState<MasterProductsL1TabId>("catalog");
  const [categoryId, setCategoryId] = useState<MasterProductCategoryId>("all");
  const [search, setSearch] = useState("");

  return (
    <main className="mx-auto max-w-[1440px] space-y-6 px-5 py-6">
      <MasterProductsHero />
      <MasterProductsL1Tabs activeId={activeTab} onChange={setActiveTab} />

      {activeTab === "catalog" ? (
        <MasterProductsCatalogPanel
          categoryId={categoryId}
          onCategoryChange={setCategoryId}
          search={search}
          onSearchChange={setSearch}
        />
      ) : activeTab === "special" ? (
        <MasterSpecialPricingPanel />
      ) : (
        <section className="master-pp-card" aria-label={activeTab}>
          <div className="master-pp-placeholder-inner">
            {PLACEHOLDER_COPY.tiers}
          </div>
        </section>
      )}
    </main>
  );
}
