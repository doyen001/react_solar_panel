"use client";

import dynamic from "next/dynamic";
import { SalesFunnelBars } from "./charts/SalesFunnelBars";
import {
  FUNNEL_STAGES,
  SALES_FUNNEL_HEADER,
  STC_PIPELINE,
} from "./pipelineDashboardMock";

const StcColumnChartClient = dynamic(
  () =>
    import("./charts/StcColumnChartClient").then((m) => m.StcColumnChartClient),
  {
    ssr: false,
    loading: () => (
      <div className="h-[220px] w-full animate-pulse rounded-md bg-cream-200" />
    ),
  },
);

const ROW_GAP = "gap-[6px]";
const ROW_H = "h-[30px]";

export function PipelineStcAndFunnel() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <section className="overflow-hidden rounded-[10px] border border-warm-border bg-cream-50 shadow-sm">
        <div className="flex min-h-[42px] items-center justify-between gap-4 border-l-2 border-yellow-lemon bg-linear-to-b from-amber-hot/15 to-transparent pl-[18px] pr-4">
          <h3 className="font-inter text-[12px] font-bold uppercase leading-[18px] tracking-[0.3px] text-warm-ink">
            STC Claim Pipeline
          </h3>
          <div className="flex flex-wrap items-baseline gap-2 text-right">
            <span className="font-dm-sans text-[14px] font-bold leading-[21px] text-warm-ink">
              {STC_PIPELINE.badge}
            </span>
            <span className="font-dm-sans text-[10px] font-normal leading-[15px] text-warm-gray">
              {STC_PIPELINE.sub}
            </span>
          </div>
        </div>
        <div className="space-y-3 p-4">
          <div className="flex flex-wrap items-center gap-2">
            {STC_PIPELINE.columns.map((c) => (
              <div
                key={`pill-${c.label}`}
                className="flex h-[25px] items-center gap-1.5 rounded-full border border-warm-border bg-cream-150 px-[11px]"
              >
                <span
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: c.color }}
                />
                <span className="font-dm-sans text-[10px] font-medium leading-[15px] text-warm-ink">
                  {c.label}
                </span>
                <span className="font-dm-sans text-[10px] font-bold leading-[15px] text-warm-gray">
                  {c.count}
                </span>
              </div>
            ))}
          </div>
          <StcColumnChartClient />
        </div>
      </section>

      <section className="overflow-hidden rounded-[10px] border border-warm-border bg-cream-50 shadow-sm">
        <div className="yellow-gradient-header">
          <h3 className="font-inter text-[12px] font-bold uppercase leading-[18px] tracking-[0.3px] text-warm-ink">
            Sales Funnel
          </h3>
          <div className="flex shrink-0 items-center gap-2">
            <span className="font-dm-sans text-[10px] font-normal leading-[15px] text-warm-gray">
              Lead → Install:
            </span>
            <span className="font-dm-sans text-[12px] font-bold leading-[18px] text-success">
              {SALES_FUNNEL_HEADER.leadToInstallPct}
            </span>
          </div>
        </div>

        <div className="flex gap-3 px-4 pb-4 pt-3 md:gap-4 md:px-5 md:pb-5">
          <div
            className={`flex w-[90px] shrink-0 flex-col justify-center ${ROW_GAP} md:w-[96px]`}
          >
            {FUNNEL_STAGES.map((stage) => (
              <div
                key={stage.label}
                className={`flex ${ROW_H} items-start justify-end pt-[7px]`}
              >
                <span className="font-dm-sans text-[11px] font-normal leading-[13.75px] text-warm-gray">
                  {stage.label}
                </span>
              </div>
            ))}
          </div>

          <div className="min-h-[210px] min-w-0 flex-1">
            <SalesFunnelBars />
          </div>

          <div
            className={`flex w-8 shrink-0 flex-col justify-center md:w-9 ${ROW_GAP}`}
          >
            {FUNNEL_STAGES.map((stage) => (
              <div
                key={`${stage.label}-conv`}
                className={`flex ${ROW_H} items-start justify-start pt-[7px]`}
              >
                {stage.convFromPrev ? (
                  <span className="font-dm-sans text-[10px] font-semibold leading-[15px] text-warm-gray">
                    {stage.convFromPrev}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
