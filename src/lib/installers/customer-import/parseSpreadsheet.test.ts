import * as XLSX from "xlsx";
import { describe, expect, it } from "vitest";
import { parseSpreadsheetBuffer } from "./parseSpreadsheet";

function buildWorkbookBuffer(
  sheetName: string,
  aoa: unknown[][],
  bookType: "xlsx" | "csv" = "xlsx",
): ArrayBuffer {
  const sheet = XLSX.utils.aoa_to_sheet(aoa);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
  return XLSX.write(workbook, { type: "array", bookType }) as ArrayBuffer;
}

describe("parseSpreadsheetBuffer", () => {
  it("maps alias headers to API fields", () => {
    const buffer = buildWorkbookBuffer("Sheet1", [
      ["Email Address", "First Name", "Last Name", "Mobile Number", "Street Address"],
      [
        "alice@example.com",
        "Alice",
        "Nguyen",
        "0412 111 222",
        "1 Test St",
      ],
    ]);

    const result = parseSpreadsheetBuffer(buffer, "customers.xlsx");

    expect(result.errors).toEqual([]);
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0]).toEqual({
      rowNumber: 1,
      values: {
        email: "alice@example.com",
        firstName: "Alice",
        lastName: "Nguyen",
        phone: "0412 111 222",
        address: "1 Test St",
      },
    });
  });

  it("prefers the Customers sheet when present", () => {
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.aoa_to_sheet([["notes"], ["ignore this"]]),
      "Instructions",
    );
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.aoa_to_sheet([
        ["email", "first_name", "last_name"],
        ["bob@example.com", "Bob", "Lee"],
      ]),
      "Customers",
    );
    const buffer = XLSX.write(workbook, {
      type: "array",
      bookType: "xlsx",
    }) as ArrayBuffer;

    const result = parseSpreadsheetBuffer(buffer, "import.xlsx");

    expect(result.errors).toEqual([]);
    expect(result.sheetName).toBe("Customers");
    expect(result.rows[0]?.values.email).toBe("bob@example.com");
  });

  it("skips empty rows", () => {
    const buffer = buildWorkbookBuffer("Customers", [
      ["email", "first_name", "last_name"],
      ["one@example.com", "One", "User"],
      ["", "", ""],
      ["two@example.com", "Two", "User"],
    ]);

    const result = parseSpreadsheetBuffer(buffer, "customers.csv");

    expect(result.rows).toHaveLength(2);
    expect(result.skippedEmptyRows).toBe(1);
  });

  it("rejects unsupported file types", () => {
    const result = parseSpreadsheetBuffer(new ArrayBuffer(8), "customers.pdf");

    expect(result.rows).toEqual([]);
    expect(result.errors[0]?.code).toBe("unsupported_type");
  });
});
