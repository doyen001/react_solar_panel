import { describe, expect, it } from "vitest";
import { equipmentRows } from "./generateProposalPdf";
import {
  DESIGN_PROPOSAL_DEFAULTS,
  emptyEquipmentItems,
} from "@/lib/store/designProposalSlice";

describe("equipmentRows", () => {
  it("omits every category when nothing was selected", () => {
    const rows = equipmentRows({
      ...DESIGN_PROPOSAL_DEFAULTS,
      equipment: { ...DESIGN_PROPOSAL_DEFAULTS.equipment, items: emptyEquipmentItems() },
    });
    expect(rows).toEqual([]);
  });

  it("emits one row per non-empty category, joining multiple items with a quantity suffix", () => {
    const rows = equipmentRows({
      ...DESIGN_PROPOSAL_DEFAULTS,
      equipment: {
        ...DESIGN_PROPOSAL_DEFAULTS.equipment,
        items: {
          ...emptyEquipmentItems(),
          battery: [
            { productId: "b1", brand: "BYD", name: "HVS", quantity: 1, ratingLabel: "10 kWh" },
            { productId: "b2", brand: "Tesla", name: "Powerwall 3", quantity: 2, ratingLabel: "13.5 kWh" },
          ],
          evCharger: [
            { productId: "e1", brand: "Tesla", name: "Wall Connector", quantity: 1, ratingLabel: "11 kW" },
          ],
        },
      },
    });

    expect(rows).toEqual([
      ["Battery", "HVS (10 kWh), Powerwall 3 ×2 (13.5 kWh)"],
      ["EV charger", "Wall Connector (11 kW)"],
    ]);
  });

  it("omits the EV charger / heat pump rows entirely when those categories are unused", () => {
    const rows = equipmentRows({
      ...DESIGN_PROPOSAL_DEFAULTS,
      equipment: {
        ...DESIGN_PROPOSAL_DEFAULTS.equipment,
        items: {
          ...emptyEquipmentItems(),
          solarPanel: [
            { productId: "p1", brand: "Trina", name: "TSM-630", quantity: 16, ratingLabel: "630 W" },
          ],
        },
      },
    });

    expect(rows.map(([label]) => label)).toEqual(["Solar panels"]);
  });
});
