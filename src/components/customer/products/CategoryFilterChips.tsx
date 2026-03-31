"use client";

import type { SolarProductCategory } from "./types";

export type FilterValue = "all" | SolarProductCategory;

const OPTIONS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "panel", label: "Panel" },
  { value: "inverter", label: "Inverter" },
  { value: "battery", label: "Battery" },
];

type Props = {
  value: FilterValue;
  onChange: (next: FilterValue) => void;
};

export function CategoryFilterChips({ value, onChange }: Props) {
  return (
    <div
      className="inline-flex flex-wrap gap-1 rounded-lg border border-[#dfd5c3] bg-[#fcfbf8] p-1"
      role="group"
      aria-label="Filter by category"
    >
      {OPTIONS.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-md px-3 py-1.5 font-dm-sans text-[10px] font-semibold uppercase leading-[15px] tracking-[0.3px] transition-colors ${
              active
                ? "bg-gradient-to-b from-[#ffef62] to-[#f78d00] text-[#1c1a17]"
                : "text-[#7c736a] hover:bg-black/[0.04]"
            }`}
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
