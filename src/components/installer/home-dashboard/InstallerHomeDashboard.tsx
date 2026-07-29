"use client";

import classNames from "classnames";
import { useEffect, useMemo, useState } from "react";
import type { InstallerDashboardSubTab } from "@/components/installer/dashboard/InstallerDashboardShell";
import type { InstallerDashboardShellContext } from "@/components/installer/dashboard/InstallerDashboardShell";
import { InstallerDashboardShell } from "@/components/installer/dashboard/InstallerDashboardShell";
import {
  IconCheckSquare,
  IconPanelPlus,
  IconPanelTag,
} from "@/components/installer/dashboard/installerDashboardIcons";
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
  INSTALLER_HOME_CHANNELS,
  INSTALLER_HOME_EQUIPMENT,
  INSTALLER_HOME_FINANCE,
  INSTALLER_HOME_PIPELINE_ACTIVE_PHASE_INDEX,
  INSTALLER_HOME_PIPELINE_PHASES,
  INSTALLER_HOME_PROFILE,
  INSTALLER_HOME_TAGS,
} from "./installerHomeMock";
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

function IconBuilding({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path d="M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18M6 22h15M10 10h4M10 14h4M10 6h4" />
    </svg>
  );
}

function IconSparkles({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M3 12h2M19 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/** Figma 3:9024 — compose toolbar icons (~15.445px) */
function IconComposeBold({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M8 5h6.5a3.5 3.5 0 010 7H8V5zm0 9h7a4 4 0 010 8H8v-8z" />
    </svg>
  );
}

function IconComposeItalic({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path strokeLinecap="round" d="M11 5l-4 14M19 5l-4 14" />
    </svg>
  );
}

function IconComposeLink({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}

function IconComposeImage({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8.5" cy="10.5" r="1.5" />
      <path d="M21 15l-6-6-4 4-3-3-4 4" />
    </svg>
  );
}

function IconComposeAttach({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function IconComposeEmoji({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
    </svg>
  );
}

function IconComposeSend({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M2 21l21-9L2 3v7l15 4-15 4v7z" />
    </svg>
  );
}

/** Figma 3:8986 — overlap layout is relative to 1166px-wide frame */
const PIPELINE_BAR_REF_WIDTH = 1166;

const PIPELINE_SEGMENT_LAYOUT = [
  { left: 0, width: 303, z: 10, round: "rounded-[12px]" },
  {
    left: 271,
    width: 300,
    z: 20,
    round: "rounded-br-[12px] rounded-tr-[12px]",
  },
  {
    left: 542,
    width: 312,
    z: 30,
    round: "rounded-br-[12px] rounded-tr-[12px]",
  },
  {
    left: 833,
    width: 333,
    z: 40,
    round: "rounded-br-[12px] rounded-tr-[12px]",
  },
] as const;

const PIPELINE_PHASE_ACTIVE_BG =
  "linear-gradient(98.60461707551042deg, rgb(191, 70, 198) 4.0573%, rgb(113, 0, 119) 98.533%), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%)";

const PIPELINE_PHASE_INACTIVE_BG =
  "linear-gradient(90deg, rgba(78, 78, 78, 0.83) 0%, rgba(78, 78, 78, 0.83) 100%), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%)";

type InstallerHomeProfile = typeof INSTALLER_HOME_PROFILE;
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

function customerName(customer?: InstallerCustomerSummary | null) {
  const fullName =
    `${customer?.firstName ?? ""} ${customer?.lastName ?? ""}`.trim();
  return fullName || customer?.email || "Selected Customer";
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

function buildProfile(
  customer: InstallerCustomerSummary | null,
  design: InstallerCustomerDesign | null,
): InstallerHomeProfile {
  const salePrice = design?.estimatedSavings
    ? design.estimatedSavings * 8
    : designProductsTotal(design);
  const equipmentCost = designProductsTotal(design);

  return {
    name: customerName(customer),
    ref: customer?.id ? `REF #${customer.id.slice(0, 8).toUpperCase()}` : "-",
    phone: customer?.phone || "-",
    email: customer?.email || "-",
    type: "Individual",
    salePrice: formatCurrency(salePrice),
    profit: formatCurrency(Math.max(0, salePrice - equipmentCost)),
  };
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

function PipelinePhaseStrip({
  phases,
  activeIndex,
}: {
  phases: readonly string[];
  activeIndex: number;
}) {
  return (
    <ol className="relative isolate mx-auto mb-0 mt-0 h-[50px] w-[1166px] max-w-full min-w-[1166px] list-none overflow-hidden rounded-[12px] bg-white p-0">
      {phases.map((label, i) => {
        const layout = PIPELINE_SEGMENT_LAYOUT[i];
        if (!layout) return null;
        const isActive = i === activeIndex;
        const leftPct = (layout.left / PIPELINE_BAR_REF_WIDTH) * 100;
        const widthPct = (layout.width / PIPELINE_BAR_REF_WIDTH) * 100;
        return (
          <li
            key={label}
            className={classNames(
              "absolute top-0 flex h-[50px] items-center justify-center overflow-hidden border-2 border-[rgba(231,231,231,0.3)] px-2",
              layout.round,
            )}
            style={{
              left: `${leftPct}%`,
              width: `${widthPct}%`,
              zIndex: layout.z,
              backgroundImage: isActive
                ? PIPELINE_PHASE_ACTIVE_BG
                : PIPELINE_PHASE_INACTIVE_BG,
            }}
            aria-current={isActive ? "step" : undefined}
          >
            <span
              className="text-center font-dm-sans text-[12px] font-bold leading-normal tracking-[0.5521px] whitespace-nowrap text-white uppercase"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
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

  const profile = useMemo(
    () => buildProfile(customerForDisplay, design),
    [customerForDisplay, design],
  );
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

          {/* Customer profile strip — Figma 3:8907 */}
          <section
            className="mt-6 overflow-hidden rounded-[11px] bg-linear-to-b from-yellow-lemon to-orange-amber px-[17px] py-[20px] md:px-[21px]"
            data-node-id="3:8907"
          >
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-[26.5px]">
              <div className="flex shrink-0 items-start gap-[16.5px]">
                <div className="flex size-[52.99px] shrink-0 items-center justify-center rounded-full bg-warm-black/20">
                  <Icon
                    name="User"
                    className="size-[26.49px] text-warm-black"
                  />
                </div>
                <div className="min-w-0 pt-[2px]">
                  <h2 className="font-inter text-[19.875px] font-bold leading-[29.81px] text-warm-black">
                    {profile.name}
                  </h2>
                  <p className="font-dm-sans text-[13.25px] font-medium leading-[19.875px] text-warm-black/70">
                    {profile.ref}
                  </p>
                </div>
              </div>

              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-[26.5px] gap-y-5">
                <ProfileDetailField
                  icon={<Icon name="Phone" className="text-warm-black" />}
                  label="Phone"
                  value={profile.phone}
                />
                <ProfileDetailField
                  icon={<Icon name="Mail" className="text-warm-black" />}
                  label="Email"
                  value={profile.email}
                  className="min-w-0 max-w-[min(100%,280px)]"
                />
                <ProfileDetailField
                  icon={<IconBuilding className="text-warm-black" />}
                  label="Type"
                  value={profile.type}
                />
                <ProfileDetailField
                  icon={<Icon name="Dollar" className="text-warm-black" />}
                  label="Sale Price"
                  value={profile.salePrice}
                />
                <ProfileDetailField
                  icon={<Icon name="Dollar" className="text-warm-black" />}
                  label="Profit"
                  value={profile.profit}
                />
              </div>

              <div className="flex shrink-0 items-center gap-[9.89px]">
                <button
                  type="button"
                  className="inline-flex h-[30.907px] items-center gap-2 rounded-[8.833px] bg-warm-black/15 pl-[13.24px] pr-[14px] font-dm-sans text-[13.25px] font-semibold leading-[19.875px] text-warm-black hover:bg-warm-black/25"
                >
                  <Icon name="Pencil" className="size-[15.445px]" />
                  Edit
                </button>
                <button
                  type="button"
                  className="inline-flex h-[30.907px] items-center gap-2 rounded-[8.833px] bg-linear-to-br from-brand-blue to-brand-teal pl-[13.24px] pr-[16px] font-dm-sans text-[13.25px] font-semibold leading-[19.875px] text-white hover:opacity-95"
                >
                  <ProfileUploadIcon className="size-[15.445px] shrink-0 text-white" />
                  Upload
                </button>
              </div>
            </div>
          </section>

          {/* Pipeline stage strip — Figma 3:8986 */}
          <nav
            className="mt-5 overflow-x-auto"
            aria-label="Project pipeline phases"
          >
            <PipelinePhaseStrip
              phases={INSTALLER_HOME_PIPELINE_PHASES}
              activeIndex={INSTALLER_HOME_PIPELINE_ACTIVE_PHASE_INDEX}
            />
          </nav>

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

          {/* Communication — Figma 3:9024 */}
          <section className="mt-6 overflow-hidden rounded-[11.042px] border-[1.157px] border-warm-border bg-cream-50">
            <div className="flex min-h-[43.06px] items-center justify-between gap-4 border-l-[2.315px] border-yellow-lemon bg-linear-to-b from-[rgba(245,159,10,0.15)] to-transparent pl-[19.966px] pr-[17.65px]">
              <span className="font-inter text-[13.25px] font-bold uppercase leading-[19.875px] tracking-[0.3313px] text-warm-ink">
                Customer Communication
              </span>
              <span
                className="inline-flex h-[23.293px] shrink-0 items-center rounded-full border-[1.157px] border-brand-blue/20 bg-brand-blue/10 px-[11px] font-dm-sans text-[11.042px] font-semibold leading-[16.563px] text-brand-blue"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                Facebook
              </span>
            </div>

            <div className="h-[110.409px] bg-cream-50" aria-hidden />

            <div className="flex min-h-[40.275px] flex-wrap items-center gap-x-[8.825px] gap-y-2 px-[17.65px] py-[3.58px]">
              <span
                className="shrink-0 font-dm-sans text-[13.25px] font-normal leading-[19.875px] text-warm-gray"
                style={{ fontVariationSettings: "'opsz' 9" }}
              >
                Compose:
              </span>
              <div className="flex flex-wrap items-center gap-[8.825px]">
                {INSTALLER_HOME_CHANNELS.map((ch) =>
                  ch === "AI Compose" ? (
                    <button
                      key={ch}
                      type="button"
                      className="inline-flex h-[27.037px] min-w-[117.227px] shrink-0 items-center justify-center gap-[8px] rounded-[8.833px] px-[13.24px] font-dm-sans text-[12.146px] font-semibold leading-[18.219px] text-white"
                      style={{
                        fontVariationSettings: "'opsz' 14",
                        backgroundImage:
                          "linear-gradient(168.2682496558474deg, rgb(32, 148, 243) 2.3594%, rgb(23, 207, 207) 97.641%)",
                      }}
                    >
                      <IconSparkles className="size-[13.238px] shrink-0 text-white" />
                      {ch}
                    </button>
                  ) : (
                    <button
                      key={ch}
                      type="button"
                      className="inline-flex h-[27.037px] shrink-0 items-center rounded-[8.833px] bg-cream-300 px-[13.25px] font-dm-sans text-[12.146px] font-semibold leading-[18.219px] text-brown-muted"
                      style={{ fontVariationSettings: "'opsz' 14" }}
                    >
                      {ch}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className="px-[16.97px] pt-0 pb-0">
              <label htmlFor="home-compose" className="sr-only">
                Message
              </label>
              <textarea
                id="home-compose"
                rows={3}
                placeholder="Type your message..."
                className="min-h-[83.914px] w-full resize-none rounded-[8.833px] border-[1.157px] border-warm-border bg-white p-[13.25px] font-dm-sans text-[15.458px] leading-[23.188px] text-warm-ink placeholder:text-warm-gray/50 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                style={{ fontVariationSettings: "'opsz' 9" }}
              />
            </div>

            <div className="flex min-h-[49.716px] flex-wrap items-center justify-between gap-3 border-t-[1.157px] border-warm-border px-[17.65px] py-[8px]">
              <div className="flex items-center gap-[4.41px]">
                {(
                  [
                    [IconComposeBold, "Bold"],
                    [IconComposeItalic, "Italic"],
                    [IconComposeLink, "Insert link"],
                    [IconComposeImage, "Insert image"],
                    [IconComposeAttach, "Attach file"],
                    [IconComposeEmoji, "Emoji"],
                  ] as const
                ).map(([Cmp, label]) => (
                  <button
                    key={label}
                    type="button"
                    className="flex size-[24.288px] shrink-0 items-center justify-center rounded-[4.417px] text-warm-gray hover:bg-black/4"
                    aria-label={label}
                  >
                    <Cmp className="size-[15.445px]" />
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-[8.825px]">
                <span
                  className="font-dm-sans text-[12.146px] font-normal leading-[18.219px] text-warm-gray"
                  style={{ fontVariationSettings: "'opsz' 9" }}
                >
                  0 words
                </span>
                <button
                  type="button"
                  className="inline-flex h-[30.907px] min-w-[84.855px] shrink-0 items-center gap-[7px] rounded-[8.833px] pl-[17.65px] pr-[14px] font-dm-sans text-[12.146px] font-semibold leading-[18.219px] text-white"
                  style={{
                    fontVariationSettings: "'opsz' 14",
                    backgroundImage:
                      "linear-gradient(161.84255433686087deg, rgb(32, 148, 243) 2.3594%, rgb(23, 207, 207) 97.641%)",
                  }}
                >
                  <IconComposeSend className="size-[13.238px] shrink-0 text-white" />
                  Send
                </button>
                <button
                  type="button"
                  className="inline-flex h-[30.907px] min-w-[84.565px] shrink-0 items-center gap-[7px] rounded-[8.833px] border-[1.157px] border-warm-border bg-white pl-[13.24px] pr-[14px] font-dm-sans text-[12.146px] font-medium leading-[18.219px] text-warm-ink"
                  style={{ fontVariationSettings: "'opsz' 14" }}
                >
                  <Icon
                    name="Phone"
                    className="size-[13.238px] text-warm-gray"
                  />
                  Phone
                </button>
              </div>
            </div>
          </section>

          {/* Bottom panels */}
          <div className="mt-6 space-y-6 pb-10">
            <InstallerHomeAccentEmptyPanel
              nodeId="3:9097"
              icon={<Icon name="Calendar" />}
              title="Appointment Schedule"
              emptyMessage="No upcoming appointments"
            />
            <InstallerHomeAccentEmptyPanel
              nodeId="3:9114"
              icon={<Icon name="MessageSquare" />}
              title="Notes"
              emptyMessage="No notes added yet"
            />
            <InstallerHomeAccentEmptyPanel
              nodeId="3:9129"
              icon={<IconCheckSquare />}
              title="Tasks"
              emptyMessage="No tasks assigned"
            />

            <InstallerHomeTagsPanel />
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

/** Figma 3:8907 — icon + uppercase label + semibold value on gradient strip */
function ProfileDetailField({
  icon,
  label,
  value,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={classNames(
        "flex min-h-[36.44px] items-center gap-[8.825px]",
        className,
      )}
    >
      <span className="mt-0.5 shrink-0 text-warm-black [&_svg]:size-[17.651px]">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-dm-sans text-[11.042px] font-normal uppercase leading-[16.56px] tracking-[0.552px] text-warm-black/60">
          {label}
        </p>
        <p className="font-dm-sans text-[13.25px] font-semibold leading-[19.875px] text-warm-black">
          {value}
        </p>
      </div>
    </div>
  );
}

function ProfileUploadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
    </svg>
  );
}

function IconTagDismiss({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

type InstallerHomeTagVariant =
  | "amberStrong"
  | "golden"
  | "amberSoft"
  | "amberLight"
  | "neutral";

/** Matches Figma 3:9144 chip backgrounds & label ink per tag */
const INSTALLER_HOME_TAG_VARIANT: Record<string, InstallerHomeTagVariant> = {
  "New Lead": "amberStrong",
  Qualified: "golden",
  "Site Visit": "amberSoft",
  "Quote Sent": "amberLight",
  Approved: "neutral",
  "In Progress": "amberStrong",
  Installed: "golden",
  "Follow Up": "amberSoft",
  VIP: "amberLight",
  Referral: "neutral",
};

const INSTALLER_HOME_TAG_VARIANT_CLASS: Record<
  InstallerHomeTagVariant,
  { shell: string; label: string }
> = {
  amberStrong: {
    shell: "bg-[rgba(245,159,10,0.2)] border-[rgba(245,159,10,0.3)]",
    label: "text-warm-black",
  },
  golden: {
    shell: "bg-[rgba(238,166,43,0.2)] border-[rgba(238,166,43,0.3)]",
    label: "text-warm-black",
  },
  amberSoft: {
    shell: "bg-[rgba(240,199,117,0.3)] border-[rgba(240,199,117,0.5)]",
    label: "text-warm-ink",
  },
  amberLight: {
    shell: "bg-[rgba(245,159,10,0.15)] border-[rgba(245,159,10,0.2)]",
    label: "text-warm-ink",
  },
  neutral: {
    shell: "bg-cream-300 border-warm-border",
    label: "text-brown-muted",
  },
};

function InstallerHomeTagPill({ label }: { label: string }) {
  const variant = INSTALLER_HOME_TAG_VARIANT[label] ?? "amberLight";
  const { shell, label: labelTone } = INSTALLER_HOME_TAG_VARIANT_CLASS[variant];

  return (
    <div className="inline-flex h-[30.907px] items-stretch">
      <span
        className={classNames(
          "inline-flex items-center rounded-l-full border-b-[1.157px] border-l-[1.157px] border-t-[1.157px] border-solid py-[1.157px] pl-[14.407px] pr-[13.25px] font-dm-sans text-[12.146px] font-semibold leading-[18.219px]",
          shell,
          labelTone,
        )}
        style={{ fontVariationSettings: "'opsz' 14" }}
      >
        {label}
      </span>
      <button
        type="button"
        className={classNames(
          "inline-flex w-[26.494px] shrink-0 items-center justify-center rounded-r-full border-b-[1.157px] border-r-[1.157px] border-t-[1.157px] border-solid py-[1.157px] hover:opacity-80",
          shell,
          labelTone,
        )}
        aria-label={`Remove ${label}`}
      >
        <IconTagDismiss className="size-[13.238px]" />
      </button>
    </div>
  );
}

/** Figma 3:9144 — Tags card with split pills */
function InstallerHomeTagsPanel() {
  return (
    <section
      className="overflow-hidden rounded-[11.042px] border-[1.157px] border-warm-border bg-cream-50"
      data-node-id="3:9144"
    >
      <div className="flex h-[39.733px] items-center justify-between border-l-[2.315px] border-yellow-lemon bg-linear-to-b from-[rgba(245,159,10,0.15)] to-transparent pl-[17.65px] pr-[17.65px]">
        <div className="flex min-w-0 items-center gap-[8.83px]">
          <span className="shrink-0 text-warm-ink [&_svg]:size-[17.651px]">
            <IconPanelTag />
          </span>
          <h3 className="truncate font-inter text-[13.25px] font-bold uppercase leading-[19.875px] tracking-[0.3313px] text-warm-ink">
            Tags
          </h3>
        </div>
        <button
          type="button"
          className="inline-flex h-[24.288px] min-w-[61.453px] shrink-0 items-center gap-[8px] rounded-[6.625px] bg-linear-to-b from-yellow-lemon to-orange-amber px-[11.03px] font-dm-sans text-[9.938px] font-bold uppercase leading-[14.906px] tracking-[0.3313px] text-warm-black hover:opacity-95"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          <IconPanelPlus className="size-[13.238px] shrink-0" />
          Add
        </button>
      </div>
      <div className="flex min-h-[105.942px] flex-wrap gap-x-[8.825px] gap-y-[8.825px] px-[17.65px] py-[17.65px]">
        {INSTALLER_HOME_TAGS.map((tag) => (
          <InstallerHomeTagPill key={tag} label={tag} />
        ))}
      </div>
    </section>
  );
}

function InstallerHomeAccentEmptyPanel({
  icon,
  title,
  emptyMessage,
  nodeId,
}: {
  icon: React.ReactNode;
  title: string;
  emptyMessage: string;
  nodeId?: string;
}) {
  return (
    <section
      className="overflow-hidden rounded-[11.042px] border-[1.157px] border-warm-border bg-cream-50"
      data-node-id={nodeId}
    >
      <div className="flex h-[39.733px] items-center justify-between border-l-[2.315px] border-yellow-lemon bg-linear-to-b from-[rgba(245,159,10,0.15)] to-transparent pl-[17.65px] pr-[17.65px]">
        <div className="flex min-w-0 items-center gap-[8.83px]">
          <span className="shrink-0 text-warm-ink [&_svg]:size-[17.651px]">
            {icon}
          </span>
          <h3 className="truncate font-inter text-[13.25px] font-bold uppercase leading-[19.875px] tracking-[0.3313px] text-warm-ink">
            {title}
          </h3>
        </div>
        <button
          type="button"
          className="inline-flex h-[24.288px] min-w-[61.453px] shrink-0 items-center gap-[8px] rounded-[6.625px] bg-linear-to-b from-yellow-lemon to-orange-amber px-[11.03px] font-dm-sans text-[9.938px] font-bold uppercase leading-[14.906px] tracking-[0.3313px] text-warm-black hover:opacity-95"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          <IconPanelPlus className="size-[13.238px] shrink-0" />
          Add
        </button>
      </div>
      <div className="flex h-[72.864px] items-center justify-center">
        <p
          className="font-dm-sans text-[13.25px] font-normal leading-[19.875px] text-warm-gray"
          style={{ fontVariationSettings: "'opsz' 9" }}
        >
          {emptyMessage}
        </p>
      </div>
    </section>
  );
}
