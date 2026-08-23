import { describe, expect, it } from "vitest";
import {
  BUILDER_CATEGORIES,
  brandsOf,
  modelsOf,
  type BuilderProduct,
} from "./catalogue";

const products: BuilderProduct[] = [
  {
    id: "p1",
    name: "AE400MD-108",
    brand: "AE Solar GmbH",
    category: "Solar Panel",
    wattage: 400,
    price: 260,
  },
  {
    id: "p2",
    name: "AE410MD-108",
    brand: "AE Solar GmbH",
    category: "Solar Panel",
    wattage: 410,
    price: 270,
  },
  {
    id: "p3",
    name: "Tiger Neo",
    brand: "Jinko",
    category: "Solar Panel",
    wattage: 440,
    price: 300,
  },
];

describe("brandsOf", () => {
  it("returns distinct brands alphabetically", () => {
    expect(brandsOf(products)).toEqual(["AE Solar GmbH", "Jinko"]);
  });

  it("handles an empty catalogue", () => {
    expect(brandsOf([])).toEqual([]);
  });
});

describe("BUILDER_CATEGORIES", () => {
  it("covers the five builder cards and matches the API keys", () => {
    expect(BUILDER_CATEGORIES).toEqual([
      "Solar Panel",
      "Inverter",
      "Battery",
      "EV Charger",
      "Heat Pump",
    ]);
  });
});

describe("modelsOf", () => {
  it("returns only the chosen brand's models, sorted", () => {
    expect(modelsOf(products, "AE Solar GmbH").map((p) => p.name)).toEqual([
      "AE400MD-108",
      "AE410MD-108",
    ]);
  });

  it("returns nothing for an unknown or unset brand", () => {
    expect(modelsOf(products, "")).toEqual([]);
    expect(modelsOf(products, "Nope")).toEqual([]);
  });

  it("keeps ids so a selection can be persisted", () => {
    expect(modelsOf(products, "Jinko")[0]?.id).toBe("p3");
  });
});
