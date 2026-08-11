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

  describe("real CRM export shape", () => {
    const REAL_HEADERS = [
      "ID",
      "Full-name",
      "StreetAddress",
      "Locality",
      "Postcode",
      "State",
      "Region",
      "Phone-Fixed",
      "Phone-Mobile",
      "DNCR-Phone-Fixed",
      "DNCR-Mobile",
      "Email",
      "Status",
    ];

    function parseRealRows(rows: unknown[][]) {
      return parseSpreadsheetBuffer(
        buildWorkbookBuffer("Customers", [REAL_HEADERS, ...rows]),
        "real.xlsx",
      );
    }

    it("splits Full-name and composes the address", () => {
      const result = parseRealRows([
        [
          4414754,
          "Alex Stolbnyak",
          "Urlovskya 19 Street",
          "SYDNEY",
          1001,
          "NSW",
          "SYDNEY",
          "0636285153",
          "",
          "N",
          "N",
          "guashin42@gmail.com",
          "",
        ],
      ]);

      expect(result.errors).toEqual([]);
      expect(result.rows[0]?.values).toMatchObject({
        firstName: "Alex",
        lastName: "Stolbnyak",
        email: "guashin42@gmail.com",
        address: "Urlovskya 19 Street, SYDNEY NSW 1001",
        externalRef: "4414754",
      });
    });

    it("prefers the mobile number over the landline", () => {
      const result = parseRealRows([
        [
          1,
          "Two Numbers",
          "1 St",
          "SYDNEY",
          2000,
          "NSW",
          "SYDNEY",
          "0299999999",
          "0412345678",
          "N",
          "N",
          "two@example.com",
          "",
        ],
      ]);

      expect(result.rows[0]?.values.phone).toBe("0412345678");
    });

    it("falls back to the landline when there is no mobile", () => {
      const result = parseRealRows([
        [
          1,
          "Fixed Only",
          "1 St",
          "SYDNEY",
          2000,
          "NSW",
          "SYDNEY",
          "0299999999",
          "",
          "N",
          "N",
          "fixed@example.com",
          "",
        ],
      ]);

      expect(result.rows[0]?.values.phone).toBe("0299999999");
    });

    it("keeps rows that have no email", () => {
      const result = parseRealRows([
        [
          4187879,
          "Rohit Malhotra",
          "Nsw Peter Street",
          "SYDNEY",
          1021,
          "NSW",
          "SYDNEY",
          "",
          "0433218029",
          "N",
          "Y",
          "",
          "",
        ],
      ]);

      expect(result.rows).toHaveLength(1);
      expect(result.rows[0]?.values.email).toBeUndefined();
      expect(result.rows[0]?.values.dncrMobile).toBe("true");
      expect(result.rows[0]?.values.dncrFixed).toBe("false");
    });

    it("does not repeat Region when it duplicates Locality", () => {
      const result = parseRealRows([
        [1, "Dup Region", "1 St", "SYDNEY", 2000, "NSW", "SYDNEY", "", "", "", "", "", ""],
      ]);

      expect(result.rows[0]?.values.address).toBe("1 St, SYDNEY NSW 2000");
    });

    it("keeps a Region that adds real detail", () => {
      const result = parseRealRows([
        [1, "Real Region", "1 St", "SYDNEY", 2000, "NSW", "GOSFORD", "", "", "", "", "", ""],
      ]);

      expect(result.rows[0]?.values.address).toBe(
        "1 St, SYDNEY GOSFORD NSW 2000",
      );
    });

    it("imports a single-word name without inventing a surname", () => {
      const result = parseRealRows([
        [1, "Cher", "1 St", "SYDNEY", 2000, "NSW", "SYDNEY", "", "", "", "", "", ""],
      ]);

      expect(result.rows[0]?.values.firstName).toBe("Cher");
      expect(result.rows[0]?.values.lastName).toBeUndefined();
    });

    it("treats a row with only DNCR flags as empty", () => {
      const result = parseRealRows([
        ["", "", "", "", "", "", "", "", "", "N", "N", "", ""],
      ]);

      expect(result.rows).toHaveLength(0);
      expect(result.skippedEmptyRows).toBe(1);
    });
  });
});
