"use client";

import { DesignOptionCard } from "./DesignOptionCard";
import type { DesignOption } from "./types";

type Props = {
  options: DesignOption[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function YourDesignsSection({
  options,
  selectedId,
  onSelect,
}: Props) {
  const selectedCount = selectedId ? 1 : 0;

  return (
    <section
      id="your-designs"
      className="overflow-hidden rounded-[10px] border border-[#dfd5c3] bg-[#081f43]"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-l-2 border-[#ffef62] bg-gradient-to-b from-[rgba(245,159,10,0.15)] to-transparent pl-[18px] pr-4 py-2.5">
        <h2 className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase leading-[18px] tracking-[0.3px] text-white">
          Your Designs
        </h2>
        <p
          className="font-[family-name:var(--font-dm-sans)] text-[11px] font-normal leading-[16.5px] text-[#f3f3f3]"
          style={{ fontVariationSettings: "'opsz' 9" }}
        >
          {options.length} options · {selectedCount} selected
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
        {options.map((opt) => (
          <DesignOptionCard
            key={opt.id}
            option={opt}
            selected={opt.id === selectedId}
            onSelect={() => onSelect(opt.id)}
          />
        ))}
      </div>
    </section>
  );
}
