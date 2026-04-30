import type { InstallerLeadMarketplaceCard } from "@/utils/constant";

export type MarketplaceLeadsMeta = {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filterHints: {
    buildingTypes: string[];
    systemTypes: string[];
    cities: string[];
  };
};

type ApiEnvelope = {
  success?: boolean;
  message?: string;
  data?: InstallerLeadMarketplaceCard[];
  meta?: MarketplaceLeadsMeta;
};

export async function fetchPublicMarketplaceLeads(params: {
  page?: number;
  limit?: number;
  buildingType?: string;
  systemType?: string;
  city?: string;
  postcode?: string;
}): Promise<{ leads: InstallerLeadMarketplaceCard[]; meta: MarketplaceLeadsMeta }> {
  const sp = new URLSearchParams();
  sp.set("page", String(params.page ?? 1));
  sp.set("limit", String(params.limit ?? 24));
  if (params.buildingType?.trim())
    sp.set("buildingType", params.buildingType.trim());
  if (params.systemType?.trim()) sp.set("systemType", params.systemType.trim());
  if (params.city?.trim()) sp.set("city", params.city.trim());
  if (params.postcode?.trim()) sp.set("postcode", params.postcode.trim());

  const res = await fetch(`/api/public/leads?${sp.toString()}`, {
    cache: "no-store",
    credentials: "omit",
  });

  const json = (await res.json()) as ApiEnvelope;
  if (!res.ok) {
    throw new Error(
      typeof json.message === "string" ? json.message : "Failed to load leads",
    );
  }

  const leads = Array.isArray(json.data) ? json.data : [];
  const meta = json.meta ?? {
    pagination: {
      page: params.page ?? 1,
      limit: params.limit ?? 24,
      total: leads.length,
      totalPages: 1,
    },
    filterHints: {
      buildingTypes: [],
      systemTypes: [],
      cities: [],
    },
  };

  return { leads, meta };
}
