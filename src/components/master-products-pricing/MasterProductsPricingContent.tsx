"use client";

import { useState } from "react";
import type { MasterProductCategoryId } from "@/utils/constant";
import { MasterProductsCatalogPanel } from "./MasterProductsCatalogPanel";
import { MasterProductsHero } from "./MasterProductsHero";
import {
  MasterProductsL1Tabs,
  type MasterProductsL1TabId,
} from "./MasterProductsL1Tabs";

const PLACEHOLDER_COPY: Record<
  Exclude<MasterProductsL1TabId, "catalog">,
  string
> = {
  special:
    "Configure promotional pricing and limited-time offers for installers.",
  tiers: "Define tier benefits, thresholds, and default pricing by installer level.",
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
      ) : (
        <section className="master-pp-card" aria-label={activeTab}>
          <div className="master-pp-placeholder-inner">
            {PLACEHOLDER_COPY[activeTab]}
          </div>
        </section>
      )}
    </main>
  );
}
