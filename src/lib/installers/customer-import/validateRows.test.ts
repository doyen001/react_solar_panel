import { describe, expect, it } from "vitest";
import {
  normalizeCustomerImportValues,
  validateRows,
  type CustomerImportParsedRow,
} from "./validateRows";

describe("normalizeCustomerImportValues", () => {
  it("trims strings and lowercases email", () => {
    expect(
      normalizeCustomerImportValues({
        email: "  Jane@Example.COM ",
        firstName: " Jane ",
        lastName: " Smith ",
        phone: "  ",
      }),
    ).toEqual({
      email: "jane@example.com",
      firstName: "Jane",
      lastName: "Smith",
    });
  });
});

describe("validateRows", () => {
  it("accepts valid rows", () => {
    const rows: CustomerImportParsedRow[] = [
      {
        rowNumber: 1,
        values: {
          email: "valid@example.com",
          firstName: "Valid",
          lastName: "User",
        },
      },
    ];

    const result = validateRows(rows);

    expect(result.valid).toHaveLength(1);
    expect(result.invalid).toEqual([]);
    expect(result.skipped).toEqual([]);
    expect(result.valid[0]?.data.email).toBe("valid@example.com");
  });

  it("returns zod messages for invalid rows", () => {
    const result = validateRows([
      {
        rowNumber: 2,
        values: {
          email: "not-an-email",
          firstName: "",
          lastName: "OnlyLast",
        },
      },
    ]);

    expect(result.valid).toEqual([]);
    expect(result.invalid).toHaveLength(1);
    expect(result.invalid[0]?.rowNumber).toBe(2);
    expect(result.invalid[0]?.message).toContain("Invalid email address");
    expect(result.invalid[0]?.message).toContain("First name is required");
  });

  it("flags duplicate emails within the file", () => {
    const rows: CustomerImportParsedRow[] = [
      {
        rowNumber: 1,
        values: {
          email: "dup@example.com",
          firstName: "First",
          lastName: "Row",
        },
      },
      {
        rowNumber: 2,
        values: {
          email: "dup@example.com",
          firstName: "Second",
          lastName: "Row",
        },
      },
    ];

    const result = validateRows(rows);

    expect(result.valid).toHaveLength(1);
    expect(result.skipped).toHaveLength(1);
    expect(result.skipped[0]).toEqual({
      rowNumber: 2,
      email: "dup@example.com",
      message: "Duplicate email in import file",
    });
  });
});
