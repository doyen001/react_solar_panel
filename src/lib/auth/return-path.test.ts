import { describe, expect, it } from "vitest";
import { isSafeReturnPath, safeReturnPath } from "@/lib/auth/return-path";

const AUTH = "/customers/auth";
const HOME = "/customers/dashboard";

describe("isSafeReturnPath", () => {
  it("accepts in-app paths outside the portal — the signed-out Buy case", () => {
    expect(isSafeReturnPath("/products", AUTH)).toBe(true);
    expect(isSafeReturnPath("/products?page=2&q=panel", AUTH)).toBe(true);
    expect(isSafeReturnPath("/customers/dashboard", AUTH)).toBe(true);
  });

  it("rejects the auth page itself, which would bounce back to the form", () => {
    expect(isSafeReturnPath(AUTH, AUTH)).toBe(false);
    expect(isSafeReturnPath(`${AUTH}?from=%2Fproducts`, AUTH)).toBe(false);
  });

  it("rejects missing values", () => {
    expect(isSafeReturnPath(null, AUTH)).toBe(false);
    expect(isSafeReturnPath(undefined, AUTH)).toBe(false);
    expect(isSafeReturnPath("", AUTH)).toBe(false);
  });

  it("rejects off-site targets", () => {
    // Protocol-relative — the browser leaves the site entirely.
    expect(isSafeReturnPath("//evil.com", AUTH)).toBe(false);
    expect(isSafeReturnPath("//evil.com/products", AUTH)).toBe(false);
    // Backslash variants some browsers normalise to "//".
    expect(isSafeReturnPath("/\\evil.com", AUTH)).toBe(false);
    // Absolute URLs and non-path values.
    expect(isSafeReturnPath("https://evil.com", AUTH)).toBe(false);
    expect(isSafeReturnPath("javascript:alert(1)", AUTH)).toBe(false);
    expect(isSafeReturnPath("products", AUTH)).toBe(false);
  });

  it("rejects control characters", () => {
    expect(isSafeReturnPath("/products\u0000", AUTH)).toBe(false);
    expect(isSafeReturnPath("/products\nSet-Cookie: x", AUTH)).toBe(false);
    expect(isSafeReturnPath("/products\u007f", AUTH)).toBe(false);
  });
});

describe("safeReturnPath", () => {
  it("returns the path when it is safe", () => {
    expect(safeReturnPath("/products", AUTH, HOME)).toBe("/products");
  });

  it("falls back to home for anything rejected", () => {
    expect(safeReturnPath(null, AUTH, HOME)).toBe(HOME);
    expect(safeReturnPath("//evil.com", AUTH, HOME)).toBe(HOME);
    expect(safeReturnPath(AUTH, AUTH, HOME)).toBe(HOME);
  });
});
