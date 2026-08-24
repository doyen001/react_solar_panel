import { describe, expect, it } from "vitest";
import { buildEquipmentCards } from "./customer-design-view";
import type { CustomerDesign } from "./designs";

const DESIGN_WITH_TWO_BATTERIES = {
  id: "d1",
  userId: "u1",
  title: "Test design",
  status: "DRAFT",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  products: [
    {
      id: "dp1",
      quantity: 1,
      totalPrice: 7450,
      product: {
        id: "prod-battery-1",
        name: "Battery-Box Premium HVS",
        brand: "BYD",
        category: "Battery",
        wattage: null,
        price: 7450,
        specs: { type: "High voltage", usableCapacityKwh: 10.24 },
      },
    },
    {
      id: "dp2",
      quantity: 2,
      totalPrice: 19980,
      product: {
        id: "prod-battery-2",
        name: "Powerwall 3",
        brand: "Tesla",
        category: "Battery",
        wattage: null,
        price: 9990,
        specs: { type: "Lithium-ion", usableCapacityKwh: 13.5 },
      },
    },
  ],
} as unknown as CustomerDesign;

const DESIGN_WITH_NO_PRODUCTS = {
  id: "d2",
  userId: "u1",
  title: "Empty design",
  status: "DRAFT",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  products: [],
} as unknown as CustomerDesign;

describe("buildEquipmentCards", () => {
  it("renders one card per distinct product in a category, not one joined card", () => {
    const cards = buildEquipmentCards(DESIGN_WITH_TWO_BATTERIES);
    const batteryCards = cards.filter((card) => card.title === "Battery");

    expect(batteryCards).toHaveLength(2);
    expect(batteryCards.map((card) => card.id)).toEqual([
      "battery-prod-battery-1",
      "battery-prod-battery-2",
    ]);
  });

  it("gives each battery card its own model and capacity, not a joined string", () => {
    const cards = buildEquipmentCards(DESIGN_WITH_TWO_BATTERIES);
    const batteryCards = cards.filter((card) => card.title === "Battery");

    const modelRow = (card: (typeof cards)[number]) =>
      card.rows.find((row) => row.label === "Model")?.value;
    const capacityRow = (card: (typeof cards)[number]) =>
      card.rows.find((row) => row.label === "Capacity")?.value;

    expect(modelRow(batteryCards[0]!)).toBe("BYD Battery-Box Premium HVS");
    expect(capacityRow(batteryCards[0]!)).toBe("10.2 kWh");
    expect(modelRow(batteryCards[1]!)).toBe("Tesla Powerwall 3");
    // Line-item quantity (2) multiplies the per-unit capacity.
    expect(capacityRow(batteryCards[1]!)).toBe("27 kWh");
  });

  it("still renders exactly one placeholder card for a category with nothing attached", () => {
    const cards = buildEquipmentCards(DESIGN_WITH_NO_PRODUCTS);
    const panelCards = cards.filter((card) => card.title === "Solar Panels");

    expect(panelCards).toHaveLength(1);
    expect(panelCards[0]!.rows.find((row) => row.label === "Model")?.value).toBe(
      "N/A",
    );
  });

  it("always includes the Site Details card alongside the equipment cards", () => {
    const cards = buildEquipmentCards(DESIGN_WITH_NO_PRODUCTS);
    expect(cards.some((card) => card.id === "site")).toBe(true);
  });
});
