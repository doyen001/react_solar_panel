"use client";

import Icon from "@/components/ui/Icons";
import type { MasterDashboardKpi } from "@/utils/constant";

type Props = {
  kpi: MasterDashboardKpi;
};

export function MasterKpiCard({ kpi }: Props) {
  const tintWrap =
    kpi.tint === "navy" ? "master-icon-tint-navy" : "master-icon-tint-orange";
  const iconTone =
    kpi.tint === "navy" ? "master-kpi-icon-navy" : "master-kpi-icon-orange";

  return (
    <article
      className="rounded-[10px] border border-warm-border bg-cream-50 px-4 pb-[13.5px] pt-4"
      style={{ borderWidth: "0.636px" }}
    >
      <div className="flex h-[26px] items-center justify-between">
        <span
          className="font-[family-name:var(--font-dm-sans)] text-[11px] leading-[16.5px] text-warm-gray"
          style={{ fontVariationSettings: "'opsz' 9" }}
        >
          {kpi.label}
        </span>
        <div
          className={`flex size-[26px] items-center justify-center rounded-[7px] ${tintWrap}`}
        >
          <Icon
            name={kpi.icon}
            className={`size-4 shrink-0 ${iconTone}`}
          />
        </div>
      </div>
      <p className="mt-2 font-[family-name:var(--font-inter)] text-[22px] font-bold leading-[26px] text-warm-ink">
        {kpi.value}
      </p>
      <div className="mt-1 flex h-[15px] items-center gap-0">
        <Icon name="ArrowUpRight" className="size-3 shrink-0 text-success" />
        <span
          className="font-[family-name:var(--font-dm-sans)] text-[10px] font-semibold leading-[15px] text-success"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          {kpi.delta}
        </span>
      </div>
      <p
        className="master-footnote mt-1 font-[family-name:var(--font-dm-sans)] text-[9px] leading-[13.5px]"
        style={{ fontVariationSettings: "'opsz' 9" }}
      >
        {kpi.footnote}
      </p>
    </article>
  );
}
