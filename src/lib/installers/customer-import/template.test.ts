import { describe, expect, it } from "vitest";
import {
  CUSTOMER_IMPORT_HEADERS,
  resolveCustomerImportHeader,
} from "./template";

describe("resolveCustomerImportHeader", () => {
  it("accepts canonical headers", () => {
    for (const header of CUSTOMER_IMPORT_HEADERS) {
      expect(resolveCustomerImportHeader(header)).toBe(header);
    }
  });

  it("normalizes common aliases", () => {
    expect(resolveCustomerImportHeader("Email Address")).toBe("email");
    expect(resolveCustomerImportHeader("First Name")).toBe("first_name");
    expect(resolveCustomerImportHeader("Last Name")).toBe("last_name");
    expect(resolveCustomerImportHeader("Mobile Number")).toBe("phone");
    expect(resolveCustomerImportHeader("Installation Address")).toBe(
      "address",
    );
  });

  it("returns null for unknown headers", () => {
    expect(resolveCustomerImportHeader("customer id")).toBeNull();
  });
});
