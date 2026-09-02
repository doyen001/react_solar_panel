/**
 * "Get Free Quote" checkout on the /services pricing cards — sign in with
 * Google right in the checkout step (no account needed), then straight to
 * Stripe. Talks directly to the backend's public "ad quote" endpoints (the
 * same ones solar-panel-ad uses); nothing sensitive is trusted from this
 * client — the backend verifies the Google ID token and looks up the
 * tier's real price itself.
 */

export type AdQuoteTierId = "starter" | "business";

export type AdQuotePaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

export type AdQuotePayment = {
  id: string;
  status: AdQuotePaymentStatus;
  amount: number;
  currency: string;
  description: string;
  customerEmail: string;
  customerName: string;
  receiptUrl: string | null;
  failureMessage: string | null;
  paidAt: string | null;
};

export type AdQuoteCheckoutSession = {
  checkoutUrl: string;
  sessionId: string;
  payment: AdQuotePayment;
};

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

function backendBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_BACKEND_API_BASE_URL is not configured for this site.",
    );
  }
  return url.replace(/\/$/, "");
}

async function readEnvelope<T>(res: Response, fallback: string): Promise<T> {
  const json = (await res.json().catch(() => ({}))) as ApiEnvelope<T>;
  if (!res.ok || json.data === undefined) {
    throw new Error(json.message || fallback);
  }
  return json.data;
}

/** Starts a Stripe Checkout for one of the fixed-price website packages. */
export async function createAdQuoteCheckout(input: {
  tierId: AdQuoteTierId;
  googleIdToken: string;
}): Promise<AdQuoteCheckoutSession> {
  const res = await fetch(`${backendBaseUrl()}/payments/ad-quote/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, site: "main" }),
  });
  const data = await readEnvelope<AdQuoteCheckoutSession>(
    res,
    "Could not start checkout",
  );
  if (!data.checkoutUrl) {
    throw new Error("Invalid checkout response");
  }
  return data;
}

/**
 * Pulls the latest state from Stripe. Useful right after the checkout
 * redirect, when the webhook may not have landed yet.
 */
export async function refreshAdQuotePayment(
  paymentId: string,
): Promise<AdQuotePayment> {
  const res = await fetch(
    `${backendBaseUrl()}/payments/ad-quote/${encodeURIComponent(paymentId)}/refresh`,
    { method: "POST" },
  );
  return readEnvelope<AdQuotePayment>(res, "Could not refresh payment");
}
