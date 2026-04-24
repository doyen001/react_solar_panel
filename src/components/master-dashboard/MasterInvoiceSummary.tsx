"use client";

import Icon from "@/components/ui/Icons";
import { MASTER_INVOICE_ROWS } from "@/utils/constant";

export function MasterInvoiceSummary() {
  return (
    <div className="flex flex-col gap-3">
      {MASTER_INVOICE_ROWS.map((row) => (
        <div
          key={row.id}
          className="rounded-lg border border-warm-border bg-gray-1 p-3"
          style={{ borderWidth: "0.636px" }}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <Icon name={row.icon} className="size-3.5 shrink-0 text-warm-gray" />
              <span
                className="font-[family-name:var(--font-dm-sans)] text-[10px] font-normal uppercase leading-[15px] tracking-[0.3px] text-warm-gray"
                style={{ fontVariationSettings: "'opsz' 9" }}
              >
                {row.label}
              </span>
            </div>
            <span
              className="shrink-0 font-[family-name:var(--font-dm-sans)] text-[10px] font-semibold leading-[15px] text-warm-gray"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              {row.countLabel}
            </span>
          </div>
          <p className="mt-2 font-[family-name:var(--font-inter)] text-[20px] font-bold leading-[30px] text-warm-ink">
            {row.amount}
          </p>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-cream-300">
            <div
              className={`h-full rounded-full ${row.progressClass}`}
              style={{ width: `${Math.round(row.progress * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
