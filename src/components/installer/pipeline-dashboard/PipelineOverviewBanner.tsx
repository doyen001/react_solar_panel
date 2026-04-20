"use client";

import { OVERVIEW_KPIS } from "./pipelineDashboardMock";

function OverviewIcon({
  type,
}: {
  type: (typeof OVERVIEW_KPIS)[number]["icon"];
}) {
  const cls = "size-4 text-warm-ink";
  switch (type) {
    case "deals":
      return (
        <svg
          className={cls}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      );
    case "people":
      return (
        <svg
          className={cls}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      );
    case "target":
      return (
        <svg
          className={cls}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      );
    case "clock":
      return (
        <svg
          className={cls}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    default:
      return null;
  }
}

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
              <span className="flex size-4 shrink-0 items-center justify-center text-warm-black/70">
                <OverviewIcon type={k.icon} />
              </span>
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
