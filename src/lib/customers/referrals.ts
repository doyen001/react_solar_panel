import { fetchWithCustomerSession } from "@/lib/customers/customer-fetch-client";

export type ReferralStatus = "PENDING" | "CONVERTED" | "CANCELLED";

export type ReferralSummary = {
  id: string;
  referredEmail: string;
  referredName: string | null;
  status: ReferralStatus;
  rewardAmount: number;
  convertedAt: string | null;
  createdAt: string;
};

export type ReferralOverview = {
  referralCode: string;
  rewardAmount: number;
  sent: number;
  converted: number;
  earned: number;
  referrals: ReferralSummary[];
};

export type ShareLink = {
  shareToken: string;
  referralCode: string;
};

/** Privacy-trimmed public view: no address, price or contact details. */
export type SharedJourney = {
  ownerFirstName: string;
  referralCode: string | null;
  title: string;
  panelCount: number | null;
  systemSizeKw: number | null;
  estimatedSavings: number | null;
  hasBattery: boolean;
  status: "DRAFT" | "IN_PROGRESS" | "COMPLETED" | "ARCHIVED";
  updatedAt: string;
};

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

async function readEnvelope<T>(res: Response, fallback: string): Promise<T> {
  const json = (await res.json().catch(() => ({}))) as ApiEnvelope<T>;
  if (!res.ok || json.data === undefined) {
    throw new Error(json.message || fallback);
  }
  return json.data;
}

export async function fetchReferralOverview(): Promise<ReferralOverview> {
  const res = await fetchWithCustomerSession("/api/customers/referrals");
  return readEnvelope<ReferralOverview>(
    res,
    "Could not load your referral details",
  );
}

export async function inviteReferral(input: {
  email: string;
  name?: string;
}): Promise<ReferralSummary & { emailSent: boolean }> {
  const res = await fetchWithCustomerSession(
    "/api/customers/referrals/invites",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
  );
  return readEnvelope<ReferralSummary & { emailSent: boolean }>(
    res,
    "Could not record that referral",
  );
}

/** Creates the share token on first use; stable thereafter. */
export async function createShareLink(designId: string): Promise<ShareLink> {
  const res = await fetchWithCustomerSession(
    `/api/customers/referrals/share/${encodeURIComponent(designId)}`,
    { method: "POST" },
  );
  return readEnvelope<ShareLink>(res, "Could not create your share link");
}

export async function fetchSharedJourney(
  token: string,
): Promise<SharedJourney> {
  const res = await fetch(
    `/api/referrals/shared/${encodeURIComponent(token)}`,
    { cache: "no-store" },
  );
  return readEnvelope<SharedJourney>(res, "This shared design is unavailable");
}

/**
 * The public URL for a shared journey, carrying the referral code so a share
 * doubles as a referral — a visitor who signs up from it is attributed.
 */
export function buildShareUrl(link: ShareLink, origin?: string): string {
  const base = origin ?? (typeof window !== "undefined" ? window.location.origin : "");
  const params = new URLSearchParams();
  if (link.referralCode) params.set("ref", link.referralCode);
  const qs = params.toString();
  return `${base}/shared/${link.shareToken}${qs ? `?${qs}` : ""}`;
}

/** Signup link for the "Refer a Friend" action — no design is exposed. */
export function buildReferralSignupUrl(
  referralCode: string,
  origin?: string,
): string {
  const base = origin ?? (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}/customers/auth?ref=${encodeURIComponent(referralCode)}`;
}

export function formatReferralCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Share intents per network, opened in a popup rather than navigating away. */
export function socialShareUrl(
  network: "facebook" | "twitter" | "linkedin" | "email",
  shareUrl: string,
  message: string,
): string {
  const url = encodeURIComponent(shareUrl);
  const text = encodeURIComponent(message);

  switch (network) {
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    case "twitter":
      return `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    case "email":
      return `mailto:?subject=${encodeURIComponent(
        "My solar journey",
      )}&body=${text}%20${url}`;
  }
}
