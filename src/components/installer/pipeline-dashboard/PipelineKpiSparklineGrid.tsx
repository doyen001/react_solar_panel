"use client";

import dynamic from "next/dynamic";
import Icon from "@/components/ui/Icons";
import type { PrimaryKpi } from "./pipelineDashboardMock";

const SparklineChartClient = dynamic(
  () =>
    import("./charts/SparklineChartClient").then((m) => m.SparklineChartClient),
  {
    ssr: false,
    loading: () => (
      <div className="h-[52px] w-[72px] shrink-0 animate-pulse rounded bg-cream-200" />
    ),
  },
);

export function PipelineKpiSparklineGrid({ kpis }: { kpis: PrimaryKpi[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {kpis.map((k) => (
        <article
          key={k.title}
          className="rounded-lg border border-warm-border bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-inter text-[13px] font-semibold leading-[18px] text-warm-ink">
                {k.title}
              </p>
              <p className="mt-0.5 font-inter text-[11px] leading-[15px] text-warm-gray">
                {k.subtitle}
              </p>
            </div>
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-cream-150 text-warm-gray">
              <Icon name={k?.icon || "Light"} className="size-4" style={{ color: k.sparkColor }} />
            </span>
          </div>
          <div className="mt-4 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="font-inter text-[26px] font-bold leading-8 tracking-tight text-warm-ink md:text-[30px]">
                {k.value}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-1 font-inter text-[11px] leading-4">
                <span className="inline-flex items-center gap-0.5 font-semibold text-success">
                  <svg className="size-3" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M6 2L10 7H7v3H5V7H2z" />
                  </svg>
                  {k.delta}
                </span>
                <span className="text-warm-gray">{k.deltaLabel}</span>
              </div>
            </div>
            <SparklineChartClient points={k.sparkline} color={k.sparkColor} />
          </div>
        </article>
      ))}
    </div>
  );
}
