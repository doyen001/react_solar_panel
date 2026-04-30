"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { LeadMarketplaceCard } from "@/components/pages/installer/lead-marketplace/LeadMarketplaceCard";
import { LeadMarketplaceFilterBar } from "@/components/pages/installer/lead-marketplace/LeadMarketplaceFilterBar";
import { fetchPublicMarketplaceLeads } from "@/lib/public/marketplace-leads";
import {
  INSTALLER_LEAD_MARKETPLACE_FALLBACK,
  INSTALLER_LEAD_MARKETPLACE_SECTION,
  type InstallerLeadMarketplaceCard,
} from "@/utils/constant";

function useDebouncedValue<T>(value: T, delay: number): T {
  const [d, setD] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setD(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return d;
}

function filterLocal(
  cards: readonly InstallerLeadMarketplaceCard[],
  f: {
    buildingType: string;
    systemType: string;
    city: string;
    postcode: string;
  },
) {
  return cards.filter((c) => {
    if (f.buildingType && c.buildingType !== f.buildingType) return false;
    if (f.systemType && c.system !== f.systemType) return false;
    if (f.city && c.city !== f.city) return false;
    if (f.postcode && !(c.postcode ?? "").includes(f.postcode)) return false;
    return true;
  });
}

function hintsFromCards(cards: readonly InstallerLeadMarketplaceCard[]) {
  return {
    buildingTypes: [...new Set(cards.map((c) => c.buildingType))].sort(),
    systemTypes: [...new Set(cards.map((c) => c.system))].sort(),
    cities: [...new Set(cards.map((c) => c.city))].sort(),
  };
}

/**
 * Figma Final Designs 3:2206 — public installer landing; live data from GET /api/public/leads
 * (proxies unauthenticated GET /leads/marketplace).
 */
export function InstallerLeadMarketplaceSection() {
  const [buildingType, setBuildingType] = useState("");
  const [systemType, setSystemType] = useState("");
  const [city, setCity] = useState("");
  const [postcodeInput, setPostcodeInput] = useState("");
  const debouncedPostcode = useDebouncedValue(postcodeInput, 320);

  const [remoteRows, setRemoteRows] = useState<InstallerLeadMarketplaceCard[]>(
    [],
  );
  const [hints, setHints] = useState({
    buildingTypes: [] as string[],
    systemTypes: [] as string[],
    cities: [] as string[],
  });
  const [usedFallback, setUsedFallback] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshRemote = useCallback(async () => {
    setLoading(true);
    try {
      const { leads, meta } = await fetchPublicMarketplaceLeads({
        page: 1,
        limit: 80,
        buildingType: buildingType || undefined,
        systemType: systemType || undefined,
        city: city || undefined,
        postcode: debouncedPostcode || undefined,
      });
      setRemoteRows(leads);
      setHints(meta.filterHints);
      setUsedFallback(false);
    } catch {
      setUsedFallback(true);
      setRemoteRows([]);
      setHints(hintsFromCards(INSTALLER_LEAD_MARKETPLACE_FALLBACK));
    } finally {
      setLoading(false);
    }
  }, [buildingType, systemType, city, debouncedPostcode]);

  useEffect(() => {
    void refreshRemote();
  }, [refreshRemote]);

  const displayed = useMemo(() => {
    if (!usedFallback) return remoteRows;
    return filterLocal(INSTALLER_LEAD_MARKETPLACE_FALLBACK, {
      buildingType,
      systemType,
      city,
      postcode: debouncedPostcode,
    });
  }, [
    usedFallback,
    remoteRows,
    buildingType,
    systemType,
    city,
    debouncedPostcode,
  ]);

  const {
    heading,
    signUpCta,
    signUpHref,
    apiFallbackNotice,
  } = INSTALLER_LEAD_MARKETPLACE_SECTION;

  return (
    <section
      className="bg-lead-marketplace-page-bg"
      data-node-id="3:2206"
      aria-labelledby="installer-lead-marketplace-heading"
    >
      <div className="mx-auto max-w-[1260px] px-4 py-12 sm:px-6 sm:py-14 lg:px-[90px] lg:py-16">
        <h2
          id="installer-lead-marketplace-heading"
          className="text-center font-source-sans text-[22px] font-bold tracking-tight text-ink md:text-[24px]"
        >
          {heading}
        </h2>

        {usedFallback ? (
          <p
            className="mx-auto mt-3 max-w-2xl text-center font-source-sans text-[14px] leading-relaxed text-muted"
            role="status"
          >
            {apiFallbackNotice}
          </p>
        ) : null}

        <div className="mt-8 lg:mt-10">
          <LeadMarketplaceFilterBar
            buildingType={buildingType}
            systemType={systemType}
            city={city}
            postcode={postcodeInput}
            buildingTypes={hints.buildingTypes}
            systemTypes={hints.systemTypes}
            cities={hints.cities}
            onBuildingType={setBuildingType}
            onSystemType={setSystemType}
            onCity={setCity}
            onPostcode={setPostcodeInput}
          />
        </div>

        <div className="mt-10">
          {loading ? (
            <p className="py-16 text-center font-source-sans text-[15px] text-muted">
              Loading leads…
            </p>
          ) : displayed.length === 0 ? (
            <p
              className="rounded-xl border border-dashed border-lead-marketplace-card-border bg-white py-16 text-center font-source-sans text-[15px] text-muted"
              role="status"
            >
              No leads match these filters. Try clearing postcode or choosing
              &ldquo;All&rdquo; in the dropdowns.
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">
              {displayed.map((card) => (
                <li key={card.id}>
                  <LeadMarketplaceCard
                    card={card}
                    signUpLabel={signUpCta}
                    signUpHref={signUpHref}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
