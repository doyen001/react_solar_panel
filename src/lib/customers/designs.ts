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
  latitude?: number | null;
  longitude?: number | null;
  roofArea?: number | null;
  annualSunlight?: number | null;
  panelCount?: number | null;
  estimatedSavings?: number | null;
  status: "DRAFT" | "IN_PROGRESS" | "COMPLETED" | "ARCHIVED";
  /**
   * Server-computed: the one design that represents this customer. The
   * installer home panel resolves through the same rule, so both portals always
   * show the same design.
   */
  isPrimary?: boolean;
  /** Free-text requests the customer added from their design page. */
  customerNotes?: string | null;
  solarData?: unknown;
  wizardData?: unknown;
  createdAt: string;
  updatedAt: string;
  products?: CustomerDesignProduct[];
  /** Owner details, used to prefill the design builder's customer step. */
  user?: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
  } | null;
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

/** Fields a customer may change; sizing and pricing stay installer-owned. */
export type CustomerDesignEdit = {
  title?: string;
  address?: string;
  customerNotes?: string;
};

/** True while the installer has not yet approved (or archived) the design. */
export function isCustomerEditableDesign(design: CustomerDesign): boolean {
  return design.status === "DRAFT" || design.status === "IN_PROGRESS";
}

export async function updateCustomerDesign(
  designId: string,
  input: CustomerDesignEdit,
): Promise<CustomerDesign> {
  const res = await fetchWithCustomerSession(
    `/api/customers/designs/${encodeURIComponent(designId)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
  );
  const json = (await res.json().catch(() => ({}))) as ApiEnvelope<CustomerDesign>;
  if (!res.ok || !json.data) {
    throw new Error(json.message || "Could not save your changes");
  }
  return json.data;
}
