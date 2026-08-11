/**
 * Customer spreadsheet import — column contract.
 *
 * Two layers, deliberately separate:
 *
 * 1. **Source columns** — every header we recognise in an uploaded file. Real
 *    CRM exports carry one `Full-name` column, a split address across five
 *    columns, and two phone columns, so the source layer is wider than the API.
 * 2. **API fields** — what the backend actually stores. `composeImportRow`
 *    folds the source layer down to this.
 *
 * Keeping them apart means we can accept new export shapes by adding aliases,
 * without touching validation or the backend contract.
 */

export const CUSTOMER_IMPORT_TEMPLATE_PATH =
  "/templates/customer-import-template.xlsx";

export const CUSTOMER_IMPORT_SHEET_NAME = "Customers";
export const CUSTOMER_IMPORT_INSTRUCTIONS_SHEET_NAME = "Instructions";

/** Non-deliverable per RFC 2606, so a placeholder can never reach a real inbox. */
export const CUSTOMER_IMPORT_PLACEHOLDER_EMAIL_DOMAIN = "no-email.invalid";

export type CustomerImportSourceKey =
  | "email"
  | "full_name"
  | "first_name"
  | "last_name"
  | "phone"
  | "phone_fixed"
  | "phone_mobile"
  | "address"
  | "street_address"
  | "locality"
  | "postcode"
  | "state"
  | "region"
  | "external_id"
  | "dncr_fixed"
  | "dncr_mobile"
  | "status";

export type CustomerImportApiField =
  | "email"
  | "firstName"
  | "lastName"
  | "phone"
  | "address"
  | "externalRef"
  | "dncrFixed"
  | "dncrMobile"
  | "status";

/** Columns written into the downloadable template, in order. */
export type CustomerImportTemplateColumn = {
  header: string;
  source: CustomerImportSourceKey;
  required: boolean;
  description: string;
  width: number;
};

export const CUSTOMER_IMPORT_TEMPLATE_COLUMNS: readonly CustomerImportTemplateColumn[] =
  [
    {
      header: "ID",
      source: "external_id",
      required: false,
      description: "Your source system's ID. Used to match on re-import.",
      width: 12,
    },
    {
      header: "Full-name",
      source: "full_name",
      required: true,
      description: "Full name. First word is the given name, the rest the surname.",
      width: 24,
    },
    {
      header: "StreetAddress",
      source: "street_address",
      required: false,
      description: "Street number and name",
      width: 34,
    },
    {
      header: "Locality",
      source: "locality",
      required: false,
      description: "Suburb or town",
      width: 16,
    },
    {
      header: "Postcode",
      source: "postcode",
      required: false,
      description: "Postcode",
      width: 10,
    },
    {
      header: "State",
      source: "state",
      required: false,
      description: "State, e.g. NSW",
      width: 8,
    },
    {
      header: "Region",
      source: "region",
      required: false,
      description: "Region. Ignored when it repeats Locality.",
      width: 14,
    },
    {
      header: "Phone-Fixed",
      source: "phone_fixed",
      required: false,
      description: "Landline",
      width: 16,
    },
    {
      header: "Phone-Mobile",
      source: "phone_mobile",
      required: false,
      description: "Mobile. Preferred over the landline when both are present.",
      width: 16,
    },
    {
      header: "DNCR-Phone-Fixed",
      source: "dncr_fixed",
      required: false,
      description: "Landline on the Do Not Call Register? Y/N",
      width: 18,
    },
    {
      header: "DNCR-Mobile",
      source: "dncr_mobile",
      required: false,
      description: "Mobile on the Do Not Call Register? Y/N",
      width: 14,
    },
    {
      header: "Email",
      source: "email",
      required: false,
      description: "Leave blank if unknown — a placeholder is generated.",
      width: 32,
    },
    {
      header: "Status",
      source: "status",
      required: false,
      description: "Free-text status from your source system",
      width: 12,
    },
  ] as const;

export const CUSTOMER_IMPORT_HEADERS = CUSTOMER_IMPORT_TEMPLATE_COLUMNS.map(
  (c) => c.header,
);

/**
 * Lowercase trimmed alias → source key. Includes the legacy snake_case template
 * headers so files built from the previous template still import unchanged.
 */
export const CUSTOMER_IMPORT_HEADER_ALIASES: Readonly<
  Record<string, CustomerImportSourceKey>
> = {
  // email
  email: "email",
  "e-mail": "email",
  "e mail": "email",
  "email address": "email",
  emailaddress: "email",

  // full name
  "full-name": "full_name",
  full_name: "full_name",
  "full name": "full_name",
  fullname: "full_name",
  name: "full_name",
  "customer name": "full_name",
  "contact name": "full_name",

  // split name (legacy template)
  first_name: "first_name",
  firstname: "first_name",
  "first name": "first_name",
  fname: "first_name",
  given_name: "first_name",
  "given name": "first_name",
  last_name: "last_name",
  lastname: "last_name",
  "last name": "last_name",
  lname: "last_name",
  surname: "last_name",
  family_name: "last_name",
  "family name": "last_name",

  // phones
  phone: "phone",
  telephone: "phone",
  tel: "phone",
  "phone number": "phone",
  "phone-fixed": "phone_fixed",
  phone_fixed: "phone_fixed",
  "phone fixed": "phone_fixed",
  fixed: "phone_fixed",
  landline: "phone_fixed",
  "home phone": "phone_fixed",
  "phone-mobile": "phone_mobile",
  phone_mobile: "phone_mobile",
  "phone mobile": "phone_mobile",
  mobile: "phone_mobile",
  "mobile number": "phone_mobile",
  cell: "phone_mobile",

  // address
  address: "address",
  "install address": "address",
  "installation address": "address",
  location: "address",
  streetaddress: "street_address",
  "street address": "street_address",
  street_address: "street_address",
  street: "street_address",
  locality: "locality",
  suburb: "locality",
  city: "locality",
  town: "locality",
  postcode: "postcode",
  "post code": "postcode",
  postal_code: "postcode",
  "postal code": "postcode",
  zip: "postcode",
  state: "state",
  region: "region",

  // extras
  id: "external_id",
  external_id: "external_id",
  "external id": "external_id",
  "customer id": "external_id",
  ref: "external_id",
  "dncr-phone-fixed": "dncr_fixed",
  dncr_phone_fixed: "dncr_fixed",
  "dncr phone fixed": "dncr_fixed",
  "dncr-fixed": "dncr_fixed",
  dncr_fixed: "dncr_fixed",
  "dncr-mobile": "dncr_mobile",
  dncr_mobile: "dncr_mobile",
  "dncr mobile": "dncr_mobile",
  status: "status",
};

export const CUSTOMER_IMPORT_SAMPLE_ROW: Readonly<Record<string, string>> = {
  ID: "4414754",
  "Full-name": "Alex Stolbnyak",
  StreetAddress: "19 Urlovskya Street",
  Locality: "SYDNEY",
  Postcode: "1001",
  State: "NSW",
  Region: "SYDNEY",
  "Phone-Fixed": "0636285153",
  "Phone-Mobile": "0412345678",
  "DNCR-Phone-Fixed": "N",
  "DNCR-Mobile": "N",
  Email: "alex.stolbnyak@example.com",
  Status: "",
};

export const CUSTOMER_IMPORT_INSTRUCTIONS: readonly string[] = [
  "Customer import template",
  "",
  "1. Fill one row per customer on the Customers sheet.",
  "2. Keep the header row. Columns may be reordered, and unknown columns are ignored.",
  "3. The only required column is Full-name.",
  "",
  "Full-name",
  "  • The first word is taken as the given name and the rest as the surname.",
  "  • 'Alex Stolbnyak' becomes Alex / Stolbnyak.",
  "  • A single word is imported as the given name with no surname.",
  "  • first_name and last_name columns are also accepted instead of Full-name.",
  "",
  "Email",
  "  • Optional. Rows with no email are still imported.",
  "  • A placeholder such as imported-4414754@no-email.invalid is generated so the",
  "    record has a unique key. Nothing is ever sent to it, and the customer is",
  "    flagged so you can fill in the real address later.",
  "  • Duplicate emails in your file or already registered are skipped.",
  "",
  "Address",
  "  • StreetAddress, Locality, State and Postcode are combined into one address.",
  "  • Region is ignored when it repeats Locality.",
  "  • A single 'address' column is also accepted instead.",
  "",
  "Phone (Australia)",
  "  • Phone-Mobile is preferred when both numbers are present.",
  "  • Examples: 0412 345 678, +61 412 345 678, (02) 9123 4567",
  "",
  "DNCR",
  "  • Do Not Call Register flags. Y / Yes / TRUE / 1 all count as listed.",
  "  • Stored against the customer so listed numbers can be excluded from calls.",
  "",
  "Google Sheets",
  "  • File → Download → Microsoft Excel (.xlsx) or Comma-separated values (.csv),",
  "    then upload in the installer portal.",
  "",
  "Delete the sample row before importing your real customers.",
];

function normalizeHeaderKey(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Map a spreadsheet header cell to a source key, or null if unrecognised. */
export function resolveCustomerImportHeader(
  rawHeader: string,
): CustomerImportSourceKey | null {
  const key = normalizeHeaderKey(rawHeader);
  if (!key) return null;
  if (CUSTOMER_IMPORT_HEADER_ALIASES[key]) {
    return CUSTOMER_IMPORT_HEADER_ALIASES[key];
  }
  const underscored = key.replace(/[\s-]+/g, "_");
  if (CUSTOMER_IMPORT_HEADER_ALIASES[underscored]) {
    return CUSTOMER_IMPORT_HEADER_ALIASES[underscored];
  }
  const hyphenated = key.replace(/[\s_]+/g, "-");
  if (CUSTOMER_IMPORT_HEADER_ALIASES[hyphenated]) {
    return CUSTOMER_IMPORT_HEADER_ALIASES[hyphenated];
  }
  return null;
}

/** "Alex Stolbnyak" → given "Alex", family "Stolbnyak". */
export function splitFullName(fullName: string): {
  firstName: string;
  lastName: string;
} {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0]!, lastName: "" };
  return {
    firstName: parts[0]!,
    lastName: parts.slice(1).join(" "),
  };
}

const TRUTHY = new Set(["y", "yes", "true", "1", "t", "listed"]);

export function parseDncrFlag(value: string | undefined): boolean {
  if (!value) return false;
  return TRUTHY.has(value.trim().toLowerCase());
}

/** Australian convention: street, suburb STATE postcode. */
export function composeAddress(
  source: Partial<Record<CustomerImportSourceKey, string>>,
): string {
  const single = source.address?.trim();
  if (single) return single;

  const street = source.street_address?.trim() ?? "";
  const locality = source.locality?.trim() ?? "";
  const state = source.state?.trim() ?? "";
  const postcode = source.postcode?.trim() ?? "";
  const region = source.region?.trim() ?? "";

  // Region usually repeats Locality in these exports; only add real detail.
  const areaParts = [locality];
  if (region && region.toLowerCase() !== locality.toLowerCase()) {
    areaParts.push(region);
  }

  const tail = [areaParts.filter(Boolean).join(" "), state, postcode]
    .filter(Boolean)
    .join(" ")
    .trim();

  return [street, tail].filter(Boolean).join(", ").trim();
}

/** Fold recognised source columns down to the API shape. */
export function composeImportRow(
  source: Partial<Record<CustomerImportSourceKey, string>>,
): Partial<Record<CustomerImportApiField, string>> {
  const out: Partial<Record<CustomerImportApiField, string>> = {};

  const explicitFirst = source.first_name?.trim();
  const explicitLast = source.last_name?.trim();
  if (explicitFirst || explicitLast) {
    if (explicitFirst) out.firstName = explicitFirst;
    if (explicitLast) out.lastName = explicitLast;
  } else if (source.full_name?.trim()) {
    const { firstName, lastName } = splitFullName(source.full_name);
    if (firstName) out.firstName = firstName;
    if (lastName) out.lastName = lastName;
  }

  const email = source.email?.trim();
  if (email) out.email = email.toLowerCase();

  // Mobile wins: it is the number the comms features can actually SMS.
  const phone = source.phone_mobile?.trim() || source.phone_fixed?.trim() || source.phone?.trim();
  if (phone) out.phone = phone;

  const address = composeAddress(source);
  if (address) out.address = address;

  const externalRef = source.external_id?.trim();
  if (externalRef) out.externalRef = externalRef;

  const status = source.status?.trim();
  if (status) out.status = status;

  if (source.dncr_fixed != null) {
    out.dncrFixed = parseDncrFlag(source.dncr_fixed) ? "true" : "false";
  }
  if (source.dncr_mobile != null) {
    out.dncrMobile = parseDncrFlag(source.dncr_mobile) ? "true" : "false";
  }

  return out;
}

/**
 * Placeholder for rows with no email. Deterministic on the source ID so
 * re-importing the same file does not create a second copy of the customer.
 */
export function placeholderEmailFor(options: {
  externalRef?: string | undefined;
  rowNumber: number;
}): string {
  const slug = options.externalRef?.trim()
    ? options.externalRef.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")
    : `row-${options.rowNumber}`;
  return `imported-${slug}@${CUSTOMER_IMPORT_PLACEHOLDER_EMAIL_DOMAIN}`;
}

export function isPlaceholderEmail(email: string): boolean {
  return email
    .trim()
    .toLowerCase()
    .endsWith(`@${CUSTOMER_IMPORT_PLACEHOLDER_EMAIL_DOMAIN}`);
}
