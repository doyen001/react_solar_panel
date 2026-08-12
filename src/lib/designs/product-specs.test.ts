import { describe, expect, it } from "vitest";
import {
  batteryCapacityKwh,
  cecApprovedLabel,
  inverterRatedKw,
  productLabel,
  productSeries,
  systemSizeKwFrom,
} from "./product-specs";

const panelItem = {
  quantity: 16,
  product: {
    name: "TSM-415",
    brand: "Trina",
    category: "Solar Panel",
    wattage: 415,
    specs: { cecApproved: true },
  },
};

const batteryItem = {
  quantity: 2,
  product: {
    name: "HVS 10.2",
    brand: "BYD",
    category: "Battery",
    wattage: null,
    specs: {
      cecApproved: true,
      series: "Battery-Box Premium",
      nominalCapacityKwh: 10.24,
      usableCapacityKwh: 9.2,
    },
  },
};

describe("productLabel", () => {
  it("combines brand and model", () => {
    expect(productLabel(panelItem)).toBe("Trina TSM-415");
  });

  it("falls back to the name when there is no brand", () => {
    expect(
      productLabel({ quantity: 1, product: { name: "Solo", category: "X" } }),
    ).toBe("Solo");
  });

  it("returns undefined for an empty category, so callers can show N/A", () => {
    expect(productLabel(undefined)).toBeUndefined();
    expect(productLabel(null)).toBeUndefined();
    expect(productLabel({ quantity: 1, product: null })).toBeUndefined();
  });
});

describe("batteryCapacityKwh", () => {
  it("prefers usable capacity and multiplies by quantity", () => {
    expect(batteryCapacityKwh(batteryItem)).toBeCloseTo(18.4);
  });

  it("falls back to nominal capacity", () => {
    expect(
      batteryCapacityKwh({
        quantity: 1,
        product: {
          name: "B",
          category: "Battery",
          specs: { nominalCapacityKwh: 5 },
        },
      }),
    ).toBe(5);
  });

  it("is undefined when the design has no battery", () => {
    expect(batteryCapacityKwh(undefined)).toBeUndefined();
  });

  it("is undefined when the product carries no capacity spec", () => {
    expect(
      batteryCapacityKwh({
        quantity: 1,
        product: { name: "B", category: "Battery", specs: {} },
      }),
    ).toBeUndefined();
  });
});

describe("inverterRatedKw", () => {
  it("reads ratedKw from specs", () => {
    expect(
      inverterRatedKw({
        quantity: 1,
        product: { name: "P5", category: "Inverter", specs: { ratedKw: 5 } },
      }),
    ).toBe(5);
  });

  it("converts wattage when specs carry no rating", () => {
    expect(
      inverterRatedKw({
        quantity: 1,
        product: { name: "P5", category: "Inverter", wattage: 7600 },
      }),
    ).toBeCloseTo(7.6);
  });

  it("is undefined when there is no inverter", () => {
    expect(inverterRatedKw(undefined)).toBeUndefined();
  });
});

describe("cecApprovedLabel / productSeries", () => {
  it("maps the boolean spec to Yes/No", () => {
    expect(cecApprovedLabel(batteryItem)).toBe("Yes");
    expect(
      cecApprovedLabel({
        quantity: 1,
        product: { name: "x", category: "Battery", specs: { cecApproved: false } },
      }),
    ).toBe("No");
  });

  it("is undefined when the spec is absent rather than assuming approval", () => {
    expect(
      cecApprovedLabel({
        quantity: 1,
        product: { name: "x", category: "Battery", specs: {} },
      }),
    ).toBeUndefined();
    expect(cecApprovedLabel(undefined)).toBeUndefined();
  });

  it("reads the series when present", () => {
    expect(productSeries(batteryItem)).toBe("Battery-Box Premium");
    expect(productSeries(panelItem)).toBeUndefined();
  });
});

describe("systemSizeKwFrom", () => {
  it("uses the attached panel wattage and the design's panel count", () => {
    expect(systemSizeKwFrom(panelItem, 16)).toBeCloseTo(6.64);
  });

  it("falls back to the line item quantity when the design has no count", () => {
    expect(systemSizeKwFrom(panelItem, null)).toBeCloseTo(6.64);
  });

  it("does not invent a wattage when no panel product is attached", () => {
    // The old behaviour assumed 412W here and reported a system size for a
    // design that has no panels at all.
    expect(systemSizeKwFrom(undefined, 16)).toBeUndefined();
    expect(
      systemSizeKwFrom(
        { quantity: 16, product: { name: "p", category: "Solar Panel" } },
        16,
      ),
    ).toBeUndefined();
  });

  it("is undefined when the count is missing or zero", () => {
    expect(systemSizeKwFrom({ ...panelItem, quantity: 0 }, 0)).toBeUndefined();
  });
});

describe("malformed specs", () => {
  it("ignores non-object specs instead of throwing", () => {
    for (const specs of ["nope", 42, null, [1, 2]]) {
      const item = { quantity: 1, product: { name: "x", category: "Battery", specs } };
      expect(batteryCapacityKwh(item)).toBeUndefined();
      expect(cecApprovedLabel(item)).toBeUndefined();
      expect(productSeries(item)).toBeUndefined();
    }
  });

  it("parses numeric specs stored as strings", () => {
    expect(
      batteryCapacityKwh({
        quantity: 1,
        product: {
          name: "x",
          category: "Battery",
          specs: { usableCapacityKwh: "9.2" },
        },
      }),
    ).toBeCloseTo(9.2);
  });
});
