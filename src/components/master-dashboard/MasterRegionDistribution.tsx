"use client";

import dynamic from "next/dynamic";
import { MASTER_REGION_SLICES } from "@/utils/constant";

const MasterRegionDonutChartClient = dynamic(
  () =>
    import("@/components/master-dashboard/charts/MasterRegionDonutChartClient").then(
      (m) => m.MasterRegionDonutChartClient,
    ),
  { ssr: false, loading: () => <div className="size-[140px] shrink-0" /> },
);

export function MasterRegionDistribution() {
  return (
    <div className="flex flex-col items-stretch gap-6 sm:flex-row sm:items-center">
      <MasterRegionDonutChartClient slices={MASTER_REGION_SLICES} />
      <ul className="flex flex-col gap-2 sm:flex-1">
        {MASTER_REGION_SLICES.map((row) => (
          <li key={row.id} className="flex items-center gap-2">
            <span
              className={`size-2 shrink-0 rounded-full ${row.swatchClass}`}
              aria-hidden
            />
            <span
              className="min-w-0 flex-1 font-[family-name:var(--font-dm-sans)] text-[11px] font-normal leading-[16.5px] text-warm-ink"
              style={{ fontVariationSettings: "'opsz' 9" }}
            >
              {row.label}
            </span>
            <span
              className="shrink-0 font-[family-name:var(--font-dm-sans)] text-[11px] font-bold leading-[16.5px] text-warm-ink"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              {row.percent}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
