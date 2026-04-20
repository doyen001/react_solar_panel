"use client";

import Icon from "@/components/ui/Icons";
import { SECONDARY_KPIS } from "./pipelineDashboardMock";

export function PipelineSecondaryKpiRow() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {SECONDARY_KPIS.map((item) => (
        <div
          key={item.title}
          className="flex items-start gap-3 rounded-lg border border-warm-border bg-white px-4 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-frost">
            <Icon name="Dollar" className="size-4 text-ocean" />
          </span>
          <div className="min-w-0">
            <p className="font-inter text-[13px] font-medium leading-[15px] text-brown-muted">
              {item.title}
            </p>
            <div className="mt-1 flex flex-wrap items-baseline gap-2">
              <span className="font-inter text-[22px] font-bold leading-7 text-warm-ink">
                {item.value}
              </span>
              {item.delta ? (
                <span className="font-inter text-[13px] font-semibold text-success">
                  {item.delta}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
