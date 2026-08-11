import { describe, expect, it } from "vitest";
import {
  CUSTOMER_IMPORT_TEMPLATE_COLUMNS,
  composeAddress,
  composeImportRow,
  isPlaceholderEmail,
  parseDncrFlag,
  placeholderEmailFor,
  resolveCustomerImportHeader,
  splitFullName,
} from "./template";

describe("resolveCustomerImportHeader", () => {
  it("resolves every template header to its declared source key", () => {
    for (const column of CUSTOMER_IMPORT_TEMPLATE_COLUMNS) {
      expect(resolveCustomerImportHeader(column.header)).toBe(column.source);
    }
  });

  it("normalizes common aliases", () => {
    expect(resolveCustomerImportHeader("Email Address")).toBe("email");
    expect(resolveCustomerImportHeader("First Name")).toBe("first_name");
    expect(resolveCustomerImportHeader("Last Name")).toBe("last_name");
    expect(resolveCustomerImportHeader("Installation Address")).toBe("address");
  });

  it("keeps the two phone columns distinct", () => {
    expect(resolveCustomerImportHeader("Mobile Number")).toBe("phone_mobile");
    expect(resolveCustomerImportHeader("Landline")).toBe("phone_fixed");
    expect(resolveCustomerImportHeader("Phone")).toBe("phone");
  });

  it("is insensitive to separator style", () => {
    for (const variant of ["Full-name", "full name", "FULL_NAME", "FullName"]) {
      expect(resolveCustomerImportHeader(variant)).toBe("full_name");
    }
  });

  it("returns null for unknown headers", () => {
    expect(resolveCustomerImportHeader("lifetime value")).toBeNull();
    expect(resolveCustomerImportHeader("")).toBeNull();
  });
});

describe("splitFullName", () => {
  it("splits on the first word", () => {
    expect(splitFullName("Alex Stolbnyak")).toEqual({
      firstName: "Alex",
      lastName: "Stolbnyak",
    });
  });

  it("keeps multi-word surnames intact", () => {
    expect(splitFullName("Anastasia Van Der Berg")).toEqual({
      firstName: "Anastasia",
      lastName: "Van Der Berg",
    });
  });

  it("leaves the surname blank for a single word", () => {
    expect(splitFullName("Cher")).toEqual({ firstName: "Cher", lastName: "" });
  });

  it("tolerates padding and repeated spaces", () => {
    expect(splitFullName("  J   Wei  ")).toEqual({
      firstName: "J",
      lastName: "Wei",
    });
  });
});

describe("composeAddress", () => {
  it("uses AU ordering", () => {
    expect(
      composeAddress({
        street_address: "19 Urlovskya Street",
        locality: "SYDNEY",
        state: "NSW",
        postcode: "1001",
      }),
    ).toBe("19 Urlovskya Street, SYDNEY NSW 1001");
  });

  it("prefers a single address column when present", () => {
    expect(
      composeAddress({ address: "1 Already Composed St", locality: "SYDNEY" }),
    ).toBe("1 Already Composed St");
  });

  it("omits missing parts without leaving separators behind", () => {
    expect(composeAddress({ locality: "SYDNEY", state: "NSW" })).toBe(
      "SYDNEY NSW",
    );
    expect(composeAddress({})).toBe("");
  });
});

describe("parseDncrFlag", () => {
  it("treats the usual affirmatives as listed", () => {
    for (const value of ["Y", "y", "Yes", "TRUE", "1", "listed"]) {
      expect(parseDncrFlag(value)).toBe(true);
    }
  });

  it("treats everything else as not listed", () => {
    for (const value of ["N", "no", "FALSE", "0", "", undefined]) {
      expect(parseDncrFlag(value)).toBe(false);
    }
  });
});

describe("placeholderEmailFor", () => {
  it("is deterministic on the source ID so re-imports do not duplicate", () => {
    const first = placeholderEmailFor({ externalRef: "4414754", rowNumber: 3 });
    const second = placeholderEmailFor({ externalRef: "4414754", rowNumber: 99 });
    expect(first).toBe(second);
    expect(first).toBe("imported-4414754@no-email.invalid");
  });

  it("falls back to the row number when there is no ID", () => {
    expect(placeholderEmailFor({ rowNumber: 7 })).toBe(
      "imported-row-7@no-email.invalid",
    );
  });

  it("produces an address that is recognisable as a placeholder", () => {
    expect(isPlaceholderEmail(placeholderEmailFor({ rowNumber: 1 }))).toBe(true);
    expect(isPlaceholderEmail("real@example.com")).toBe(false);
  });
});

describe("composeImportRow", () => {
  it("folds the real export shape down to API fields", () => {
    expect(
      composeImportRow({
        external_id: "4414754",
        full_name: "Alex Stolbnyak",
        street_address: "Urlovskya 19 Street",
        locality: "SYDNEY",
        postcode: "1001",
        state: "NSW",
        region: "SYDNEY",
        phone_fixed: "0636285153",
        dncr_fixed: "N",
        dncr_mobile: "Y",
        email: "Guashin42@Gmail.com",
      }),
    ).toEqual({
      externalRef: "4414754",
      firstName: "Alex",
      lastName: "Stolbnyak",
      address: "Urlovskya 19 Street, SYDNEY NSW 1001",
      phone: "0636285153",
      dncrFixed: "false",
      dncrMobile: "true",
      email: "guashin42@gmail.com",
    });
  });

  it("lets explicit first/last columns win over Full-name", () => {
    const out = composeImportRow({
      full_name: "Ignored Entirely",
      first_name: "Jane",
      last_name: "Smith",
    });
    expect(out.firstName).toBe("Jane");
    expect(out.lastName).toBe("Smith");
  });
});
