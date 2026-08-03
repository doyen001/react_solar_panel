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
  return design.products?.find((item) =>
    item.product?.category.toLowerCase().includes(category),
  );
}

function productDisplayName(item?: CustomerDesignProduct) {
  if (!item?.product) return "Not selected";
  return item.product.brand
    ? `${item.product.brand} ${item.product.name}`
    : item.product.name;
}

function designProductsTotal(design: CustomerDesign) {
  return (
    design.products?.reduce((total, item) => total + (item.totalPrice ?? 0), 0) ??
    0
  );
}

function systemSizeKw(design: CustomerDesign) {
  if (!design.panelCount) return undefined;
  const panel = productByCategory(design, "panel");
  const wattage = panel?.product?.wattage ?? 412;
  return (design.panelCount * wattage) / 1000;
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

export function pickPrimaryDesign(designs: CustomerDesign[]) {
  if (!designs.length) return null;
  return [...designs].sort((a, b) => {
    const rank = STATUS_RANK[a.status] - STATUS_RANK[b.status];
    if (rank !== 0) return rank;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
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
    { label: "Battery", value: battery ? productDisplayName(battery) : "None" },
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

export function buildEquipmentCards(design: CustomerDesign): EquipmentCardData[] {
  const panel = productByCategory(design, "panel");
  const inverter = productByCategory(design, "inverter");
  const battery = productByCategory(design, "battery");
  const kw = systemSizeKw(design);

  return [
    {
      id: "panels",
      title: "Solar Panels",
      iconName: "MyDesignSun",
      rows: [
        { label: "Model", value: productDisplayName(panel) },
        {
          label: "Watts",
          value: panel?.product?.wattage ? `${panel.product.wattage}W` : "—",
        },
        {
          label: "Qty",
          value:
            design.panelCount != null
              ? String(design.panelCount)
              : panel?.quantity != null
                ? String(panel.quantity)
                : "—",
        },
        { label: "Total", value: kw ? `${kw.toFixed(2)} kW` : "—" },
      ],
    },
    {
      id: "battery",
      title: "Battery",
      iconName: "MyDesignsBattery",
      rows: [
        { label: "Model", value: battery ? productDisplayName(battery) : "N/A" },
        {
          label: "Capacity",
          value: battery ? `${battery.quantity} unit` : "—",
        },
        { label: "Type", value: battery ? "Lithium-ion" : "—" },
      ],
    },
    {
      id: "inverter",
      title: "Inverter",
      iconName: "MyDesignsInverter",
      rows: [
        { label: "Model", value: productDisplayName(inverter) },
        { label: "Type", value: inverter ? "String" : "—" },
        { label: "Monitoring", value: inverter ? "Included" : "—" },
      ],
    },
    {
      id: "site",
      title: "Site Details",
      iconName: "LocationPin",
      rows: [
        { label: "Address", value: design.address?.trim() || "—" },
        {
          label: "Roof Area",
          value: formatNumber(design.roofArea, " m²"),
        },
        {
          label: "Annual Sunlight",
          value: formatNumber(design.annualSunlight, " hrs"),
        },
        {
          label: "Design Status",
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
        return battery ? productDisplayName(battery) : "None";
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
