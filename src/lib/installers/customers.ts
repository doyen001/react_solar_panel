import { fetchWithInstallerSession } from "@/lib/installers/installer-fetch-client";

export type InstallerCustomerSummary = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
};

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

export function buildInstallerCustomersUrl(params: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const sp = new URLSearchParams();
  if (params.page != null) sp.set("page", String(params.page));
  if (params.limit != null) sp.set("limit", String(params.limit));
  if (params.search?.trim()) sp.set("search", params.search.trim());
  const qs = sp.toString();
  return `/api/installers/customers${qs ? `?${qs}` : ""}`;
}

export async function fetchInstallerCustomers(
  params: {
    page?: number;
    limit?: number;
    search?: string;
  } = {},
  init?: RequestInit,
): Promise<InstallerCustomerSummary[]> {
  const res = await fetchWithInstallerSession(
    buildInstallerCustomersUrl(params),
    {
      cache: "no-store",
      ...init,
    },
  );
  const json = (await res.json()) as ApiEnvelope<InstallerCustomerSummary[]>;
  if (!res.ok) {
    throw new Error(json.message || "Failed to load customers");
  }
  return Array.isArray(json.data) ? json.data : [];
}

export type CustomerImportRowInput = {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
};

export type CustomerImportRowResult = {
  rowNumber: number;
  status: "created" | "skipped" | "failed";
  email?: string;
  message?: string;
  customerId?: string;
};

export type CustomerImportResult = {
  created: number;
  skipped: number;
  failed: number;
  rows: CustomerImportRowResult[];
};

export async function importInstallerCustomers(
  rows: CustomerImportRowInput[],
  options: { dryRun?: boolean } = {},
): Promise<CustomerImportResult> {
  const res = await fetchWithInstallerSession(
    "/api/installers/customers/import",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rows,
        dryRun: options.dryRun ?? false,
      }),
    },
  );
  const json = (await res.json()) as ApiEnvelope<CustomerImportResult>;
  if (!res.ok) {
    throw new Error(json.message || "Import failed");
  }
  if (!json.data) {
    throw new Error(json.message || "Import failed");
  }
  return json.data;
}
