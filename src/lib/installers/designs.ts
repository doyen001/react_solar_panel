import { fetchWithInstallerSession } from "@/lib/installers/installer-fetch-client";

export type InstallerDesignProduct = {
  id: string;
  quantity: number;
  totalPrice: number;
  product?: {
    id: string;
    name: string;
    brand?: string | null;
    category: string;
    description?: string | null;
    wattage?: number | null;
    price: number;
    sku?: string | null;
    specs?: unknown;
  } | null;
};

export type InstallerCustomerDesign = {
  id: string;
  userId: string;
  title: string;
  address?: string | null;
  roofArea?: number | null;
  annualSunlight?: number | null;
  panelCount?: number | null;
  estimatedSavings?: number | null;
  status: "DRAFT" | "IN_PROGRESS" | "COMPLETED" | "ARCHIVED";
  solarData?: unknown;
  wizardData?: unknown;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
  } | null;
  products?: InstallerDesignProduct[];
  lead?: {
    id: string;
    status?: string | null;
  } | null;
};

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

export function buildInstallerDesignsUrl(params: {
  page?: number;
  limit?: number;
  status?: InstallerCustomerDesign["status"];
  search?: string;
  customerId?: string;
  customerEmail?: string | null;
}) {
  const sp = new URLSearchParams();
  if (params.page != null) sp.set("page", String(params.page));
  if (params.limit != null) sp.set("limit", String(params.limit));
  if (params.status) sp.set("status", params.status);
  if (params.search?.trim()) sp.set("search", params.search.trim());
  if (params.customerId) sp.set("customerId", params.customerId);
  if (params.customerEmail?.trim()) {
    sp.set("customerEmail", params.customerEmail.trim());
  }
  const qs = sp.toString();
  return `/api/installers/designs${qs ? `?${qs}` : ""}`;
}

export async function fetchInstallerDesigns(
  params: Parameters<typeof buildInstallerDesignsUrl>[0] = {},
  init?: RequestInit,
): Promise<InstallerCustomerDesign[]> {
  const res = await fetchWithInstallerSession(buildInstallerDesignsUrl(params), {
    cache: "no-store",
    ...init,
  });
  const json = (await res.json()) as ApiEnvelope<InstallerCustomerDesign[]>;
  if (!res.ok) {
    throw new Error(json.message || "Failed to load designs");
  }
  return Array.isArray(json.data) ? json.data : [];
}
