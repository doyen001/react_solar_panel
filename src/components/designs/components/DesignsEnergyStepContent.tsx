"use client";

import { forwardRef, useImperativeHandle, useMemo, useState } from "react";

import { SingleScrollBar } from "@/components/ui/SingleScrolllBar";
import { useAppSelector } from "@/lib/store/hooks";
import {
  type DesignBillPeriod,
  selectDesignProposal,
} from "@/lib/store/designProposalSlice";

const USAGE_WITHOUT_SOLAR = [58, 53, 47, 52, 52, 59, 61, 60, 47, 47, 47, 48];
const USAGE_WITH_SOLAR = [39, 37, 34, 29, 24, 20, 17, 19, 29, 34, 37, 41];
const MONTH_LABELS = [
  "J",
  "F",
  "M",
  "A",
  "M",
  "J",
  "J",
  "A",
  "S",
  "O",
  "N",
  "D",
];

function EnergyMetricPill({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex h-[24px] items-center justify-center rounded-[4px] bg-[linear-gradient(126deg,#2094F3_0%,#17CFCF_100%)] px-3 font-source-sans text-[12px] font-bold leading-4 text-white ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

function EnergyLegendItem({
  colorClass,
  label,
}: {
  colorClass: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-[11px]">
      <span className={`size-[16px] shrink-0 ${colorClass}`} />
      <span className="font-source-sans text-[24px] font-normal leading-none text-white">
        {label}
      </span>
    </div>
  );
}

function EnergyBreakdownChart() {
  return (
    <div className="w-full rounded-[19.219px] border border-[#F3F4F6] bg-white px-[18px] pb-[20px] pt-[24px] shadow-[0px_1.201px_3.604px_0px_rgba(0,0,0,0.1),0px_1.201px_2.402px_0px_rgba(0,0,0,0.1)] sm:px-[28px] sm:pt-[28px]">
      <h3 className="font-source-sans text-[21.621px] font-bold tracking-[-0.5279px] text-[#101828]">
        Electricity usage breakdown
      </h3>

      <div className="mt-[18px]">
        <div className="relative flex h-[182px] items-end gap-[10px] border-b border-dashed border-[#D9D9D9] px-[8px] pb-[6px]">
          {USAGE_WITHOUT_SOLAR.map((withoutSolar, index) => {
            const withSolar = USAGE_WITH_SOLAR[index];

            return (
              <div
                key={MONTH_LABELS[index]}
                className="flex flex-1 flex-col items-center justify-end gap-[10px]"
              >
                <div className="flex h-[122px] w-full max-w-[26px] flex-col justify-end overflow-hidden rounded-t-[4px] bg-[#E3E6EC] sm:max-w-[28px]">
                  <div
                    className="w-full bg-[#FDE047]"
                    style={{
                      height: `${Math.min(withSolar, withoutSolar)}%`,
                    }}
                  />
                </div>
                <span className="font-inter text-[14.412px] font-normal leading-none text-[#666]">
                  {MONTH_LABELS[index]}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-[14px] flex items-center justify-center gap-[22px]">
          <div className="flex items-center gap-[7px]">
            <span className="size-[12px] bg-[#FDE047]" />
            <span className="font-source-sans text-[14.414px] font-normal text-[#F5C026]">
              From solar
            </span>
          </div>
          <div className="flex items-center gap-[7px]">
            <span className="size-[12px] bg-[#E3E6EC]" />
            <span className="font-source-sans text-[14.414px] font-normal text-[#666]">
              From grid
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export type DesignsEnergyStepValue = {
  currentBill: string;
  monthlySavings: string;
  newBill: string;
  yearlySavings: string;
  payback: string;
  billPeriod: DesignBillPeriod;
};

/** Monthly bill slider range ($/mo). Midpoint (50%) = $500 — matches former static default. */
const BILL_MONTHLY_MIN = 100;
const BILL_MONTHLY_MAX = 900;

/** Relative to baseline ($500 → $368 new bill, $132 savings / mo from design defaults). */
const NEW_BILL_RATIO = 368 / 500;

function periodMultiplier(period: DesignBillPeriod): number {
  switch (period) {
    case "month":
      return 1;
    case "quarter":
      return 3;
    case "year":
      return 12;
    default:
      return 3;
  }
}

function parseBillPeriod(raw: unknown): DesignBillPeriod {
  if (raw === "month" || raw === "quarter" || raw === "year") {
    return raw;
  }
  return "quarter";
}

function parseMoneyToNumber(raw: string): number | null {
  const cleaned = raw.replace(/[^0-9.-]/g, "");
  if (!cleaned) return null;
  const n = Number.parseFloat(cleaned);
  return Number.isFinite(n) ? n : null;
}

function formatAud(n: number): string {
  return `$${Math.round(n).toLocaleString("en-AU")}`;
}

function monthlyBillFromSliderPercent(percent: number): number {
  const t = Math.min(100, Math.max(0, percent));
  return Math.round(
    BILL_MONTHLY_MIN +
      (BILL_MONTHLY_MAX - BILL_MONTHLY_MIN) * (t / 100),
  );
}

function sliderPercentFromMonthlyBill(monthly: number): number {
  const clamped = Math.min(
    BILL_MONTHLY_MAX,
    Math.max(BILL_MONTHLY_MIN, monthly),
  );
  return Math.round(
    ((clamped - BILL_MONTHLY_MIN) / (BILL_MONTHLY_MAX - BILL_MONTHLY_MIN)) *
      100,
  );
}

function deriveEnergyValues(
  currentMonthly: number,
  totalSystemPrice: number | null,
  billPeriod: DesignBillPeriod,
): DesignsEnergyStepValue {
  const newMonthly = Math.round(currentMonthly * NEW_BILL_RATIO);
  const monthlySavings = Math.max(0, currentMonthly - newMonthly);
  const yearlyNum = monthlySavings * 12;

  let payback = "7.1 yrs";
  if (totalSystemPrice != null && totalSystemPrice > 0 && yearlyNum > 0) {
    payback = `${(totalSystemPrice / yearlyNum).toFixed(1)} yrs`;
  }

  return {
    currentBill: formatAud(currentMonthly),
    newBill: formatAud(newMonthly),
    monthlySavings: formatAud(monthlySavings),
    yearlySavings: formatAud(yearlyNum),
    payback,
    billPeriod,
  };
}

export type DesignsEnergyStepHandle = {
  getValues: () => DesignsEnergyStepValue;
};

function EnergyBillInput({
  billRatePercent,
  onBillRatePercentChange,
  billPeriod,
  onBillPeriodChange,
  currentMonthlyAmount,
}: {
  billRatePercent: number;
  onBillRatePercentChange: (percent: number) => void;
  billPeriod: DesignBillPeriod;
  onBillPeriodChange: (period: DesignBillPeriod) => void;
  /** Slider basis: normalized monthly AUD (Redux `currentBill` / projections use this). */
  currentMonthlyAmount: number;
}) {
  const displayAmount = Math.round(
    currentMonthlyAmount * periodMultiplier(billPeriod),
  );

  return (
    <div className="w-full">
      <div className="flex items-center gap-[16px]">
        <div className="relative h-[58.063px] flex-1 rounded-[10px] border border-[#E5E7EB] bg-white px-4">
          <input
            type="text"
            value={displayAmount.toLocaleString("en-AU")}
            readOnly
            className="size-full bg-transparent font-source-sans text-[24px] font-bold tracking-[0.0703px] text-[#101828] outline-none"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-source-sans text-[16px] font-medium tracking-[-0.3125px] text-[#111]">
            $
          </span>
        </div>
        <select
          value={billPeriod}
          onChange={(e) =>
            onBillPeriodChange(parseBillPeriod(e.target.value))
          }
          aria-label="Bill amount period"
          className="h-[52.936px] w-[127.984px] shrink-0 cursor-pointer appearance-none rounded-[10px] border border-[#E5E7EB] bg-white pl-3 pr-8 font-source-sans text-[14px] font-semibold tracking-[-0.2px] text-[#101828] outline-none focus-visible:ring-2 focus-visible:ring-design-accent-cyan"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23111828' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 10px center",
          }}
        >
          <option value="month">Month</option>
          <option value="quarter">Quarter</option>
          <option value="year">Year</option>
        </select>
      </div>

      <div className="mt-[24px] flex flex-col items-end gap-[24px]">
        <SingleScrollBar
          value={billRatePercent}
          onChange={onBillRatePercentChange}
          min={0}
          max={100}
          ariaLabel="Energy bill rate"
        />

        <div className="inline-flex h-[30px] items-center gap-[8px] rounded-full border border-white px-[13px] py-px">
          <span className="font-source-sans text-[14px] font-normal tracking-[-0.1504px] text-white">
            0.3697$ per kWh
          </span>
          <span className="text-[12px] text-white">✎</span>
        </div>
      </div>
    </div>
  );
}

export const DesignsEnergyStepContent = forwardRef<
  DesignsEnergyStepHandle,
  object
>(function DesignsEnergyStepContent(_, ref) {
  const proposal = useAppSelector(selectDesignProposal);

  const [billRatePercent, setBillRatePercent] = useState(() => {
    const saved = parseMoneyToNumber(proposal.pricing.currentBill);
    const monthly =
      saved ?? monthlyBillFromSliderPercent(50);
    return sliderPercentFromMonthlyBill(monthly);
  });

  const [billPeriod, setBillPeriod] = useState<DesignBillPeriod>(() =>
    parseBillPeriod(proposal.pricing.billPeriod),
  );

  const currentMonthly = useMemo(
    () => monthlyBillFromSliderPercent(billRatePercent),
    [billRatePercent],
  );

  const energyValues = useMemo(() => {
    const systemPrice = parseMoneyToNumber(
      proposal.pricing.totalSystemPrice,
    );
    return deriveEnergyValues(currentMonthly, systemPrice, billPeriod);
  }, [currentMonthly, proposal.pricing.totalSystemPrice, billPeriod]);

  useImperativeHandle(
    ref,
    () => ({
      getValues: () => energyValues,
    }),
    [energyValues],
  );

  return (
    <div className="flex items-center flex-1">
      <div className="relative z-10 mx-auto flex w-full max-w-[1446px] flex-col px-4 pt-8 sm:px-8 sm:pt-10 lg:px-[81px] lg:pt-[37px]">
        <div className="flex w-full max-w-[1278px] flex-col items-center justify-center gap-6 lg:flex-row lg:items-stretch lg:justify-between lg:gap-[58px]">
          <div className="flex min-h-[525px] w-full max-w-[591px] shrink-0 rounded-[46px] border-[3px] border-design-accent-cyan bg-linear-to-r from-yellow-lemon to-orange-amber px-8 py-12 shadow-[0px_0px_40px_0px_rgba(140,140,140,0.3)] sm:px-10 lg:px-[49px] lg:py-[48px]">
            <div className="mx-auto flex w-full max-w-[448px] flex-col items-center">
              <h2
                className="w-full text-center font-source-sans text-[clamp(32px,4.6vw,40px)] font-bold capitalize leading-[1.2] text-white"
                style={{ letterSpacing: "0.248px" }}
              >
                Tell us about the
                <br />
                Energy Bill you pay
              </h2>

              <div className="mt-[34px] w-full">
                <EnergyBillInput
                  billRatePercent={billRatePercent}
                  onBillRatePercentChange={setBillRatePercent}
                  billPeriod={billPeriod}
                  onBillPeriodChange={setBillPeriod}
                  currentMonthlyAmount={currentMonthly}
                />
              </div>

              <div className="mt-[28px] flex items-center gap-[20px]">
                <span className="font-source-sans text-[12px] font-normal leading-none text-[#101828]">
                  *Analytics calculated using optimal placement
                </span>
                <span className="inline-flex size-[12px] items-center justify-center rounded-full border border-[#111] text-[8px] font-bold text-[#111]">
                  i
                </span>
              </div>

              <div className="mt-[14px] flex items-center gap-[16px]">
                <EnergyMetricPill>
                  {proposal.summary.totalPanels || "—"} Panels
                </EnergyMetricPill>
                <EnergyMetricPill>1 Inverter</EnergyMetricPill>
              </div>
            </div>
          </div>

          <div className="w-full max-w-[649px] shrink-0 rounded-[28px] designs-border-gradient p-[3px] shadow-[0px_0px_40px_0px_rgba(140,140,140,0.3)]">
            <div className="flex min-h-[525px] h-full w-full flex-col rounded-[25px] bg-[linear-gradient(135deg,rgba(48,54,71,0.98)_0%,rgba(33,36,47,0.98)_100%)] px-4 py-5 backdrop-blur-[17.8px] sm:px-[42px] sm:py-[20px]">
              <div className="mt-[44px] flex flex-col gap-[18px]">
                <EnergyLegendItem
                  colorClass="bg-[linear-gradient(126deg,#2094F3_0%,#17CFCF_100%)]"
                  label="Bill without Solar"
                />
                <EnergyLegendItem
                  colorClass="bg-linear-to-r from-yellow-lemon to-orange-amber"
                  label="Bill with Solar and Battery"
                />
              </div>

              <div className="mt-[22px]">
                <EnergyBreakdownChart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
