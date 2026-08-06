import { fetchWithInstallerSession } from "@/lib/installers/installer-fetch-client";

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

export type UnlimitPaymentMethod = "BANKCARD" | "PAYPAL";

export type CreateUnlimitCheckoutInput = {
  amount: number;
  currency?: string;
  description: string;
  customerId?: string;
  customerEmail: string;
  customerName: string;
  paymentMethod: UnlimitPaymentMethod;
};

export type UnlimitCheckoutSession = {
  redirectUrl: string;
  paymentId: string | null;
  orderId: string;
};

export async function fetchUnlimitPaymentStatus(): Promise<{ configured: boolean }> {
  const res = await fetchWithInstallerSession("/api/installers/payments/unlimit/status");
  const json = (await res.json()) as ApiEnvelope<{ configured: boolean }>;
  if (!res.ok) {
    throw new Error(json.message || "Could not load payment status");
  }
  return json.data ?? { configured: false };
}

export async function createUnlimitCheckout(
  input: CreateUnlimitCheckoutInput,
): Promise<UnlimitCheckoutSession> {
  const res = await fetchWithInstallerSession(
    "/api/installers/payments/unlimit/checkout",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
  );
  const json = (await res.json()) as ApiEnvelope<UnlimitCheckoutSession>;
  if (!res.ok) {
    throw new Error(json.message || "Could not start payment checkout");
  }
  if (!json.data?.redirectUrl) {
    throw new Error(json.message || "Invalid payment checkout response");
  }
  return json.data;
}

export const INSTALLER_PAYMENT_BRANDS = [
  {
    id: "card",
    label: "Card",
    paymentMethod: "BANKCARD" as const,
    logos: [
      { name: "Visa", src: "/images/home/payment-visa.svg" },
      { name: "Mastercard", src: "/images/home/payment-mastercard.png" },
      { name: "American Express", src: "/images/home/payment-amex.png" },
    ],
  },
  {
    id: "paypal",
    label: "PayPal",
    paymentMethod: "PAYPAL" as const,
    logos: [{ name: "PayPal", src: "/images/home/payment-paypal.png" }],
  },
  {
    id: "bnpl",
    label: "Buy now, pay later",
    paymentMethod: "BANKCARD" as const,
    logos: [
      { name: "Zip", src: "/images/home/payment-zip.png" },
      { name: "Afterpay", src: "/images/home/payment-afterpay.png" },
      { name: "Klarna", src: "/images/home/payment-klarna.png" },
      { name: "Humm", src: "/images/home/payment-humm.png" },
    ],
    note: "BNPL options appear on the secure checkout page when enabled for your account.",
  },
] as const;
