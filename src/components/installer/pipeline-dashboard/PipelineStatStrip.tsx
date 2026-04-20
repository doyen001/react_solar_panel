"use client";

import { STAT_STRIP } from "./pipelineDashboardMock";

/**
 * Figma node `3:10389`: single rounded bar, cream fill, warm dividers,
 * DM Sans 9px / 12px — not separate floating cards.
 */
export function PipelineStatStrip() {
  return (
    <div className="overflow-x-auto rounded-[10px] border border-warm-border bg-cream-50 [-webkit-overflow-scrolling:touch]">
      <div className="flex min-w-[min(100%,720px)] divide-x divide-warm-border lg:min-w-0">
        {STAT_STRIP.map((s) => (
          <div
            key={s.label}
            className="flex min-h-[46px] min-w-0 flex-1 flex-col items-center justify-center px-2 py-[7px] text-center sm:px-3"
          >
            <span className="font-dm-sans text-[9px] font-semibold uppercase leading-[13.5px] tracking-[0.45px] text-warm-gray whitespace-nowrap">
              {s.label}
            </span>
            <span className="font-dm-sans text-[12px] font-bold leading-[18px] text-warm-ink whitespace-nowrap">
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
