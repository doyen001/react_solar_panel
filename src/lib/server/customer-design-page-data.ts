import { backendAuthedFetch } from "@/lib/server/backend-authed-fetch";
import type { CustomerDesign } from "@/lib/customers/designs";
import type { ReferralOverview } from "@/lib/customers/referrals";

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

/**
 * Best-effort server-side priming for `/customers/design`, hitting the
 * backend directly (one hop, not browser → Next route → backend) so the
 * page can render with real data in its first HTML instead of a loading
 * state followed by a client-side fetch waterfall.
 *
 * "Best-effort" is the operative word: this has no access to the browser's
 * httpOnly refresh-token cookie dance (`fetchWithCustomerSession` does that
 * reactively — 401, refresh, retry, and only then give up and redirect to
 * sign-in). An expired access token here just means `backendAuthedFetch`
 * 401s and these return `null` rather than throwing. The client component
 * treats `null` as "server couldn't prime this" and falls back to its own
 * fetch exactly as before, refresh-and-redirect included — so the only cost
 * of that edge case is one extra round trip, never a broken or stuck page.
 */
export async function fetchCustomerDesignsOnServer(): Promise<
  CustomerDesign[] | null
> {
  try {
    const res = await backendAuthedFetch("customer", "/designs?limit=20");
    if (!res.ok) return null;
    const json = (await res.json()) as ApiEnvelope<CustomerDesign[]>;
    return Array.isArray(json.data) ? json.data : [];
  } catch {
    return null;
  }
}

export async function fetchReferralOverviewOnServer(): Promise<
  ReferralOverview | null
> {
  try {
    const res = await backendAuthedFetch("customer", "/referrals/me");
    if (!res.ok) return null;
    const json = (await res.json()) as ApiEnvelope<ReferralOverview>;
    return json.data ?? null;
  } catch {
    return null;
  }
}
