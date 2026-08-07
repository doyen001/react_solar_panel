import { fetchWithCustomerSession } from "@/lib/customers/customer-fetch-client";

export type CustomerDocument = {
  id: string;
  installerId: string;
  customerId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  createdAt: string;
};

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

/** Every document an installer has uploaded for the signed-in customer, newest first. */
export async function fetchCustomerDocuments(
  init?: RequestInit,
): Promise<CustomerDocument[]> {
  const res = await fetchWithCustomerSession("/api/customers/documents", {
    cache: "no-store",
    ...init,
  });
  const json = (await res.json()) as ApiEnvelope<CustomerDocument[]>;
  if (!res.ok) {
    throw new Error(json.message || "Failed to load documents");
  }
  return Array.isArray(json.data) ? json.data : [];
}

export function formatDocumentSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
