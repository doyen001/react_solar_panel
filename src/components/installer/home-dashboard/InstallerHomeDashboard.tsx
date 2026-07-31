"use client";

import classNames from "classnames";
import { useEffect, useMemo, useState } from "react";
import type { InstallerDashboardSubTab } from "@/components/installer/dashboard/InstallerDashboardShell";
import type { InstallerDashboardShellContext } from "@/components/installer/dashboard/InstallerDashboardShell";
import { InstallerDashboardShell } from "@/components/installer/dashboard/InstallerDashboardShell";
import Icon from "@/components/ui/Icons";
import {
  fetchInstallerCustomer,
  type InstallerCustomerSummary,
} from "@/lib/installers/customers";
import {
  fetchInstallerDesigns,
  type InstallerCustomerDesign,
  type InstallerDesignProduct,
} from "@/lib/installers/designs";
import {
  INSTALLER_HOME_EQUIPMENT,
  INSTALLER_HOME_FINANCE,
} from "./installerHomeMock";
import { InstallerHomeAppointmentsPanel } from "./InstallerHomeAppointmentsPanel";
import { InstallerHomeCustomerCommunication } from "./InstallerHomeCustomerCommunication";
import { InstallerHomeCustomerPanels } from "./InstallerHomeCustomerPanels";
import { InstallerHomeCustomerProfileStrip } from "./InstallerHomeCustomerProfileStrip";
import { InstallerHomePipelineStatus } from "./InstallerHomePipelineStatus";
import { InstallerHomeSolarDesignCard } from "./InstallerHomeSolarDesignCard";

function IconBattery({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <rect x="2" y="7" width="18" height="10" rx="2" ry="2" />
      <path d="M22 11v2" strokeLinecap="round" />
    </svg>
  );
}

function IconCpu({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M9 9h6v6H9zM9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
    </svg>
  );
}

type InstallerHomeEquipment = typeof INSTALLER_HOME_EQUIPMENT;
type InstallerHomeFinance = typeof INSTALLER_HOME_FINANCE;

function formatCurrency(value?: number | null) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "-";
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value?: number | null, suffix = "") {
  if (typeof value !== "number" || !Number.isFinite(value)) return "-";
  return `${new Intl.NumberFormat("en-AU", {
    maximumFractionDigits: 1,
  }).format(value)}${suffix}`;
}

function designProductsTotal(design?: InstallerCustomerDesign | null) {
  return (
    design?.products?.reduce((total, item) => total + (item.totalPrice ?? 0), 0) ??
    0
  );
}

function productByCategory(
  design: InstallerCustomerDesign | null,
  category: string,
): InstallerDesignProduct | undefined {
  return design?.products?.find((item) =>
    item.product?.category.toLowerCase().includes(category),
  );
}

function productName(item?: InstallerDesignProduct) {
  if (!item?.product) return "Not selected";
  return item.product.brand
    ? `${item.product.brand} ${item.product.name}`
    : item.product.name;
}

function systemSizeKw(design?: InstallerCustomerDesign | null) {
  if (!design?.panelCount) return undefined;
  const panel = productByCategory(design, "panel");
  const wattage = panel?.product?.wattage ?? 412;
  return (design.panelCount * wattage) / 1000;
}

function buildEquipment(
  design: InstallerCustomerDesign | null,
): InstallerHomeEquipment {
  const panel = productByCategory(design, "panel");
  const inverter = productByCategory(design, "inverter");
  const battery = productByCategory(design, "battery");
  const kw = systemSizeKw(design);

  return {
    solar: [
      { label: "System Size", value: kw ? `${kw.toFixed(1)} kW` : "-" },
      { label: "Panel Name", value: productName(panel) },
      { label: "Model", value: panel?.product?.sku || "-" },
      {
        label: "Panel Watts",
        value: panel?.product?.wattage ? `${panel.product.wattage}W` : "-",
      },
      { label: "Qty", value: String(design?.panelCount ?? panel?.quantity ?? "-") },
    ],
    battery: [
      { label: "Battery Model", value: productName(battery) },
      {
        label: "Type",
        value: battery ? "Lithium-ion" : "Not selected",
      },
      { label: "Size", value: battery ? `${battery.quantity} unit` : "-" },
      { label: "CEC Approved", value: battery ? "Yes" : "-" },
    ],
    equipment: [
      { label: "Inverter", value: productName(inverter) },
      { label: "Optimizer", value: "N/A" },
      { label: "Monitoring", value: "Included" },
    ],
    site: [
      { label: "Address", value: design?.address || "-" },
      { label: "Roof Area", value: formatNumber(design?.roofArea, " m2") },
      {
        label: "Annual Sunlight",
        value: formatNumber(design?.annualSunlight, " hrs"),
      },
      { label: "Design Status", value: design?.status.replace("_", " ") || "-" },
    ],
  };
}

function buildFinance(
  design: InstallerCustomerDesign | null,
): InstallerHomeFinance {
  const equipmentCost = designProductsTotal(design);
  const salePrice = design?.estimatedSavings
    ? design.estimatedSavings * 8
    : equipmentCost;
  const installerCost = equipmentCost ? equipmentCost * 0.75 : undefined;

  return [
    { label: "STC Panel", value: design?.panelCount ? `${design.panelCount} panels` : "-" },
    {
      label: "STC BESS",
      value: productByCategory(design, "battery") ? "Included" : "Not selected",
    },
    { label: "Payment Type", value: "Finance" },
    { label: "Payment Status", value: design?.lead?.status || design?.status || "-" },
    { label: "Installer Cost", value: formatCurrency(installerCost) },
    { label: "Equipment Cost", value: formatCurrency(equipmentCost) },
    { label: "Sale Price", value: formatCurrency(salePrice) },
  ].slice(0, INSTALLER_HOME_FINANCE.length) as InstallerHomeFinance;
}

export function InstallerHomeDashboard({
  activeSubTab,
}: {
  activeSubTab: Exclude<InstallerDashboardSubTab, "schedule">;
}) {
  return (
    <InstallerDashboardShell activeSubTab={activeSubTab}>
      {({ selectedCustomerId, selectedCustomer }) =>
        activeSubTab === "pipeline" ? (
          <InstallerHomePipelineStatus />
        ) : (
          <InstallerHomeDetail
            selectedCustomerId={selectedCustomerId}
            selectedCustomer={selectedCustomer}
          />
        )
      }
    </InstallerDashboardShell>
  );
}

function InstallerHomeDetail({
  selectedCustomerId,
  selectedCustomer,
}: InstallerDashboardShellContext) {
  const [customer, setCustomer] = useState<InstallerCustomerSummary | null>(
    null,
  );
  const [design, setDesign] = useState<InstallerCustomerDesign | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedCustomerId || selectedCustomerId.startsWith("fallback-")) {
      setCustomer(null);
      setDesign(null);
      setError(null);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    Promise.all([
      fetchInstallerCustomer(selectedCustomerId, {
        signal: controller.signal,
      }),
      fetchInstallerDesigns(
        {
          customerId: selectedCustomerId,
          customerEmail: selectedCustomer?.email,
          limit: 1,
        },
        { signal: controller.signal },
      ),
    ])
      .then(([customerData, designs]) => {
        setCustomer(customerData);
        setDesign(designs[0] ?? null);
      })
      .catch((e) => {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setError(e instanceof Error ? e.message : "Failed to load customer");
        setCustomer(null);
        setDesign(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [selectedCustomer?.email, selectedCustomerId]);

  const customerForDisplay = useMemo<InstallerCustomerSummary | null>(() => {
    if (customer) return customer;
    if (!selectedCustomer) return null;
    const [firstName, ...lastNameParts] = selectedCustomer.name.split(" ");
    return {
      id: selectedCustomer.id,
      firstName,
      lastName: lastNameParts.join(" "),
      email: selectedCustomer.email,
    };
  }, [customer, selectedCustomer]);

  const equipment = useMemo(() => buildEquipment(design), [design]);
  const finance = useMemo(() => buildFinance(design), [design]);

  return (
    <>
      {loading || error || !design ? (
        <div className="mb-3 rounded-lg border border-warm-border bg-cream-50 px-4 py-3 font-dm-sans text-sm text-warm-gray">
          {loading
            ? "Loading selected customer solar design..."
            : error
              ? error
              : "No solar design found for the selected customer."}
        </div>
      ) : null}

      <InstallerHomeSolarDesignCard design={design} />

          {/* Equipment cards */}
          <section className="mt-5">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <EquipmentCard
                title="Solar System"
                icon={<Icon name="Sun" className="text-warm-ink" />}
                rows={equipment.solar}
              />
              <EquipmentCard
                title="Battery System"
                icon={<IconBattery className="text-warm-ink" />}
                rows={equipment.battery}
              />
              <EquipmentCard
                title="Equipment"
                icon={<IconCpu className="text-warm-ink" />}
                rows={equipment.equipment}
              />
              <EquipmentCard
                title="Site Details"
                icon={<Icon name="LocationPin" className="text-warm-ink" />}
                rows={equipment.site}
              />
            </div>

            <button
              type="button"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-warm-border bg-cream-50 py-3 font-inter text-sm font-medium text-warm-ink hover:bg-cream-100"
            >
              <span className="text-lg leading-none">+</span>
              Create New Deal / System
            </button>
          </section>

          <InstallerHomeCustomerProfileStrip
            customerId={selectedCustomerId}
            customer={customerForDisplay}
            design={design}
            onCustomerUpdated={setCustomer}
          />

          {/* Finance strip */}
          <section className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-warm-border bg-warm-border md:grid-cols-3 xl:grid-cols-6">
            {finance.map((cell) => (
              <div
                key={cell.label}
                className="bg-white px-3 py-3 text-center md:py-4"
              >
                <p className="font-inter text-[11px] font-medium uppercase tracking-wide text-warm-gray md:text-xs">
                  {cell.label}
                </p>
                <p className="mt-2 font-inter text-sm font-semibold text-warm-ink md:text-[15px]">
                  {cell.value}
                </p>
              </div>
            ))}
          </section>

          <InstallerHomeCustomerCommunication customerId={selectedCustomerId} />

          {/* Bottom panels */}
          <div className="mt-6 space-y-6 pb-10">
            <InstallerHomeAppointmentsPanel
              nodeId="3:9097"
              customerId={selectedCustomerId}
            />
            <InstallerHomeCustomerPanels customerId={selectedCustomerId} />
          </div>
    </>
  );
}

/** Figma node 3:8717 — equipment mini-card (Solar System reference). */
function EquipmentSpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-h-[19.875px] min-w-0 items-start justify-between gap-2 font-dm-sans">
      <span className="shrink-0 text-[13.25px] leading-[19.875px] text-warm-gray">
        {label}
      </span>
      <span
        className="min-w-0 truncate text-right text-[13.25px] font-medium leading-[19.875px] text-warm-ink"
        title={value}
      >
        {value}
      </span>
    </div>
  );
}

function EquipmentCard({
  title,
  icon,
  rows,
}: {
  title: string;
  icon: React.ReactNode;
  rows: { label: string; value: string }[];
}) {
  return (
    <div
      className="relative min-w-0 overflow-hidden rounded-[11px] border-[1.157px] border-warm-border bg-cream-50 p-[13.24px]"
      data-node-id="3:8717"
    >
      <div className="flex items-center gap-[8.825px] pr-[52px]">
        <span className="flex size-[30.907px] shrink-0 items-center justify-center rounded-[8.833px] bg-linear-to-b from-yellow-lemon to-orange-amber text-warm-ink [&_svg]:size-[15.445px]">
          {icon}
        </span>
        <h4 className="min-w-0 truncate font-inter text-[13.25px] font-bold uppercase leading-[19.875px] tracking-[0.33px] text-warm-ink">
          {title}
        </h4>
      </div>
      <div className="absolute right-[13.24px] top-[8.83px] flex gap-[4.413px]">
        <button
          type="button"
          className="flex size-[22.082px] items-center justify-center rounded-[4.417px] text-warm-gray hover:bg-black/5"
          aria-label="Edit"
        >
          <Icon name="Pencil" className="size-[13.24px]" />
        </button>
        <button
          type="button"
          className="flex size-[22.082px] items-center justify-center rounded-[4.417px] text-danger hover:bg-black/5"
          aria-label="Delete"
        >
          <Icon name="Trash" className="size-[13.24px]" />
        </button>
      </div>
      <div className="mt-[13px] flex flex-col gap-[4.413px]">
        {rows.map((row) => (
          <EquipmentSpecRow
            key={row.label}
            label={row.label}
            value={row.value}
          />
        ))}
      </div>
    </div>
  );
}
