"use client";

import classNames from "classnames";
import type { FilterChipDef } from "@/components/pages/products/types";

type Props = {
  filters: FilterChipDef[];
  activeFilterKey: string;
  onSelect: (key: string) => void;
};

export function ProductsFilterChips({ filters, activeFilterKey, onSelect }: Props) {
  return (
    <div className="mx-auto flex w-full max-w-[1120px] flex-wrap gap-2 overflow-x-auto">
      {filters.map((filter) => {
        const active = filter.key === activeFilterKey;
        return (
          <button
            key={filter.key}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(filter.key)}
            className={classNames(
              "shrink-0 rounded-full px-4 py-2 font-dm-sans text-[13px] font-semibold transition-colors",
              active
                ? "bg-warm-ink text-white shadow-sm"
                : "border border-warm-border bg-white text-warm-gray hover:text-warm-ink",
            )}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
