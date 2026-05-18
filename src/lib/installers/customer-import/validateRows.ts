import { z } from "zod";
import type { CustomerImportApiField } from "./template";

/** Mirrors backend createCustomerSchema */
export const createCustomerImportRowSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export type CustomerImportRow = z.infer<typeof createCustomerImportRowSchema>;

export const CUSTOMER_IMPORT_MAX_ROWS = 500;

export type CustomerImportParsedRow = {
  /** 1-based index among data rows in the spreadsheet (after the header row). */
  rowNumber: number;
  values: Partial<Record<CustomerImportApiField, string>>;
};

export type ValidatedCustomerImportRow = {
  rowNumber: number;
  data: CustomerImportRow;
};

export type InvalidCustomerImportRow = {
  rowNumber: number;
  email?: string;
  message: string;
};

export type SkippedCustomerImportRow = {
  rowNumber: number;
  email: string;
  message: string;
};

export type ValidateRowsResult = {
  valid: ValidatedCustomerImportRow[];
  invalid: InvalidCustomerImportRow[];
  /** Duplicate email within the same file (first row wins). */
  skipped: SkippedCustomerImportRow[];
};

const DUPLICATE_IN_FILE_MESSAGE = "Duplicate email in import file";

function trimOptional(value: string | undefined): string | undefined {
  if (value == null) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/** Normalize strings before Zod (matches backend bulk import). */
export function normalizeCustomerImportValues(
  values: Partial<Record<CustomerImportApiField, string>>,
): Partial<Record<CustomerImportApiField, string>> {
  const normalized: Partial<Record<CustomerImportApiField, string>> = {};

  for (const key of [
    "email",
    "firstName",
    "lastName",
    "phone",
    "address",
  ] as const) {
    const raw = values[key];
    if (typeof raw !== "string") continue;
    const trimmed = raw.trim();
    if (trimmed.length > 0) {
      normalized[key] = trimmed;
    }
  }

  if (typeof normalized.email === "string") {
    normalized.email = normalized.email.toLowerCase();
  }

  return normalized;
}

function emailFromValues(
  values: Partial<Record<CustomerImportApiField, string>>,
): string | undefined {
  const email = values.email;
  return typeof email === "string" ? email : undefined;
}

function formatZodIssues(error: z.ZodError): string {
  return error.issues.map((issue) => issue.message).join("; ");
}

export function validateRows(
  rows: CustomerImportParsedRow[],
): ValidateRowsResult {
  const result: ValidateRowsResult = {
    valid: [],
    invalid: [],
    skipped: [],
  };

  if (rows.length > CUSTOMER_IMPORT_MAX_ROWS) {
    result.invalid.push({
      rowNumber: CUSTOMER_IMPORT_MAX_ROWS + 1,
      message: `Import limited to ${CUSTOMER_IMPORT_MAX_ROWS} rows per file`,
    });
    return result;
  }

  const seenEmails = new Set<string>();

  for (const { rowNumber, values } of rows) {
    const normalized = normalizeCustomerImportValues(values);
    const parsed = createCustomerImportRowSchema.safeParse({
      email: normalized.email ?? "",
      firstName: normalized.firstName ?? "",
      lastName: normalized.lastName ?? "",
      phone: trimOptional(normalized.phone),
      address: trimOptional(normalized.address),
    });

    if (!parsed.success) {
      result.invalid.push({
        rowNumber,
        email: emailFromValues(normalized),
        message: formatZodIssues(parsed.error),
      });
      continue;
    }

    const data = parsed.data;

    if (seenEmails.has(data.email)) {
      result.skipped.push({
        rowNumber,
        email: data.email,
        message: DUPLICATE_IN_FILE_MESSAGE,
      });
      continue;
    }

    seenEmails.add(data.email);
    result.valid.push({ rowNumber, data });
  }

  return result;
}
