import { fetchWithInstallerSession } from "@/lib/installers/installer-fetch-client";

export const INSTALLER_LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL_SENT",
  "NEGOTIATION",
  "WON",
  "LOST",
] as const;

export type InstallerLeadStatus = (typeof INSTALLER_LEAD_STATUSES)[number];

export type InstallerLeadAssignee = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
};

export type InstallerLeadSummary = {
  id: string;
  customerName: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  address?: string | null;
  status: string;
  notes?: string | null;
  estimatedValue?: number | null;
  assignedToId?: string | null;
  assignedTo?: InstallerLeadAssignee | null;
  createdAt?: string;
  updatedAt?: string;
  design?: { id: string; title?: string | null; status?: string | null } | null;
};

export type AssignableUser = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
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

export type LeadListResult = {
  leads: InstallerLeadSummary[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export function formatPersonName(
  u: Pick<
    InstallerLeadAssignee | AssignableUser,
    "firstName" | "lastName" | "email"
  >,
) {
  const n = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
  if (n) return n;
  return u.email ?? "Unknown";
}

export function buildLeadsListUrl(params: {
  page: number;
  limit: number;
  status?: InstallerLeadStatus | "";
  search?: string;
  /** Only applied for admin on backend; safe to send for installer (ignored). */
  assignedToId?: string;
}) {
  const sp = new URLSearchParams();
  sp.set("page", String(params.page));
  sp.set("limit", String(params.limit));
  if (params.status) sp.set("status", params.status);
  if (params.search?.trim()) sp.set("search", params.search.trim());
  if (params.assignedToId?.trim()) {
    sp.set("assignedToId", params.assignedToId.trim());
  }
  const qs = sp.toString();
  return `/api/installers/leads${qs ? `?${qs}` : ""}`;
}

export async function fetchInstallerLeads(
  params: Parameters<typeof buildLeadsListUrl>[0],
): Promise<LeadListResult> {
  const res = await fetchWithInstallerSession(buildLeadsListUrl(params), {
    cache: "no-store",
  });
  const json = (await res.json()) as ApiEnvelope<InstallerLeadSummary[]>;
  if (!res.ok) {
    throw new Error(json.message || "Failed to load leads");
  }
  return {
    leads: Array.isArray(json.data) ? json.data : [],
    meta: json.meta?.pagination,
  };
}

export async function fetchInstallerLeadDetail(
  id: string,
): Promise<InstallerLeadSummary> {
  const res = await fetchWithInstallerSession(
    `/api/installers/leads/${encodeURIComponent(id)}`,
    { cache: "no-store" },
  );
  const json = (await res.json()) as ApiEnvelope<InstallerLeadSummary>;
  if (!res.ok) {
    throw new Error(json.message || "Failed to load lead");
  }
  if (!json.data) {
    throw new Error("Lead not found");
  }
  return json.data;
}

export async function patchInstallerLead(
  id: string,
  body: Partial<{
    status: InstallerLeadStatus;
    notes: string;
    customerName: string;
  }>,
) {
  const res = await fetchWithInstallerSession(
    `/api/installers/leads/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  const json = (await res.json()) as ApiEnvelope<InstallerLeadSummary>;
  if (!res.ok) {
    throw new Error(json.message || "Update failed");
  }
  return json.data;
}

export async function assignInstallerLead(id: string, assignedToId: string) {
  const res = await fetchWithInstallerSession(
    `/api/installers/leads/${encodeURIComponent(id)}/assign`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignedToId }),
    },
  );
  const json = (await res.json()) as ApiEnvelope<InstallerLeadSummary>;
  if (!res.ok) {
    throw new Error(json.message || "Assign failed");
  }
  return json.data;
}

export async function fetchAssignableUsersForLeads(): Promise<AssignableUser[]> {
  const res = await fetchWithInstallerSession(
    "/api/installers/users/assignable-for-leads",
    { cache: "no-store" },
  );
  const json = (await res.json()) as ApiEnvelope<AssignableUser[]>;
  if (!res.ok) {
    throw new Error(json.message || "Failed to load users");
  }
  return Array.isArray(json.data) ? json.data : [];
}
