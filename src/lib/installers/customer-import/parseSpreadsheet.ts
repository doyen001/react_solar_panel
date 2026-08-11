import * as XLSX from "xlsx";
import {
  CUSTOMER_IMPORT_SHEET_NAME,
  composeImportRow,
  type CustomerImportApiField,
  type CustomerImportSourceKey,
  resolveCustomerImportHeader,
} from "./template";
import {
  CUSTOMER_IMPORT_MAX_ROWS,
  type CustomerImportParsedRow,
} from "./validateRows";

export const CUSTOMER_IMPORT_MAX_FILE_BYTES = 50 * 1024 * 1024;

export const CUSTOMER_IMPORT_MAX_FILE_LABEL = `${Math.round(
  CUSTOMER_IMPORT_MAX_FILE_BYTES / (1024 * 1024),
)} MB`;

const ACCEPTED_EXTENSIONS = new Set(["xlsx", "xls", "csv"]);
const HEADER_SCAN_MAX_ROWS = 8;

export type ParseSpreadsheetError = {
  code:
    | "file_too_large"
    | "unsupported_type"
    | "empty_file"
    | "no_data_sheet"
    | "missing_required_columns"
    | "too_many_rows"
    | "read_failed";
  message: string;
};

export type ParseSpreadsheetResult = {
  rows: CustomerImportParsedRow[];
  errors: ParseSpreadsheetError[];
  sheetName?: string;
  skippedEmptyRows: number;
};

function extensionFromName(fileName: string): string {
  const dot = fileName.lastIndexOf(".");
  if (dot < 0) return "";
  return fileName.slice(dot + 1).toLowerCase();
}

function cellToString(value: unknown): string {
  if (value == null || value === "") return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value).trim();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  return String(value).trim();
}

/** Ignores DNCR flags: they resolve to "false" and would mask a blank row. */
function isRowEmpty(
  values: Partial<Record<CustomerImportApiField, string>>,
): boolean {
  const meaningful: CustomerImportApiField[] = [
    "email",
    "firstName",
    "lastName",
    "phone",
    "address",
    "externalRef",
  ];
  return meaningful.every((field) => {
    const value = values[field];
    return value == null || value.length === 0;
  });
}

type HeaderMatch = {
  columnKeys: (CustomerImportSourceKey | null)[];
  matchedCount: number;
  rowIndex: number;
};

function scoreHeaderRow(
  cells: unknown[],
): Omit<HeaderMatch, "rowIndex"> | null {
  const columnKeys = cells.map((cell) =>
    resolveCustomerImportHeader(cellToString(cell)),
  );
  const matched = new Set(
    columnKeys.filter((key): key is CustomerImportSourceKey => key != null),
  );
  // A name is the only thing we cannot synthesise, so it alone gates detection:
  // email, phone and address are all optional in real exports.
  const hasName =
    matched.has("full_name") ||
    matched.has("first_name") ||
    matched.has("last_name");

  if (!hasName) return null;

  return {
    columnKeys,
    matchedCount: matched.size,
  };
}

function findHeaderRow(aoa: unknown[][]): HeaderMatch | null {
  const limit = Math.min(HEADER_SCAN_MAX_ROWS, aoa.length);
  let best: HeaderMatch | null = null;

  for (let rowIndex = 0; rowIndex < limit; rowIndex += 1) {
    const row = aoa[rowIndex];
    if (!Array.isArray(row)) continue;
    const candidate = scoreHeaderRow(row);
    if (!candidate) continue;
    const match = { ...candidate, rowIndex };
    if (!best || match.matchedCount > best.matchedCount) {
      best = match;
    }
  }

  return best;
}

function buildColumnIndex(
  columnKeys: (CustomerImportSourceKey | null)[],
): Partial<Record<CustomerImportSourceKey, number>> {
  const index: Partial<Record<CustomerImportSourceKey, number>> = {};
  columnKeys.forEach((key, colIndex) => {
    if (key != null && index[key] === undefined) {
      index[key] = colIndex;
    }
  });
  return index;
}

function rowToValues(
  row: unknown[],
  columnIndex: Partial<Record<CustomerImportSourceKey, number>>,
): Partial<Record<CustomerImportApiField, string>> {
  const source: Partial<Record<CustomerImportSourceKey, string>> = {};

  for (const [key, idx] of Object.entries(columnIndex) as [
    CustomerImportSourceKey,
    number,
  ][]) {
    const str = cellToString(row[idx]);
    if (str.length > 0) {
      source[key] = str;
    }
  }

  return composeImportRow(source);
}

function sheetToArrayOfArrays(sheet: XLSX.WorkSheet): unknown[][] {
  return XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    defval: null,
    raw: false,
    header: 1,
  });
}

function pickDataSheet(
  workbook: XLSX.WorkBook,
): { sheetName: string; aoa: unknown[][] } | null {
  const names = workbook.SheetNames;
  if (names.length === 0) return null;

  const preferred = names.find(
    (name) => name.toLowerCase() === CUSTOMER_IMPORT_SHEET_NAME.toLowerCase(),
  );
  const ordered = preferred
    ? [preferred, ...names.filter((n) => n !== preferred)]
    : names;

  for (const sheetName of ordered) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) continue;
    const aoa = sheetToArrayOfArrays(sheet);
    if (findHeaderRow(aoa)) {
      return { sheetName, aoa };
    }
  }

  const fallbackName = names[0];
  const fallbackSheet = workbook.Sheets[fallbackName];
  if (!fallbackSheet) return null;
  return { sheetName: fallbackName, aoa: sheetToArrayOfArrays(fallbackSheet) };
}

export function parseSpreadsheetBuffer(
  buffer: ArrayBuffer,
  fileName: string,
): ParseSpreadsheetResult {
  const extension = extensionFromName(fileName);
  if (!ACCEPTED_EXTENSIONS.has(extension)) {
    return {
      rows: [],
      errors: [
        {
          code: "unsupported_type",
          message: "Please upload an Excel (.xlsx, .xls) or CSV (.csv) file.",
        },
      ],
      skippedEmptyRows: 0,
    };
  }

  if (buffer.byteLength === 0) {
    return {
      rows: [],
      errors: [{ code: "empty_file", message: "The file is empty." }],
      skippedEmptyRows: 0,
    };
  }

  if (buffer.byteLength > CUSTOMER_IMPORT_MAX_FILE_BYTES) {
    return {
      rows: [],
      errors: [
        {
          code: "file_too_large",
          message: `File must be ${CUSTOMER_IMPORT_MAX_FILE_LABEL} or smaller.`,
        },
      ],
      skippedEmptyRows: 0,
    };
  }

  let workbook: XLSX.WorkBook;
  try {
    workbook = XLSX.read(buffer, { type: "array" });
  } catch {
    return {
      rows: [],
      errors: [
        {
          code: "read_failed",
          message: "Could not read the spreadsheet. Check the file and try again.",
        },
      ],
      skippedEmptyRows: 0,
    };
  }

  const picked = pickDataSheet(workbook);
  if (!picked) {
    return {
      rows: [],
      errors: [
        {
          code: "no_data_sheet",
          message: "No worksheet with customer columns was found.",
        },
      ],
      skippedEmptyRows: 0,
    };
  }

  const header = findHeaderRow(picked.aoa);
  if (!header) {
    return {
      rows: [],
      errors: [
        {
          code: "missing_required_columns",
          message:
            "Missing a name column. Include Full-name (or first_name and last_name) — see the import template.",
        },
      ],
      skippedEmptyRows: 0,
      sheetName: picked.sheetName,
    };
  }

  const columnIndex = buildColumnIndex(header.columnKeys);
  const rows: CustomerImportParsedRow[] = [];
  let skippedEmptyRows = 0;

  for (let i = header.rowIndex + 1; i < picked.aoa.length; i += 1) {
    const rawRow = picked.aoa[i];
    if (!Array.isArray(rawRow)) continue;

    const values = rowToValues(rawRow, columnIndex);
    if (isRowEmpty(values)) {
      skippedEmptyRows += 1;
      continue;
    }

    rows.push({
      rowNumber: rows.length + 1,
      values,
    });
  }

  if (rows.length > CUSTOMER_IMPORT_MAX_ROWS) {
    return {
      rows: [],
      errors: [
        {
          code: "too_many_rows",
          message: `Import limited to ${CUSTOMER_IMPORT_MAX_ROWS} customer rows per file.`,
        },
      ],
      sheetName: picked.sheetName,
      skippedEmptyRows,
    };
  }

  return {
    rows,
    errors: [],
    sheetName: picked.sheetName,
    skippedEmptyRows,
  };
}

export async function parseSpreadsheet(file: File): Promise<ParseSpreadsheetResult> {
  const buffer = await file.arrayBuffer();
  return parseSpreadsheetBuffer(buffer, file.name);
}
