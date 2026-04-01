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
      className="overflow-hidden rounded-[10px] border border-warm-border bg-navy-900"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-l-2 border-yellow-lemon bg-gradient-to-b from-amber-hot/15 to-transparent pl-[18px] pr-4 py-2.5">
        <h2 className="font-inter text-xs font-bold uppercase leading-[18px] tracking-[0.3px] text-white">
          Your Designs
        </h2>
        <p
          className="font-dm-sans text-[11px] font-normal leading-[16.5px] text-neutral-mist"
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
