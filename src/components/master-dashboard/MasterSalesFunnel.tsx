"use client";

import { MASTER_FUNNEL_STAGES } from "@/utils/constant";

const max = MASTER_FUNNEL_STAGES[0]?.value ?? 1;

export function MasterSalesFunnel() {
  return (
    <div className="flex flex-col gap-1.5">
      {MASTER_FUNNEL_STAGES.map((stage) => (
        <div key={stage.id} className="flex items-center gap-3">
          <div className="w-[72px] shrink-0 text-right">
            <span
              className="font-[family-name:var(--font-dm-sans)] text-[11px] font-normal leading-[16.5px] text-warm-gray"
              style={{ fontVariationSettings: "'opsz' 9" }}
            >
              {stage.label}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div
              className={`flex h-7 max-w-full items-center rounded px-2.5 ${stage.barClass}`}
              style={{
                width: `${Math.max(14, Math.round((stage.value / max) * 100))}%`,
              }}
            >
              <span
                className="font-[family-name:var(--font-dm-sans)] text-[11px] font-semibold leading-[16.5px]"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                {stage.value.toLocaleString("en-AU")}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
