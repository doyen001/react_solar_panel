/**
 * Customer spreadsheet import — column contract (matches createCustomerSchema).
 * Headers in the downloadable template use snake_case; parsers map aliases to these keys.
 */

export const CUSTOMER_IMPORT_TEMPLATE_PATH =
  "/templates/customer-import-template.xlsx";

export const CUSTOMER_IMPORT_SHEET_NAME = "Customers";
export const CUSTOMER_IMPORT_INSTRUCTIONS_SHEET_NAME = "Instructions";

export type CustomerImportColumnKey =
  | "email"
  | "first_name"
  | "last_name"
  | "phone"
  | "address";

export type CustomerImportApiField =
  | "email"
  | "firstName"
  | "lastName"
  | "phone"
  | "address";

export type CustomerImportColumn = {
  header: CustomerImportColumnKey;
  required: boolean;
  apiField: CustomerImportApiField;
  description: string;
};

export const CUSTOMER_IMPORT_COLUMNS: readonly CustomerImportColumn[] = [
  {
    header: "email",
    required: true,
    apiField: "email",
    description: "Customer login email (must be unique)",
  },
  {
    header: "first_name",
    required: true,
    apiField: "firstName",
    description: "Given name",
  },
  {
    header: "last_name",
    required: true,
    apiField: "lastName",
    description: "Family name",
  },
  {
    header: "phone",
    required: false,
    apiField: "phone",
    description: "Mobile or landline (AU formats accepted)",
  },
  {
    header: "address",
    required: false,
    apiField: "address",
    description: "Installation or mailing address (free text)",
  },
] as const;

export const CUSTOMER_IMPORT_HEADERS = CUSTOMER_IMPORT_COLUMNS.map(
  (c) => c.header,
);

/** Lowercase trimmed alias → canonical template header */
export const CUSTOMER_IMPORT_HEADER_ALIASES: Readonly<
  Record<string, CustomerImportColumnKey>
> = {
  email: "email",
  "e-mail": "email",
  "email address": "email",
  "e mail": "email",
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
  phone: "phone",
  mobile: "phone",
  telephone: "phone",
  tel: "phone",
  "phone number": "phone",
  "mobile number": "phone",
  address: "address",
  "street address": "address",
  location: "address",
  "install address": "address",
  "installation address": "address",
};

export const CUSTOMER_IMPORT_SAMPLE_ROW: Record<
  CustomerImportColumnKey,
  string
> = {
  email: "jane.smith@example.com",
  first_name: "Jane",
  last_name: "Smith",
  phone: "0412 345 678",
  address: "12 Solar St, Sydney NSW 2000",
};

export const CUSTOMER_IMPORT_INSTRUCTIONS: readonly string[] = [
  "Customer import template",
  "",
  "1. Fill one row per customer on the Customers sheet.",
  "2. Do not rename or reorder the header row (email, first_name, last_name, phone, address).",
  "3. Required columns: email, first_name, last_name.",
  "4. Optional columns: phone, address.",
  "",
  "Email",
  "  • Must be a valid address and unique in the platform.",
  "  • Duplicate emails in your file or already registered are skipped on import.",
  "",
  "Phone (Australia)",
  "  • Examples: 0412 345 678, +61 412 345 678, (02) 9123 4567",
  "  • Leave blank if unknown.",
  "",
  "Google Sheets",
  "  • File → Download → Microsoft Excel (.xlsx) or Comma-separated values (.csv), then upload in the installer portal.",
  "",
  "Delete the sample row before importing your real customers.",
];

function normalizeHeaderKey(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Map a spreadsheet header cell to a canonical column key, or null if unknown. */
export function resolveCustomerImportHeader(
  rawHeader: string,
): CustomerImportColumnKey | null {
  const key = normalizeHeaderKey(rawHeader);
  if (!key) return null;
  if (CUSTOMER_IMPORT_HEADER_ALIASES[key]) {
    return CUSTOMER_IMPORT_HEADER_ALIASES[key];
  }
  const underscored = key.replace(/\s+/g, "_");
  if (CUSTOMER_IMPORT_HEADER_ALIASES[underscored]) {
    return CUSTOMER_IMPORT_HEADER_ALIASES[underscored];
  }
  if (
    CUSTOMER_IMPORT_HEADERS.includes(underscored as CustomerImportColumnKey)
  ) {
    return underscored as CustomerImportColumnKey;
  }
  return null;
}
