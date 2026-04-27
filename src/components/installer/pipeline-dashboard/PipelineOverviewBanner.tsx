"use client";

import { OVERVIEW_KPIS } from "./pipelineDashboardMock";

export function PipelineOverviewBanner() {
  return (
    <section
      className="rounded-lg p-4 shadow-md md:p-5"
      style={{
        borderRadius: "10px",
        background: "linear-gradient(180deg, #FFEF62 0%, #F78D00 100%)",
      }}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/95 shadow-sm">
            <svg
              className="size-7 text-orange-amber"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div>
            <h2 className="font-inter text-[22px] font-bold leading-7 tracking-tight text-warm-black md:text-[26px]">
              Pipeline Overview
            </h2>
            <p className="mt-1 font-inter text-[13px] leading-[18px] text-warm-black/75">
              Solar CRM Performance Dashboard
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 lg:gap-8 xl:gap-10">
          {OVERVIEW_KPIS.map((k) => (
            <div key={k.label} className="flex items-center gap-3">
              <div>
                <p className="font-inter text-[11px] font-medium uppercase leading-[15px] tracking-wide text-warm-black/65">
                  {k.label}
                </p>
                <p className="font-inter text-[18px] font-bold leading-6 tracking-tight text-warm-black">
                  {k.value}
                </p>
              </div>
            </div>
          ))}
          <label className="relative flex items-center gap-2">
            <span className="sr-only">Date range</span>
            <select className="cursor-pointer appearance-none rounded-full border border-warm-black/15 bg-white/95 py-2 pl-4 pr-10 font-inter text-[13px] font-medium text-warm-ink shadow-sm">
              <option>This Quarter</option>
              <option>This Month</option>
              <option>YTD</option>
            </select>
            <svg
              className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-warm-gray"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </label>
        </div>
      </div>
    </section>
  );
}
