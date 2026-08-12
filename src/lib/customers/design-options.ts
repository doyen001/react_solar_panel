import { fetchWithCustomerSession } from "@/lib/customers/customer-fetch-client";
import type { CustomerDesign } from "@/lib/customers/designs";

/** The fourth card is the customer's own design; the other three are packages. */
export const CUSTOM_DESIGN_OPTION_KEY = "custom";

export type DesignOptionCard = {
  key: string;
  designId: string | null;
  title: string;
  summary: string;
  kw: number;
  panelCount: number;
  price: number;
  estimatedSavings: number;
  annualOutputKwh: number;
  imageSrc: string;
  isCustom: boolean;
  selected: boolean;
  editable: boolean;
  status: CustomerDesign["status"] | null;
};

export type DesignOptions = {
  options: DesignOptionCard[];
  selectedKey: string | null;
  selectedDesignId: string | null;
  /** True once the chosen design is approved — the choice can no longer change. */
  locked: boolean;
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

export async function fetchDesignOptions(): Promise<DesignOptions> {
  const res = await fetchWithCustomerSession("/api/customers/design-options");
  return readEnvelope<DesignOptions>(res, "Could not load your design options");
}

export async function selectDesignOption(key: string): Promise<DesignOptions> {
  const res = await fetchWithCustomerSession("/api/customers/design-options", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key }),
  });
  return readEnvelope<DesignOptions>(res, "Could not save your selection");
}

export function formatOptionPrice(value: number): string {
  if (!value) return "—";
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value);
}
