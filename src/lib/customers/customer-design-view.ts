import type {
  ComparisonRow,
  DesignColumn,
  EquipmentCardData,
  SpecLine,
} from "@/components/customer/design/designConstants";
import type {
  CustomerDesign,
  CustomerDesignProduct,
} from "@/lib/customers/designs";
import { designMapScreenshotUrl } from "@/lib/designs/map-screenshot";
export { designMapScreenshotUrl };
import {
  batteryCapacityKwh,
  cecApprovedLabel,
  inverterRatedKw,
  numberSpec,
  productLabel,
  productSeries,
  productsByCategory,
  systemSizeKwFrom,
  NOT_AVAILABLE,
  NO_VALUE,
  productType,
} from "@/lib/designs/product-specs";

const STATUS_RANK: Record<CustomerDesign["status"], number> = {
  COMPLETED: 0,
  IN_PROGRESS: 1,
  DRAFT: 2,
  ARCHIVED: 3,
};

function formatCurrency(value?: number | null, suffix = "") {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  return `${new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value)}${suffix}`;
}

function formatNumber(value?: number | null, suffix = "") {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  return `${new Intl.NumberFormat("en-AU", {
    maximumFractionDigits: value >= 100 ? 0 : 1,
  }).format(value)}${suffix}`;
}

function productByCategory(
  design: CustomerDesign,
  category: string,
): CustomerDesignProduct | undefined {
  return productsByCategory(design.products, category)[0];
}

/** One convention across the page: an unattached category always reads N/A. */
function productDisplayName(item?: CustomerDesignProduct) {
  return productLabel(item) ?? NOT_AVAILABLE;
}

function designProductsTotal(design: CustomerDesign) {
  return (
    design.products?.reduce((total, item) => total + (item.totalPrice ?? 0), 0) ??
    0
  );
}

function systemSizeKw(design: CustomerDesign) {
  return systemSizeKwFrom(productByCategory(design, "panel"), design.panelCount);
}

function annualOutputKwh(design: CustomerDesign) {
  const solar = design.solarData as { yearlyEnergyDcKwh?: number } | null;
  if (typeof solar?.yearlyEnergyDcKwh === "number") {
    return solar.yearlyEnergyDcKwh;
  }
  const kw = systemSizeKw(design);
  if (!kw) return undefined;
  return Math.round(kw * 4.5 * 365);
}

function wizardField(design: CustomerDesign, key: string): string | undefined {
  const wizard = design.wizardData as Record<string, unknown> | null;
  const value = wizard?.[key];
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return undefined;
}

/**
 * The design this customer's page is about.
 *
 * Prefers the server's `isPrimary` flag, which the installer home panel
 * resolves through too — that shared flag is what keeps the two portals showing
 * the same design. The local sort is only a fallback for payloads without it,
 * and mirrors the backend rule in `design.selection.ts`.
 */
export function pickPrimaryDesign(designs: CustomerDesign[]) {
  if (!designs.length) return null;

  const flagged = designs.find((design) => design.isPrimary);
  if (flagged) return flagged;

  return [...designs].sort((a, b) => {
    const rank = STATUS_RANK[a.status] - STATUS_RANK[b.status];
    if (rank !== 0) return rank;

    const updated =
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    if (updated !== 0) return updated;

    const created =
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (created !== 0) return created;

    return a.id.localeCompare(b.id);
  })[0];
}

export function designStatusLabel(design: CustomerDesign) {
  switch (design.status) {
    case "COMPLETED":
      return "Approved";
    case "IN_PROGRESS":
      return "In progress";
    case "ARCHIVED":
      return "Archived";
    default:
      return "Draft";
  }
}

export function buildDesignSpecs(design: CustomerDesign): SpecLine[] {
  const panel = productByCategory(design, "panel");
  const inverter = productByCategory(design, "inverter");
  const battery = productByCategory(design, "battery");
  const kw = systemSizeKw(design);

  return [
    { label: "System Size", value: kw ? `${kw.toFixed(1)} kW` : "—" },
    { label: "Panel Model", value: productDisplayName(panel) },
    {
      label: "Panel Count",
      value: design.panelCount != null ? String(design.panelCount) : "—",
    },
    { label: "Inverter", value: productDisplayName(inverter) },
    { label: "Battery", value: productDisplayName(battery) },
    { label: "Orientation", value: wizardField(design, "orientation") ?? "—" },
    { label: "Tilt Angle", value: wizardField(design, "tiltAngle") ?? "—" },
  ];
}

export function buildPerformanceEstimates(design: CustomerDesign): SpecLine[] {
  const annual = annualOutputKwh(design);
  const daily = annual ? annual / 365 : undefined;
  const savings = design.estimatedSavings;
  const equipmentCost = designProductsTotal(design);
  const payback =
    savings && savings > 0 && equipmentCost > 0
      ? `${(equipmentCost / savings).toFixed(1)} yrs`
      : "—";

  return [
    { label: "Daily Output", value: daily ? `${formatNumber(daily)} kWh` : "—" },
    {
      label: "Annual Output",
      value: annual ? `${formatNumber(annual)} kWh` : "—",
    },
    {
      label: "Self-Consumption",
      value: wizardField(design, "selfConsumption") ?? "—",
    },
    { label: "Payback Period", value: payback },
    {
      label: "CO₂ Offset",
      value: annual ? `${formatNumber(annual * 0.00081, " t/yr")}` : "—",
    },
    {
      label: "Feed-in Tariff",
      value: wizardField(design, "feedInTariff") ?? "—",
    },
  ];
}

/** "Model A, Model B ×2" — every attached item in a category, not just the first. */
function joinedProductNames(items: CustomerDesignProduct[]): string {
  if (items.length === 0) return NOT_AVAILABLE;
  return items
    .map((item) => {
      const name = productLabel(item) ?? "—";
      return item.quantity > 1 ? `${name} ×${item.quantity}` : name;
    })
    .join(", ");
}

function totalQuantity(items: CustomerDesignProduct[]): number {
  return items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
}

export function buildEquipmentCards(design: CustomerDesign): EquipmentCardData[] {
  const panelItems = productsByCategory(design.products, "panel");
  const inverterItems = productsByCategory(design.products, "inverter");
  const batteryItems = productsByCategory(design.products, "battery");
  const evChargerItems = productsByCategory(design.products, "ev charger");
  const heatPumpItems = productsByCategory(design.products, "heat pump");

  const panel = panelItems[0];
  const inverter = inverterItems[0];
  const battery = batteryItems[0];
  const evCharger = evChargerItems[0];
  const heatPump = heatPumpItems[0];
  const kw = systemSizeKw(design);

  // Every card is always rendered, but a category with nothing in the design's
  // products array reads N/A rather than a placeholder spec.
  const batteryKwh = batteryCapacityKwh(battery);
  const evChargerKw = inverterRatedKw(evCharger);
  const heatPumpCapacityL = numberSpec(heatPump?.product, "capacityL");

  return [
    {
      id: "panels",
      title: "Solar Panels",
      iconName: "MyDesignSun",
      rows: [
        { label: "Model", value: joinedProductNames(panelItems) },
        {
          label: "Watts",
          value: panel?.product?.wattage
            ? `${panel.product.wattage}W`
            : NO_VALUE,
        },
        {
          label: "Qty",
          value:
            design.panelCount != null
              ? String(design.panelCount)
              : panelItems.length
                ? String(totalQuantity(panelItems))
                : NO_VALUE,
        },
        { label: "Total", value: kw ? `${kw.toFixed(2)} kW` : NO_VALUE },
      ],
    },
    {
      id: "battery",
      title: "Battery",
      iconName: "MyDesignsBattery",
      rows: [
        { label: "Model", value: joinedProductNames(batteryItems) },
        {
          label: "Capacity",
          value:
            batteryKwh !== undefined
              ? `${formatNumber(batteryKwh)} kWh`
              : NO_VALUE,
        },
        { label: "Type", value: productType(battery) ?? NO_VALUE },
      ],
    },
    {
      id: "inverter",
      title: "Inverter",
      iconName: "MyDesignsInverter",
      rows: [
        { label: "Model", value: joinedProductNames(inverterItems) },
        {
          label: "Type",
          value: productType(inverter) ?? NO_VALUE,
        },
        { label: "Monitoring", value: productType(inverter) ?? NO_VALUE },
      ],
    },
    {
      id: "ev-charger",
      title: "EV Charger",
      iconName: "Zap",
      rows: [
        { label: "Model", value: joinedProductNames(evChargerItems) },
        {
          label: "Rating",
          value: evChargerKw !== undefined ? `${evChargerKw} kW` : NO_VALUE,
        },
        { label: "Qty", value: evChargerItems.length ? String(totalQuantity(evChargerItems)) : NO_VALUE },
      ],
    },
    {
      id: "heat-pump",
      title: "Heat Pump",
      iconName: "HeatPump",
      rows: [
        { label: "Model", value: joinedProductNames(heatPumpItems) },
        {
          label: "Capacity",
          value: heatPumpCapacityL !== undefined ? `${heatPumpCapacityL} L` : NO_VALUE,
        },
        { label: "Qty", value: heatPumpItems.length ? String(totalQuantity(heatPumpItems)) : NO_VALUE },
      ],
    },
    {
      id: "site",
      title: "Site Details",
      iconName: "LocationPin",
      rows: [
        { label: "Roof", value: design.address?.trim() || "—" },
        {
          label: "Phase",
          value: formatNumber(design.roofArea, " m²"),
        },
        {
          label: "NMI",
          value: formatNumber(design.annualSunlight, " hrs"),
        },
        {
          label: "Retailer",
          value: design.status.replaceAll("_", " "),
        },
      ],
    },
  ];
}

export function buildComparisonTable(
  designs: CustomerDesign[],
  selectedId: string | null,
) {
  const columns: DesignColumn[] = designs.map((design, index) => ({
    id: design.id,
    label: design.title.trim() || `Design ${index + 1}`,
    selected: design.id === selectedId,
  }));

  const mapValues = (pick: (design: CustomerDesign) => string) =>
    designs.map(pick);

  const rows: ComparisonRow[] = [
    {
      feature: "System size",
      values: mapValues((design) => {
        const kw = systemSizeKw(design);
        return kw ? `${kw.toFixed(1)} kW` : "—";
      }),
    },
    {
      feature: "Panels",
      values: mapValues((design) =>
        design.panelCount != null ? String(design.panelCount) : "—",
      ),
    },
    {
      feature: "Inverter",
      values: mapValues((design) =>
        productDisplayName(productByCategory(design, "inverter")),
      ),
    },
    {
      feature: "Battery",
      values: mapValues((design) => {
        const battery = productByCategory(design, "battery");
        return productDisplayName(battery);
      }),
    },
    {
      feature: "Annual output",
      values: mapValues((design) => {
        const annual = annualOutputKwh(design);
        return annual ? `${formatNumber(annual)} kWh` : "—";
      }),
    },
    {
      feature: "Savings",
      values: mapValues((design) =>
        formatCurrency(design.estimatedSavings, "/yr"),
      ),
    },
    {
      feature: "Price",
      values: mapValues((design) =>
        formatCurrency(designProductsTotal(design)),
      ),
    },
  ];

  return { columns, rows };
}

export function formatDesignUpdatedAt(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export function formatSavingsLabel(design: CustomerDesign) {
  if (typeof design.estimatedSavings !== "number") {
    return "Estimated savings unavailable";
  }
  return `Estimated savings: ${formatCurrency(design.estimatedSavings, "/yr")}`;
}
