"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  EQUIPMENT_CATEGORY_KEYS,
  selectDesignProposal,
  mergeProposalData,
  type EquipmentCategoryKey,
} from "@/lib/store/designProposalSlice";
import { setUser } from "@/lib/store/customerAuthSlice";
import {
  profileDiff,
  updateCustomerProfile,
} from "@/lib/customers/profile";
import { useRouter, useSearchParams } from "next/navigation";
import {
  proposalToDesignInput,
  saveBuilderDesign,
  saveCustomDesign,
} from "@/lib/customers/custom-design";
import { DesignsProposalDownloadModal } from "./DesignsProposalDownloadModal";
import {
  DEFAULT_BATTERY_CAPACITY_ID,
  DEFAULT_PANEL_TIER_ID,
  BATTERY_CAPACITY_OPTIONS,
  PANEL_TIER_OPTIONS,
  findBatteryCapacity,
  findPanelTier,
} from "@/lib/designs/proposalOptions";
import {
  DEFAULT_FINANCIAL_PROJECTION_ASSUMPTIONS,
  buildFinancialProjectionFromProposal,
} from "@/lib/proposal/financialProjection";

function parseMoneyToNumber(raw: string): number {
  const cleaned = raw.replace(/[^0-9.-]/g, "");
  const n = Number.parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function formatAud(n: number): string {
  return `$${Math.round(n).toLocaleString("en-AU")}`;
}

function ProposalStatCard({
  label,
  value,
  variant,
}: {
  label: string;
  value: string;
  variant: "cyan" | "gold";
}) {
  const bg =
    variant === "cyan"
      ? "bg-[linear-gradient(156.24deg,rgba(32,148,243,0.24)_0%,rgba(23,207,207,0.24)_100%)]"
      : "bg-[linear-gradient(156.24deg,rgba(253,224,71,0.24)_0%,rgba(247,141,0,0.24)_100%)]";

  return (
    <div
      className={`flex min-w-0 flex-1 flex-col rounded-[16.471px] p-1 ${bg}`}
    >
      <p className="text-center font-source-sans text-[12px] font-normal uppercase leading-[21.618px] tracking-[0.7206px] text-white/70">
        {label}
      </p>
      <p className="text-center font-source-sans text-[16px] font-normal text-white">
        {value}
      </p>
    </div>
  );
}

const CATEGORY_DETAIL_LABEL: Record<EquipmentCategoryKey, string> = {
  solarPanel: "Solar Panels",
  inverter: "Inverter",
  battery: "Battery",
  evCharger: "EV Charger",
  heatPump: "Heat Pump",
};

function ProposalDetailRow({
  label,
  value,
  mask,
}: {
  label: string;
  value: string;
  /** Set for rows carrying customer PII (name/address) — hides the value from Clarity session recordings. */
  mask?: boolean;
}) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-1.5 text-[13px] leading-[20px]">
      <span className="shrink-0 font-source-sans font-semibold text-black">
        {label}:
      </span>
      <span
        className="min-w-0 font-inter font-normal text-black/80"
        {...(mask ? { "data-clarity-mask": "true" } : {})}
      >
        {value}
      </span>
    </p>
  );
}

function ProposalSubMetric({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  /** Applied to the value span (e.g. gradient text). */
  valueClassName?: string;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col rounded-[14.412px] bg-white/10 px-[16.465px] pt-[10px]">
      <p className="text-center font-inter text-[12.353px] font-normal leading-[18.529px] text-white/50">
        {label}
      </p>
      <p className="mt-1 text-center font-source-sans text-[20.588px] font-normal leading-[30.882px]">
        <span className={valueClassName ?? "text-white"}>{value}</span>
      </p>
    </div>
  );
}

function PanelTierSelector({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="w-full rounded-[20px] border-[1.5px] border-solid border-white/10 bg-[rgba(255,255,255,0.04)] p-[16px]">
      <p className="font-source-sans text-[13px] font-semibold uppercase tracking-[1px] text-white/70">
        Panel Tier
      </p>
      <div className="mt-3 flex flex-col gap-[10px]">
        {PANEL_TIER_OPTIONS.map((tier) => {
          const selected = tier.id === selectedId;
          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => onSelect(tier.id)}
              className={`flex w-full items-center justify-between gap-3 rounded-[12px] border px-[16px] py-1.5 text-left transition ${
                selected
                  ? "border-design-accent-cyan bg-white/10"
                  : "border-white/10 bg-black/20 hover:bg-white/5"
              }`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                    selected ? "border-design-accent-cyan" : "border-white/30"
                  }`}
                >
                  {selected ? (
                    <span className="h-2 w-2 rounded-full bg-design-accent-cyan" />
                  ) : null}
                </span>
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-source-sans text-[15px] font-semibold text-white">
                      {tier.label}
                    </span>
                    {tier.recommended ? (
                      <span className="rounded-full bg-yellow-lemon px-2 py-[1px] font-source-sans text-[10px] font-bold uppercase tracking-[0.5px] text-black">
                        Recommended
                      </span>
                    ) : null}
                  </span>
                  <span className="block font-inter text-[12px] text-white/50">
                    {tier.wattageLabel} · {tier.brandModel}
                  </span>
                </span>
              </div>
              <span className="shrink-0 font-source-sans text-[14px] font-semibold text-white/80">
                {tier.priceDelta === 0
                  ? "Included"
                  : `+${formatAud(tier.priceDelta)}`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BatterySelector({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const selected = findBatteryCapacity(selectedId);
  return (
    <div className="w-full rounded-[20px] border-[1.5px] border-solid border-design-accent-gold/40 bg-[linear-gradient(156.24deg,rgba(247,141,0,0.18)_0%,rgba(253,224,71,0.1)_100%)] p-[16px]">
      <div className="flex items-center justify-between">
        <p className="font-source-sans text-[13px] font-semibold uppercase tracking-[1px] text-white/70">
          Battery
        </p>
        <p className="font-source-sans text-[13px] font-semibold text-yellow-lemon">
          {selected.label}
        </p>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-[8px]">
        {BATTERY_CAPACITY_OPTIONS.map((battery) => {
          const isSelected = battery.id === selectedId;
          return (
            <button
              key={battery.id}
              type="button"
              onClick={() => onSelect(battery.id)}
              className={`rounded-[10px] px-[10px] py-[10px] text-center font-source-sans text-[13px] font-semibold transition ${
                isSelected
                  ? "bg-white text-black"
                  : "bg-black/30 text-white/80 hover:bg-black/20"
              }`}
            >
              {battery.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export type DesignsProposalStepContentProps = {
  customerName?: string;
};

/**
 * Figma Screen 32 (20:22020) — proposal summary, system details, pricing, CTA.
 */
export function DesignsProposalStepContent({
  customerName = "Charli Abdo",
}: DesignsProposalStepContentProps) {
  const proposal = useAppSelector(selectDesignProposal);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const customerUser = useAppSelector((s) => s.customerAuth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editingDesignId = searchParams.get("designId");

  /**
   * In update mode the button always shows: arriving with a designId means an
   * authenticated fetch already succeeded, and Redux auth can legitimately be
   * empty (it is restored from sessionStorage, which a fresh tab lacks) — gating
   * on it hid the only way to save.
   */
  const showSave = Boolean(editingDesignId) || Boolean(customerUser);

  /**
   * Persists the builder output so it shows on the customer's design page and
   * to their installer. When the customer arrived from their design page
   * (`?designId=`) the edit is written back to that design and we return them
   * there; otherwise it upserts their custom design. Only offered when signed
   * in — the builder is also a public lead-gen flow.
   */
  async function handleSaveToAccount() {
    if (saving) return;
    setSaving(true);
    try {
      // Contact details belong to the account record, not the design — the
      // design page, the installer and comms all read it there. Without this
      // write the customer's edit lives only in wizardData and is overwritten
      // by the account values on the next load.
      if (customerUser) {
        const update = profileDiff(customerUser, {
          name: proposal.customer.name,
          phoneNumber: proposal.customer.phoneNumber,
        });

        if (Object.keys(update).length > 0) {
          const saved = await updateCustomerProfile(update);
          dispatch(setUser({ ...customerUser, ...saved }));
        }
      }

      const input = proposalToDesignInput(proposal);

      if (editingDesignId) {
        await saveBuilderDesign(editingDesignId, input);
        toast.success("Your design changes were saved.");
        router.push("/customers/design");
        return;
      }

      await saveCustomDesign(input);
      toast.success("Design saved to your account.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not save your design",
      );
    } finally {
      setSaving(false);
    }
  }
  const displayCustomerName = proposal.customer.name || customerName;

  const letterFirstName = useMemo(() => {
    const first = displayCustomerName.trim().split(/\s+/)[0];
    return first || "Adam";
  }, [displayCustomerName]);

  const panelTierId = proposal.equipment.panelTierId ?? DEFAULT_PANEL_TIER_ID;
  const batteryCapacityId =
    proposal.equipment.batteryCapacityId ?? DEFAULT_BATTERY_CAPACITY_ID;

  /**
   * The proposal arrives from upstream steps with a `totalSystemPrice` that
   * doesn't know about panel tier / battery add-ons. We capture it once as
   * `equipmentBasePrice` so re-selecting a tier/battery adjusts off a fixed
   * base instead of compounding on the previous total.
   */
  useEffect(() => {
    if (proposal.pricing.equipmentBasePrice !== undefined) return;
    dispatch(
      mergeProposalData({
        pricing: { equipmentBasePrice: proposal.pricing.totalSystemPrice },
        equipment: {
          panelTierId: proposal.equipment.panelTierId ?? DEFAULT_PANEL_TIER_ID,
          batteryCapacityId:
            proposal.equipment.batteryCapacityId ?? DEFAULT_BATTERY_CAPACITY_ID,
        },
      }),
    );
    // Runs once to seed the base price; subsequent selections are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const basePrice = parseMoneyToNumber(
    proposal.pricing.equipmentBasePrice ?? proposal.pricing.totalSystemPrice,
  );
  const tierDelta = findPanelTier(panelTierId).priceDelta;
  const batteryPrice = findBatteryCapacity(batteryCapacityId).price;
  const computedTotalPrice = basePrice + tierDelta + batteryPrice;

  const yearlySavingsNum = parseMoneyToNumber(proposal.pricing.monthlySavings) * 12;
  const computedPayback =
    yearlySavingsNum > 0
      ? `${(computedTotalPrice / yearlySavingsNum).toFixed(1)} yrs`
      : proposal.summary.payback;

  const netSavings25yr = useMemo(() => {
    const { rows } = buildFinancialProjectionFromProposal(
      {
        ...proposal,
        pricing: {
          ...proposal.pricing,
          totalSystemPrice: formatAud(computedTotalPrice),
        },
      },
      { ...DEFAULT_FINANCIAL_PROJECTION_ASSUMPTIONS, projectionYears: 25 },
    );
    return rows.at(-1)?.cumulativeImpacts ?? 0;
  }, [proposal, computedTotalPrice]);

  function handleSelectPanelTier(id: string) {
    dispatch(mergeProposalData({ equipment: { panelTierId: id } }));
  }

  function handleSelectBattery(id: string) {
    dispatch(mergeProposalData({ equipment: { batteryCapacityId: id } }));
  }

  /**
   * Keeps `pricing.totalSystemPrice` / `summary.payback` in sync with the
   * selected tier + battery so downstream reads (PDF, save-to-account) see
   * the adjusted price without re-deriving it themselves.
   */
  useEffect(() => {
    if (proposal.pricing.equipmentBasePrice === undefined) return;
    const nextTotal = formatAud(computedTotalPrice);
    const nextPayback = computedPayback;
    if (
      proposal.pricing.totalSystemPrice === nextTotal &&
      proposal.summary.payback === nextPayback
    ) {
      return;
    }
    dispatch(
      mergeProposalData({
        pricing: { totalSystemPrice: nextTotal },
        summary: { payback: nextPayback },
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [computedTotalPrice, computedPayback, proposal.pricing.equipmentBasePrice]);

  return (
    <div className="flex w-full flex-1 items-start self-start overflow-y-auto">
      <div className="relative z-10 mx-auto flex w-full max-w-[1446px] flex-col px-4 pb-8 pt-4 sm:px-8 lg:px-[81px] lg:pt-[12px]">
        <div className="mx-auto flex w-full flex-col gap-[10px]">
          <div className="flex flex-col gap-[20px]">
            <div className="grid grid-cols-2 gap-[16.465px] lg:grid-cols-4">
              <ProposalStatCard
                label="System Size"
                value={proposal.summary.systemSize}
                variant="cyan"
              />
              <ProposalStatCard
                label="Total Panels"
                value={proposal.summary.totalPanels}
                variant="gold"
              />
              <ProposalStatCard
                label="Yearly Savings"
                value={proposal.summary.yearlySavings}
                variant="cyan"
              />
              <ProposalStatCard
                label="Payback"
                value={proposal.summary.payback}
                variant="gold"
              />
            </div>
          </div>

          <div className="flex flex-col gap-[16px]">
            <div className="flex flex-col items-stretch gap-[16px] lg:flex-row">
              <div className="w-full lg:max-w-[550.735px] lg:shrink-0">
                <PanelTierSelector
                  selectedId={panelTierId}
                  onSelect={handleSelectPanelTier}
                />
              </div>
              <div className="w-full flex-1">
                <BatterySelector
                  selectedId={batteryCapacityId}
                  onSelect={handleSelectBattery}
                />
              </div>
            </div>

            <div className="flex flex-col items-stretch gap-[16px] lg:flex-row">
              <div className="flex w-full flex-col justify-center rounded-[20px] border-[1.5px] border-solid border-design-accent-cyan bg-[linear-gradient(133.09deg,#FFEF62_0%,#F78D00_100%)] px-[20px] py-[16px] lg:w-[33%]">
                <h2 className="font-source-sans text-[15px] font-bold uppercase tracking-[0.8px] text-black">
                  System Details
                </h2>

                <div className="flex flex-col gap-[4px]">
                  <ProposalDetailRow
                    label="Customer"
                    value={displayCustomerName}
                    mask
                  />
                  <ProposalDetailRow
                    label="Address"
                    value={proposal.customer.address}
                    mask
                  />
                  <ProposalDetailRow
                    label="Property"
                    value={proposal.customer.property}
                  />
                  {EQUIPMENT_CATEGORY_KEYS.map((key) => {
                    const items = proposal.equipment.items[key];
                    if (!items || items.length === 0) return null;
                    const value = items
                      .map((item) =>
                        `${item.name}${item.quantity > 1 ? ` ×${item.quantity}` : ""} ${item.ratingLabel}`.trim(),
                      )
                      .join(", ");
                    return (
                      <ProposalDetailRow
                        key={key}
                        label={CATEGORY_DETAIL_LABEL[key]}
                        value={value}
                      />
                    );
                  })}
                  <ProposalDetailRow
                    label="Number of Panels"
                    value={proposal.summary.totalPanels}
                  />
                  <ProposalDetailRow
                    label="Panel Tier"
                    value={findPanelTier(panelTierId).label}
                  />
                  <ProposalDetailRow
                    label="CO2 Offset"
                    value={proposal.equipment.co2Offset}
                  />
                </div>
              </div>

              <div className="w-full rounded-[20px] border-[1.5px] border-solid border-design-accent-cyan bg-[rgba(23,23,23,0.6)] px-[24px] py-2 lg:w-[33%]">
                <p className="text-center font-source-sans text-[13px] font-normal uppercase leading-[20px] tracking-[0.6px] text-white/60">
                  Total System Price
                </p>
                <p className="mt-1 text-center font-source-sans text-[clamp(20px,3.5vw,20px)] font-normal">
                  <span className="bg-[linear-gradient(154.91deg,#FFEF62_0%,#F78D00_100%)] bg-clip-text text-transparent">
                    {formatAud(computedTotalPrice)}
                  </span>
                </p>
                <p className="mt-1 text-center font-source-sans text-[11px] font-normal leading-[16px] text-white/40">
                  *Price includes installation and GST
                </p>
                <div className="mt-2 flex gap-[8px]">
                  <ProposalSubMetric
                    label="Monthly Savings"
                    value={proposal.pricing.monthlySavings}
                  />
                  <ProposalSubMetric
                    label="Current Bill"
                    value={proposal.pricing.currentBill}
                  />
                  <ProposalSubMetric
                    label="New Bill"
                    value={proposal.pricing.newBill}
                    valueClassName="inline-block bg-[linear-gradient(142.91deg,#FFEF62_0%,#F78D00_100%)] bg-clip-text text-transparent"
                  />
                </div>
              </div>

              <div className="flex w-full flex-col justify-center rounded-[20px] border-[1.5px] border-solid border-design-accent-cyan bg-[rgba(255,255,255,0.08)] px-[24px] py-[16px] lg:w-[33%]">
                <p className="text-center font-source-sans text-[13px] font-normal uppercase leading-[20px] tracking-[0.6px] text-white/60">
                  25-Year Net Savings
                </p>
                <p className="mt-1 text-center font-source-sans text-[clamp(24px,3vw,32px)] font-normal leading-[1.2]">
                  <span className="bg-[linear-gradient(154.98deg,#2094F3_0%,#17CFCF_100%)] bg-clip-text text-transparent">
                    {formatAud(netSavings25yr)}
                  </span>
                </p>
              </div>
            </div>

            <div className="mx-auto flex w-full max-w-[478.263px] flex-col gap-[10px]">
              <button
                type="button"
                className="py-2 w-full rounded-[14.412px] bg-[linear-gradient(172.76deg,#2094F3_0%,#17CFCF_100%)] font-source-sans text-[18.529px] font-medium uppercase leading-[27.794px] tracking-[0.9265px] text-white shadow-[0px_0px_30.882px_0px_rgba(32,148,243,0.4)] transition hover:brightness-105"
                onClick={() => setDownloadModalOpen(true)}
              >
                Download your proposal
              </button>

              {/*
                Dark fill on purpose: this button sits on the card's
                yellow-to-orange gradient, where white text on a transparent
                background is effectively invisible.
              */}
              {showSave ? (
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void handleSaveToAccount()}
                  className="w-full rounded-[14.412px] bg-[#12203a] py-2 font-source-sans text-[18.529px] font-semibold uppercase leading-[27.794px] tracking-[0.9265px] text-white shadow-[0px_0px_20px_0px_rgba(0,0,0,0.25)] transition hover:brightness-125 disabled:opacity-60"
                >
                  {saving
                    ? "Saving…"
                    : editingDesignId
                      ? "Save changes"
                      : "Save to my account"}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <DesignsProposalDownloadModal
        open={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        letterFirstName={letterFirstName}
      />
    </div>
  );
}
