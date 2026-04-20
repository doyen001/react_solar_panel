"use client";

import {
  LEAD_SOURCE_SUMMARY,
  LEAD_MIX_PCTS,
  LEAD_SOURCES,
  REGIONAL_ROWS,
} from "./pipelineDashboardMock";

const MIX_COLORS = ["#09234a", "#304566", "#f78d00", "#ffbf47", "#dfd5c3"];

export function PipelineRegionalAndLead() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <section className="overflow-hidden rounded-[10px] border border-warm-border bg-cream-50 shadow-sm">
        <div className="flex min-h-[42px] items-center justify-between gap-4 border-l-2 border-yellow-lemon bg-linear-to-b from-amber-hot/15 to-transparent pl-[18px] pr-4">
          <h3 className="font-inter text-[12px] font-bold uppercase leading-[18px] tracking-[0.3px] text-warm-ink">
            Regional Breakdown
          </h3>
          <div className="flex items-center gap-4 pr-1">
            <span className="w-[50px] text-center font-dm-sans text-[10px] font-normal uppercase leading-[15px] tracking-[0.3px] text-warm-gray">
              Installs
            </span>
            <span className="w-[50px] text-center font-dm-sans text-[10px] font-normal uppercase leading-[15px] tracking-[0.3px] text-warm-gray">
              Avg Size
            </span>
            <span className="w-[45px] text-center font-dm-sans text-[10px] font-normal uppercase leading-[15px] tracking-[0.3px] text-warm-gray">
              Trend
            </span>
            <span className="w-[70px] text-right font-dm-sans text-[10px] font-normal uppercase leading-[15px] tracking-[0.3px] text-warm-gray">
              Revenue
            </span>
          </div>
        </div>
        <div>
          {REGIONAL_ROWS.map((r, i) => (
            <div
              key={r.region}
              className={`flex h-12 items-center gap-3 px-4 md:px-4 ${
                i !== REGIONAL_ROWS.length - 1 ? "border-b border-warm-border" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-dm-sans text-[13px] font-medium leading-[19.5px] text-warm-ink">
                  {r.region}
                </p>
                <div className="mt-1 h-[3px] w-full overflow-hidden rounded-full bg-warm-border">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-navy-800 to-orange-amber"
                    style={{ width: `${r.meterPct}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pr-1">
                <span className="w-[50px] text-center font-dm-sans text-[12px] font-semibold leading-[18px] text-warm-ink">
                  {r.installs}
                </span>
                <span className="w-[50px] text-center font-dm-sans text-[12px] font-normal leading-[18px] text-warm-gray">
                  {r.avgSize}
                </span>
                <span
                  className={`w-[45px] text-center font-dm-sans text-[11px] font-semibold leading-[16.5px] ${
                    r.trend.startsWith("-") ? "text-red-600" : "text-success"
                  }`}
                >
                  {r.trend}
                </span>
                <span className="w-[70px] text-right font-dm-sans text-[12px] font-bold leading-[18px] text-warm-ink">
                  {r.revenue}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-[10px] border border-warm-border bg-cream-50 shadow-sm">
        <div className="flex min-h-[42px] items-center justify-between gap-4 border-l-2 border-yellow-lemon bg-linear-to-b from-amber-hot/15 to-transparent pl-[18px] pr-4">
          <h3 className="font-inter text-[12px] font-bold uppercase leading-[18px] tracking-[0.3px] text-warm-ink">
            Lead Source Performance
          </h3>
          <span className="font-dm-sans text-[13px] font-bold leading-[19.5px] text-warm-ink">
            {LEAD_SOURCE_SUMMARY.totalLeads}
          </span>
        </div>
        <div className="space-y-4 px-4 pb-4 pt-4 md:px-4 md:pb-5 md:pt-4">
          <div className="flex h-[10px] overflow-hidden rounded-full">
            {LEAD_MIX_PCTS.map((pct, i) => (
              <div
                key={i}
                style={{
                  width: `${pct}%`,
                  backgroundColor: MIX_COLORS[i % MIX_COLORS.length],
                }}
                title={`${pct}%`}
              />
            ))}
          </div>
          <div className="space-y-2.5">
            {LEAD_SOURCES.map((s) => (
              <div key={s.source} className="flex items-center gap-3">
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                <span className="w-[90px] shrink-0 font-dm-sans text-[12px] font-medium leading-[18px] text-warm-ink">
                  {s.source}
                </span>
                <div className="h-1 w-full min-w-0 overflow-hidden rounded-full bg-warm-border">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${s.meterPct}%`,
                      backgroundColor: s.color,
                    }}
                  />
                </div>
                <span className="w-[30px] shrink-0 text-center font-dm-sans text-[11px] font-semibold leading-[16.5px] text-warm-ink">
                  {s.leads}
                </span>
                <span
                  className={`w-[35px] shrink-0 text-center font-dm-sans text-[10px] font-semibold leading-[15px] ${
                    s.convTone === "success" ? "text-success" : "text-warm-gray"
                  }`}
                >
                  {s.conv}
                </span>
                <span className="w-[55px] shrink-0 text-right font-dm-sans text-[11px] font-bold leading-[16.5px] text-warm-ink">
                  {s.revenue}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
