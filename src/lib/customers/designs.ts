import { fetchWithCustomerSession } from "@/lib/customers/customer-fetch-client";

export type CustomerDesignProduct = {
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

export type CustomerDesign = {
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
  products?: CustomerDesignProduct[];
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

export function buildCustomerDesignsUrl(params: {
  page?: number;
  limit?: number;
  status?: CustomerDesign["status"];
  search?: string;
}) {
  const sp = new URLSearchParams();
  if (params.page != null) sp.set("page", String(params.page));
  if (params.limit != null) sp.set("limit", String(params.limit));
  if (params.status) sp.set("status", params.status);
  if (params.search?.trim()) sp.set("search", params.search.trim());
  const qs = sp.toString();
  return `/api/customers/designs${qs ? `?${qs}` : ""}`;
}

export async function fetchCustomerDesigns(
  params: Parameters<typeof buildCustomerDesignsUrl>[0] = {},
  init?: RequestInit,
): Promise<CustomerDesign[]> {
  const res = await fetchWithCustomerSession(buildCustomerDesignsUrl(params), {
    cache: "no-store",
    ...init,
  });
  const json = (await res.json()) as ApiEnvelope<CustomerDesign[]>;
  if (!res.ok) {
    throw new Error(json.message || "Failed to load designs");
  }
  return Array.isArray(json.data) ? json.data : [];
}
