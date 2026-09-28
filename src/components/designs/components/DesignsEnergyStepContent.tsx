"use client";

import { forwardRef, useImperativeHandle, useMemo, useState } from "react";

import { SingleScrollBar } from "@/components/ui/SingleScrolllBar";
import { useAppSelector } from "@/lib/store/hooks";
import {
  type DesignBillPeriod,
  selectDesignProposal,
} from "@/lib/store/designProposalSlice";

/** Retail rate the bill is converted to kWh with — also shown under the slider. */
const GRID_RATE_PER_KWH = 0.36975;

/** Sydney AC yield per kW installed, year 1. */
const SOLAR_YIELD_KWH_PER_KW_YEAR = 1400;

/** Fallback panel wattage when the system size can't be read (Standard tier). */
const DEFAULT_PANEL_WATTS = 440;

/**
 * Relative monthly weights, normalized at use. Consumption peaks in the
 * Sydney winter (heating) and again in high summer (cooling); generation is
 * the opposite, peaking Dec-Jan and bottoming out in June.
 */
const CONSUMPTION_SEASONALITY = [
  58, 53, 47, 52, 52, 59, 61, 60, 47, 47, 47, 48,
];
const GENERATION_SEASONALITY = [
  128, 115, 105, 90, 74, 66, 71, 83, 97, 112, 122, 130,
];

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

type UsageMonth = {
  /** kWh the home uses that month. */
  consumption: number;
  /** kWh of that consumption covered by the solar array. */
  fromSolar: number;
  /** Remainder still bought from the grid. */
  fromGrid: number;
};

function spread(total: number, weights: number[]): number[] {
  const sum = weights.reduce((acc, w) => acc + w, 0);
  return weights.map((w) => (total * w) / sum);
}

/**
 * Turns the two things the customer has actually told us — what they pay, and
 * how big a system fits on their roof — into a 12-month usage split.
 *
 * Self-consumption is capped at that month's consumption: surplus generation
 * is exported, not "used", so it must not inflate the solar bar.
 */
function buildUsageBreakdown(
  monthlyBill: number,
  systemKw: number,
): UsageMonth[] {
  const annualConsumption = (monthlyBill * 12) / GRID_RATE_PER_KWH;
  const annualGeneration = systemKw * SOLAR_YIELD_KWH_PER_KW_YEAR;

  const consumptionByMonth = spread(annualConsumption, CONSUMPTION_SEASONALITY);
  const generationByMonth = spread(annualGeneration, GENERATION_SEASONALITY);

  return consumptionByMonth.map((consumption, index) => {
    const fromSolar = Math.min(generationByMonth[index], consumption);
    return {
      consumption,
      fromSolar,
      fromGrid: Math.max(0, consumption - fromSolar),
    };
  });
}

/** "7.2 kW" → 7.2, else panel count × default wattage, else 0. */
function resolveSystemKw(systemSize: string, totalPanels: string): number {
  const sized = systemSize.match(/([\d.]+)\s*kW/i);
  if (sized) {
    const kw = Number.parseFloat(sized[1]);
    if (Number.isFinite(kw) && kw > 0) return kw;
  }

  const panels = Number.parseInt(totalPanels.replace(/\D/g, ""), 10);
  if (Number.isFinite(panels) && panels > 0) {
    return (panels * DEFAULT_PANEL_WATTS) / 1000;
  }
  return 0;
}

function EnergyBreakdownChart({ months }: { months: UsageMonth[] }) {
  // Bars are scaled against the busiest month so their heights compare.
  const peak = Math.max(...months.map((m) => m.consumption), 1);

  return (
    <div className="w-full rounded-[19.219px] border border-[#F3F4F6] bg-white px-[18px] pb-[20px] pt-[24px] shadow-[0px_1.201px_3.604px_0px_rgba(0,0,0,0.1),0px_1.201px_2.402px_0px_rgba(0,0,0,0.1)] sm:px-[28px] sm:pt-[28px]">
      <h3 className="font-source-sans text-[21.621px] font-bold tracking-[-0.5279px] text-[#101828]">
        Electricity usage breakdown
      </h3>

      <div className="mt-[18px]">
        <div className="relative flex h-[140px] items-end gap-[10px] border-b border-dashed border-[#D9D9D9] px-[8px] pb-[6px]">
          {months.map((month, index) => {
            const barHeight = (month.consumption / peak) * 100;
            const solarShare =
              month.consumption > 0
                ? (month.fromSolar / month.consumption) * 100
                : 0;

            return (
              <div
                key={index}
                className="flex flex-1 flex-col items-center justify-end gap-[10px]"
              >
                <div
                  className="flex w-full max-w-[26px] flex-col justify-end overflow-hidden rounded-t-[4px] bg-[#E3E6EC] sm:max-w-[28px]"
                  style={{ height: `${Math.max(barHeight, 2)}%` }}
                  title={`${MONTH_LABELS[index]}: ${Math.round(month.consumption)} kWh — ${Math.round(month.fromSolar)} from solar, ${Math.round(month.fromGrid)} from grid`}
                >
                  <div
                    className="w-full bg-[#FDE047]"
                    style={{ height: `${solarShare}%` }}
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

/**
 * Monthly bill slider range ($/mo). The top end is what the period selector
 * multiplies up to the advertised caps: $10k/month, $30k/quarter, $120k/year.
 * The slider works in dollars (not a 0-100 percent) so a notch is $1 rather
 * than ~$99 across this range.
 */
const BILL_MONTHLY_MIN = 100;
const BILL_MONTHLY_MAX = 10000;

/** Used only when a design has no saved bill yet. */
const BILL_MONTHLY_DEFAULT = 500;

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

function clampMonthlyBill(monthly: number): number {
  return Math.min(BILL_MONTHLY_MAX, Math.max(BILL_MONTHLY_MIN, monthly));
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
  billPeriod,
  onBillPeriodChange,
  currentMonthlyAmount,
  onMonthlyAmountChange,
}: {
  billPeriod: DesignBillPeriod;
  onBillPeriodChange: (period: DesignBillPeriod) => void;
  /** Slider basis: normalized monthly AUD (Redux `currentBill` / projections use this). */
  currentMonthlyAmount: number;
  onMonthlyAmountChange: (monthly: number) => void;
}) {
  const displayAmount = Math.round(
    currentMonthlyAmount * periodMultiplier(billPeriod),
  );
  const [draftAmount, setDraftAmount] = useState<string | null>(null);

  const inputValue =
    draftAmount ?? displayAmount.toLocaleString("en-AU");

  const commitPeriodAmount = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (!digits) {
      onMonthlyAmountChange(BILL_MONTHLY_MIN);
      return;
    }

    const periodAmount = Number.parseInt(digits, 10);
    const monthly = Math.round(periodAmount / periodMultiplier(billPeriod));
    onMonthlyAmountChange(clampMonthlyBill(monthly));
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-[16px]">
        <div className="relative h-[58.063px] flex-1 rounded-[10px] border border-[#E5E7EB] bg-white px-4 pr-10">
          <input
            type="text"
            inputMode="numeric"
            value={inputValue}
            onFocus={() => setDraftAmount(String(displayAmount))}
            onChange={(event) => {
              setDraftAmount(event.target.value.replace(/\D/g, ""));
            }}
            onBlur={() => {
              if (draftAmount !== null) {
                commitPeriodAmount(draftAmount);
              }
              setDraftAmount(null);
            }}
            aria-label="Energy bill amount"
            className="size-full bg-transparent font-source-sans text-[24px] font-bold tracking-[0.0703px] text-[#101828] outline-none"
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-source-sans text-[16px] font-medium tracking-[-0.3125px] text-[#111]">
            $
          </span>
        </div>
        <select
          value={billPeriod}
          onChange={(e) => {
            setDraftAmount(null);
            onBillPeriodChange(parseBillPeriod(e.target.value));
          }}
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

      <div className="mt-[16px] flex flex-col items-end gap-[12px]">
        <SingleScrollBar
          value={currentMonthlyAmount}
          onChange={(monthly) => {
            setDraftAmount(null);
            onMonthlyAmountChange(clampMonthlyBill(monthly));
          }}
          min={BILL_MONTHLY_MIN}
          max={BILL_MONTHLY_MAX}
          ariaLabel="Energy bill rate"
        />

        <div className="inline-flex h-[30px] items-center gap-[8px] rounded-full border border-white px-[13px] py-px">
          <span className="font-source-sans text-[14px] font-normal tracking-[-0.1504px] text-white">
            {GRID_RATE_PER_KWH}$ per kWh
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

  const [currentMonthly, setCurrentMonthly] = useState(() =>
    clampMonthlyBill(
      parseMoneyToNumber(proposal.pricing.currentBill) ?? BILL_MONTHLY_DEFAULT,
    ),
  );

  const [billPeriod, setBillPeriod] = useState<DesignBillPeriod>(() =>
    parseBillPeriod(proposal.pricing.billPeriod),
  );

  const usageMonths = useMemo(
    () =>
      buildUsageBreakdown(
        currentMonthly,
        resolveSystemKw(
          proposal.summary.systemSize,
          proposal.summary.totalPanels,
        ),
      ),
    [currentMonthly, proposal.summary.systemSize, proposal.summary.totalPanels],
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
    <div className="relative z-10 mx-auto flex w-full max-w-[1446px] flex-1 flex-col justify-center px-4 py-6 sm:px-8 sm:py-8 lg:px-[81px] lg:py-8">
      <div className="mx-auto grid w-full max-w-[1278px] grid-cols-1 gap-5 lg:grid-cols-[591fr_649fr] lg:items-stretch lg:gap-[58px]">
        <div className="flex w-full min-w-0 items-center rounded-[46px] border-[3px] border-design-accent-cyan bg-linear-to-r from-yellow-lemon to-orange-amber px-6 py-8 shadow-[0px_0px_40px_0px_rgba(140,140,140,0.3)] sm:px-10 sm:py-10 lg:h-full lg:px-[49px] lg:py-[30px]">
          <div className="mx-auto flex w-full max-w-[448px] flex-col items-center">
            <h2
              className="w-full text-center font-source-sans text-[clamp(28px,4.6vw,40px)] font-bold capitalize leading-[1.2] text-white"
              style={{ letterSpacing: "0.248px" }}
            >
              Tell us about the
              <br />
              Energy Bill you pay
            </h2>

            <div className="mt-6 w-full sm:mt-[12px]">
                <EnergyBillInput
                  billPeriod={billPeriod}
                  onBillPeriodChange={setBillPeriod}
                  currentMonthlyAmount={currentMonthly}
                  onMonthlyAmountChange={setCurrentMonthly}
                />
              </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:mt-[28px] sm:gap-[20px]">
              <span className="font-source-sans text-[11px] font-normal leading-snug text-[#101828] sm:text-[12px] sm:leading-none">
                *Analytics calculated using optimal placement
              </span>
              <span className="inline-flex size-[12px] shrink-0 items-center justify-center rounded-full border border-[#111] text-[8px] font-bold text-[#111]">
                i
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:mt-[14px] sm:gap-[16px]">
                <EnergyMetricPill>
                  {proposal.summary.totalPanels || "—"} Panels
                </EnergyMetricPill>
                <EnergyMetricPill>1 Inverter</EnergyMetricPill>
            </div>
          </div>
        </div>

        <div className="designs-border-gradient w-full min-w-0 rounded-[28px] p-[3px] shadow-[0px_0px_40px_0px_rgba(140,140,140,0.3)] lg:h-full">
          <div className="flex aspect-[649/525] h-full min-h-[320px] w-full flex-col overflow-y-auto rounded-[25px] bg-[linear-gradient(135deg,rgba(48,54,71,0.98)_0%,rgba(33,36,47,0.98)_100%)] px-4 py-5 backdrop-blur-[17.8px] sm:min-h-[360px] sm:px-[42px] sm:py-[20px] lg:aspect-auto lg:min-h-0">
            <div className="mt-6 flex flex-col gap-4 sm:mt-[20px] sm:gap-[12px]">
              <EnergyLegendItem
                colorClass="bg-[linear-gradient(126deg,#2094F3_0%,#17CFCF_100%)]"
                label="Bill without Solar"
              />
              <EnergyLegendItem
                colorClass="bg-linear-to-r from-yellow-lemon to-orange-amber"
                label="Bill with Solar and Battery"
              />
            </div>

            <div className="mt-4 flex-1 sm:mt-[22px]">
              <EnergyBreakdownChart months={usageMonths} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
