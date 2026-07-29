import { fetchWithInstallerSession } from "@/lib/installers/installer-fetch-client";

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

export type MasterOverviewAnalytics = {
  kpis: {
    installers: number;
    customers: number;
    activeProducts: number;
    totalLeads: number;
    wonLeads: number;
    conversionRate: number;
    pipelineValue: string;
    invoiceTotal: string;
    invoiceOpen: string;
  };
};

export async function fetchMasterOverviewAnalytics(): Promise<MasterOverviewAnalytics> {
  const res = await fetchWithInstallerSession("/api/admin/analytics/master", {
    cache: "no-store",
  });
  const json = (await res.json()) as ApiEnvelope<MasterOverviewAnalytics>;
  if (!res.ok || !json.data) {
    throw new Error(json.message || "Failed to load master analytics");
  }
  return json.data;
}
