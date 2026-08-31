import { fetchWithCustomerSession } from "@/lib/customers/customer-fetch-client";

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED" | "REFUNDED";

export type CustomerPayment = {
  id: string;
  installerId: string | null;
  customerId: string | null;
  status: PaymentStatus;
  amount: number;
  amountRefunded: number;
  amountMinor: number;
  currency: string;
  description: string;
  customerEmail: string;
  customerName: string;
  stripeSessionId: string;
  stripePaymentIntentId: string | null;
  receiptUrl: string | null;
  failureMessage: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  kind: "SERVICE" | "PRODUCT_ORDER";
  productId: string | null;
  quantity: number | null;
};

export type ProductCheckoutSession = {
  checkoutUrl: string;
  sessionId: string;
  payment: CustomerPayment;
};

async function readEnvelope<T>(res: Response, fallback: string): Promise<T> {
  const json = (await res.json().catch(() => ({}))) as ApiEnvelope<T>;
  if (!res.ok) {
    throw new Error(json.message || fallback);
  }
  if (json.data === undefined) {
    throw new Error(json.message || fallback);
  }
  return json.data;
}

/** Starts a Stripe Checkout for buying one catalogue product directly. */
export async function createProductCheckout(input: {
  productId: string;
  quantity: number;
}): Promise<ProductCheckoutSession> {
  const res = await fetchWithCustomerSession(
    "/api/customers/payments/products/checkout",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
  );
  const data = await readEnvelope<ProductCheckoutSession>(
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
export async function refreshCustomerPayment(
  paymentId: string,
): Promise<CustomerPayment> {
  const res = await fetchWithCustomerSession(
    `/api/customers/payments/${encodeURIComponent(paymentId)}/refresh`,
    { method: "POST" },
  );
  return readEnvelope<CustomerPayment>(res, "Could not refresh payment");
}
