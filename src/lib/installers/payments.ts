import { fetchWithInstallerSession } from "@/lib/installers/installer-fetch-client";

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

/** Installer-facing groupings; the backend maps these to Stripe payment_method_types. */
export type StripePaymentMethodGroup = "auto" | "card" | "paypal" | "bnpl";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

export type InstallerPayment = {
  id: string;
  installerId: string;
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
};

export type StripePaymentStatus = {
  provider: "stripe";
  configured: boolean;
  /** False when STRIPE_SECRET_KEY is set but is not an sk_/rk_ key. */
  keyFormatValid: boolean;
  livemode: boolean;
  webhookConfigured: boolean;
  defaultCurrency: string;
};

export type CreateStripeCheckoutInput = {
  amount: number;
  currency?: string;
  description: string;
  customerId?: string;
  customerEmail: string;
  customerName: string;
  paymentMethod: StripePaymentMethodGroup;
};

export type StripeCheckoutSession = {
  checkoutUrl: string;
  sessionId: string;
  payment: InstallerPayment;
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

export async function fetchStripePaymentStatus(): Promise<StripePaymentStatus> {
  const res = await fetchWithInstallerSession(
    "/api/installers/payments/stripe/status",
  );
  return readEnvelope<StripePaymentStatus>(res, "Could not load payment status");
}

export async function createStripeCheckout(
  input: CreateStripeCheckoutInput,
): Promise<StripeCheckoutSession> {
  const res = await fetchWithInstallerSession(
    "/api/installers/payments/stripe/checkout",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
  );
  const data = await readEnvelope<StripeCheckoutSession>(
    res,
    "Could not start payment checkout",
  );
  if (!data.checkoutUrl) {
    throw new Error("Invalid payment checkout response");
  }
  return data;
}

export async function fetchInstallerPayments(params?: {
  customerId?: string;
  limit?: number;
}): Promise<InstallerPayment[]> {
  const sp = new URLSearchParams();
  if (params?.customerId) sp.set("customerId", params.customerId);
  if (params?.limit != null) sp.set("limit", String(params.limit));
  const qs = sp.toString();

  const res = await fetchWithInstallerSession(
    `/api/installers/payments${qs ? `?${qs}` : ""}`,
  );
  return readEnvelope<InstallerPayment[]>(res, "Could not load payments");
}

/**
 * Pulls the latest state from Stripe. Useful right after the checkout redirect,
 * when the webhook may not have landed yet.
 */
export async function refreshInstallerPayment(
  paymentId: string,
): Promise<InstallerPayment> {
  const res = await fetchWithInstallerSession(
    `/api/installers/payments/${encodeURIComponent(paymentId)}/refresh`,
    { method: "POST" },
  );
  return readEnvelope<InstallerPayment>(res, "Could not refresh payment");
}

export function formatPaymentAmount(payment: {
  amount: number;
  currency: string;
}): string {
  try {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: payment.currency,
    }).format(payment.amount);
  } catch {
    return `${payment.amount.toFixed(2)} ${payment.currency}`;
  }
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: "Awaiting payment",
  PAID: "Paid",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

export const INSTALLER_PAYMENT_BRANDS = [
  {
    id: "auto",
    label: "All available methods",
    logos: [
      { name: "Visa", src: "/images/home/payment-visa.svg" },
      { name: "Mastercard", src: "/images/home/payment-mastercard.png" },
      { name: "American Express", src: "/images/home/payment-amex.png" },
      { name: "PayPal", src: "/images/home/payment-paypal.png" },
      { name: "Afterpay", src: "/images/home/payment-afterpay.png" },
    ],
    note: "Stripe shows every method enabled on your account for the customer's country.",
  },
  {
    id: "card",
    label: "Card only",
    logos: [
      { name: "Visa", src: "/images/home/payment-visa.svg" },
      { name: "Mastercard", src: "/images/home/payment-mastercard.png" },
      { name: "American Express", src: "/images/home/payment-amex.png" },
    ],
  },
  {
    id: "paypal",
    label: "PayPal",
    logos: [{ name: "PayPal", src: "/images/home/payment-paypal.png" }],
  },
  {
    id: "bnpl",
    label: "Buy now, pay later",
    logos: [
      { name: "Afterpay", src: "/images/home/payment-afterpay.png" },
      { name: "Klarna", src: "/images/home/payment-klarna.png" },
      { name: "Zip", src: "/images/home/payment-zip.png" },
    ],
    note: "Afterpay, Klarna and Zip must be enabled in your Stripe Dashboard first.",
  },
] as const satisfies ReadonlyArray<{
  id: StripePaymentMethodGroup;
  label: string;
  logos: ReadonlyArray<{ name: string; src: string }>;
  note?: string;
}>;
