import { fetchWithInstallerSession } from "@/lib/installers/installer-fetch-client";

export const INSTALLER_CUSTOMER_TYPES = [
  "Individual",
  "Business",
  "Trust",
  "Company",
] as const;

export type InstallerCustomerType = (typeof INSTALLER_CUSTOMER_TYPES)[number];

export type InstallerCustomerHomeProfile = {
  customerType: InstallerCustomerType;
  salePrice: number;
  profit: number;
};

export type InstallerCustomerSummary = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  homeProfile?: InstallerCustomerHomeProfile | null;
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
  leadLinkedOnly?: boolean;
}) {
  const sp = new URLSearchParams();
  if (params.page != null) sp.set("page", String(params.page));
  if (params.limit != null) sp.set("limit", String(params.limit));
  if (params.search?.trim()) sp.set("search", params.search.trim());
  if (params.leadLinkedOnly) sp.set("leadLinkedOnly", "true");
  const qs = sp.toString();
  return `/api/installers/customers${qs ? `?${qs}` : ""}`;
}

const inflightCustomerFetches = new Map<
  string,
  Promise<InstallerCustomerSummary[]>
>();
const recentCustomerResults = new Map<
  string,
  { at: number; result: InstallerCustomerSummary[] }
>();
const RECENT_CUSTOMER_RESULT_MS = 5_000;

export async function fetchInstallerCustomers(
  params: {
    page?: number;
    limit?: number;
    search?: string;
    leadLinkedOnly?: boolean;
  } = {},
  init?: RequestInit,
): Promise<InstallerCustomerSummary[]> {
  const url = buildInstallerCustomersUrl(params);
  const inflight = inflightCustomerFetches.get(url);
  if (inflight) return inflight;

  const cached = recentCustomerResults.get(url);
  if (cached && Date.now() - cached.at < RECENT_CUSTOMER_RESULT_MS) {
    return cached.result;
  }

  let promise!: Promise<InstallerCustomerSummary[]>;
  promise = (async () => {
    try {
      const res = await fetchWithInstallerSession(url, {
        cache: "no-store",
        ...init,
      });
      const json = (await res.json()) as ApiEnvelope<InstallerCustomerSummary[]>;
      if (!res.ok) {
        throw new Error(json.message || "Failed to load customers");
      }
      const result = Array.isArray(json.data) ? json.data : [];
      recentCustomerResults.set(url, { at: Date.now(), result });
      return result;
    } finally {
      if (inflightCustomerFetches.get(url) === promise) {
        inflightCustomerFetches.delete(url);
      }
    }
  })();

  inflightCustomerFetches.set(url, promise);
  return promise;
}

/** Test-only helper to reset module-level customer fetch dedupe state. */
export function resetInstallerCustomerListCacheForTests() {
  inflightCustomerFetches.clear();
  recentCustomerResults.clear();
}

export function invalidateInstallerCustomerListCache(
  params: {
    page?: number;
    limit?: number;
    search?: string;
    leadLinkedOnly?: boolean;
  } = { limit: 100, leadLinkedOnly: true },
) {
  recentCustomerResults.delete(buildInstallerCustomersUrl(params));
}

export async function fetchInstallerCustomer(
  id: string,
  init?: RequestInit,
): Promise<InstallerCustomerSummary> {
  const res = await fetchWithInstallerSession(`/api/installers/customers/${id}`, {
    cache: "no-store",
    ...init,
  });
  const json = (await res.json()) as ApiEnvelope<InstallerCustomerSummary>;
  if (!res.ok) {
    throw new Error(json.message || "Failed to load customer");
  }
  if (!json.data) {
    throw new Error(json.message || "Customer not found");
  }
  return json.data;
}

export type UpdateInstallerCustomerHomeProfileInput = {
  firstName: string;
  lastName: string;
  phone?: string;
  email: string;
  customerType: InstallerCustomerType;
  salePrice: number;
  profit: number;
};

export async function updateInstallerCustomerHomeProfile(
  customerId: string,
  input: UpdateInstallerCustomerHomeProfileInput,
): Promise<InstallerCustomerSummary> {
  const res = await fetchWithInstallerSession(
    `/api/installers/customers/${customerId}/home-profile`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
  );
  const json = (await res.json()) as ApiEnvelope<InstallerCustomerSummary>;
  if (!res.ok) {
    throw new Error(json.message || "Failed to update customer profile");
  }
  if (!json.data) {
    throw new Error(json.message || "Failed to update customer profile");
  }
  return json.data;
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
