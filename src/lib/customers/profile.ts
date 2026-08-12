import { fetchWithCustomerSession } from "@/lib/customers/customer-fetch-client";

/**
 * Contact details the customer may change about themselves.
 *
 * Email is absent on purpose: it is the login, and the backend's
 * `updateProfileSchema` excludes it so it cannot be changed by a generic
 * profile patch. Changing it needs uniqueness handling and re-verification.
 */
export type CustomerProfileUpdate = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
};

export type UpdatedCustomerProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  address?: string | null;
};

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

/** "Ryan Ben" → given "Ryan", family "Ben"; a single word leaves the surname alone. */
export function splitPersonName(fullName: string): {
  firstName?: string;
  lastName?: string;
} {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return {};
  if (parts.length === 1) return { firstName: parts[0] };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

/**
 * `react-phone-input-2` yields bare digits ("61417119222"), while stored numbers
 * are E.164 ("+61 417 119 217"). Normalising keeps one shape on the record.
 */
export function normalizePhone(phone: string): string {
  const trimmed = phone.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("+")) return trimmed;
  return /^\d{7,}$/.test(trimmed.replace(/\s/g, ""))
    ? `+${trimmed.replace(/\s/g, "")}`
    : trimmed;
}

/** Only the fields that actually differ, so an unchanged save is a no-op. */
export function profileDiff(
  current: { firstName?: string | null; lastName?: string | null; phone?: string | null },
  next: { name?: string; phoneNumber?: string },
): CustomerProfileUpdate {
  const update: CustomerProfileUpdate = {};

  if (next.name?.trim()) {
    const { firstName, lastName } = splitPersonName(next.name);
    if (firstName && firstName !== (current.firstName ?? "")) {
      update.firstName = firstName;
    }
    if (lastName !== undefined && lastName !== (current.lastName ?? "")) {
      update.lastName = lastName;
    }
  }

  if (next.phoneNumber?.trim()) {
    const phone = normalizePhone(next.phoneNumber);
    if (phone && phone !== (current.phone ?? "")) {
      update.phone = phone;
    }
  }

  return update;
}

export async function updateCustomerProfile(
  update: CustomerProfileUpdate,
): Promise<UpdatedCustomerProfile> {
  const res = await fetchWithCustomerSession("/api/customers/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(update),
  });
  const json = (await res.json().catch(() => ({}))) as ApiEnvelope<
    UpdatedCustomerProfile
  >;
  if (!res.ok || !json.data) {
    throw new Error(json.message || "Could not save your contact details");
  }
  return json.data;
}
