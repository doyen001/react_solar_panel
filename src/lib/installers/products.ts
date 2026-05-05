"use client";

import { useCallback, useEffect, useState } from "react";
import { usePollingResource } from "@/hooks/usePollingResource";
import { fetchWithInstallerSession } from "@/lib/installers/installer-fetch-client";

export type InstallerProductSummary = {
  id: string;
  name: string;
  brand?: string | null;
  category: string;
  description?: string | null;
  wattage?: number | null;
  basePrice: number;
  imageUrl?: string | null;
  active?: boolean | null;
};

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

export type InstallerProductListResult = {
  products: InstallerProductSummary[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export function buildInstallerProductsUrl(params: {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  search?: string;
  active?: boolean;
}) {
  const sp = new URLSearchParams();
  if (params.page != null) sp.set("page", String(params.page));
  if (params.limit != null) sp.set("limit", String(params.limit));
  if (params.category?.trim()) sp.set("category", params.category.trim());
  if (params.brand?.trim()) sp.set("brand", params.brand.trim());
  if (params.search?.trim()) sp.set("search", params.search.trim());
  if (params.active !== undefined) sp.set("active", String(params.active));
  const qs = sp.toString();
  return `/api/installers/products${qs ? `?${qs}` : ""}`;
}

export async function fetchInstallerProducts(
  params: {
    page?: number;
    limit?: number;
    category?: string;
    brand?: string;
    search?: string;
    active?: boolean;
  } = {},
  init?: RequestInit,
): Promise<InstallerProductListResult> {
  const res = await fetchWithInstallerSession(
    buildInstallerProductsUrl(params),
    {
      cache: "no-store",
      ...init,
    },
  );
  const json = (await res.json()) as ApiEnvelope<InstallerProductSummary[]>;
  if (!res.ok) {
    throw new Error(json.message || "Failed to load products");
  }
  return {
    products: Array.isArray(json.data) ? json.data : [],
    meta: json.meta?.pagination,
  };
}

function isAbortError(e: unknown) {
  return e instanceof DOMException && e.name === "AbortError";
}

/**
 * Visibility-aware polled products list for installer CRM surfaces (catalog / pricing).
 */
export function useInstallerProductsList(
  params: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    enabled?: boolean;
    pollIntervalMs?: number;
  } = {},
) {
  const {
    page = 1,
    limit = 50,
    category,
    search,
    enabled = true,
    pollIntervalMs,
  } = params;

  const [products, setProducts] = useState<InstallerProductSummary[]>([]);
  const [meta, setMeta] = useState<InstallerProductListResult["meta"]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (opts?: { silent?: boolean; signal?: AbortSignal }) => {
      const silent = opts?.silent ?? false;
      if (!silent) {
        setLoading(true);
      }
      setError(null);
      try {
        const result = await fetchInstallerProducts(
          { page, limit, category, search },
          { signal: opts?.signal },
        );
        setProducts(result.products);
        setMeta(result.meta);
      } catch (e) {
        if (isAbortError(e)) return;
        setError(e instanceof Error ? e.message : "Could not load products");
        setProducts([]);
        setMeta(undefined);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [page, limit, category, search],
  );

  useEffect(() => {
    void load();
  }, [load]);

  usePollingResource(
    useCallback(
      async (signal) => {
        await load({ silent: true, signal });
      },
      [load],
    ),
    {
      enabled,
      intervalMs: pollIntervalMs,
      skipInitialTick: true,
    },
  );

  return {
    products,
    meta,
    loading,
    error,
    refetch: () => void load(),
  };
}
