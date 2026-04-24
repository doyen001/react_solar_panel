"use client";

import { MASTER_TOP_INSTALLERS } from "@/utils/constant";

export function MasterTopInstallers() {
  return (
    <ul className="-mx-4 flex flex-col">
      {MASTER_TOP_INSTALLERS.map((row, index) => (
        <li
          key={row.rank}
          className={`flex items-center gap-2.5 px-3 py-3.5 ${
            index < MASTER_TOP_INSTALLERS.length - 1
              ? "border-b border-warm-border"
              : ""
          }`}
        >
          <span className="w-3.5 shrink-0 text-center font-[family-name:var(--font-dm-sans)] text-[11px] font-semibold leading-[16.5px] text-warm-gray" style={{ fontVariationSettings: "'opsz' 14" }}>
            {row.rank}
          </span>
          <div
            className={`flex size-[26px] shrink-0 items-center justify-center rounded-full font-[family-name:var(--font-dm-sans)] text-[9px] font-semibold leading-[13.5px] ${row.avatarClass}`}
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            {row.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p
              className="truncate font-[family-name:var(--font-dm-sans)] text-[12px] font-medium leading-[18px] text-warm-ink"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              {row.name}
            </p>
            <div className="mt-0.5 h-[3px] overflow-hidden rounded-full bg-cream-300">
              <div
                className="master-installer-bar h-full rounded-full"
                style={{ width: `${Math.round(row.volumeRatio * 100)}%` }}
              />
            </div>
          </div>
          <div className="shrink-0 text-right">
            <p
              className="font-[family-name:var(--font-dm-sans)] text-[12px] font-bold leading-[18px] text-warm-ink"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              {row.revenue}
            </p>
            <p
              className="font-[family-name:var(--font-dm-sans)] text-[9px] font-normal leading-[13.5px] text-warm-gray"
              style={{ fontVariationSettings: "'opsz' 9" }}
            >
              {row.clientsLabel}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
