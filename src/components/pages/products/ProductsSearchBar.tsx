"use client";

import Icon from "@/components/ui/Icons";

export const PRODUCTS_PAGE_SIZE_OPTIONS = [12, 24, 48] as const;

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
};

export function ProductsSearchBar({
  search,
  onSearchChange,
  pageSize,
  onPageSizeChange,
}: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-[320px]">
        <Icon
          name="Search"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-warm-gray"
        />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or brand…"
          aria-label="Search products"
          className="w-full rounded-lg border border-warm-border bg-white py-2 pl-9 pr-3 font-dm-sans text-sm text-warm-ink outline-none focus:border-brand-blue"
        />
      </div>

      <label className="flex shrink-0 items-center gap-2 font-dm-sans text-[13px] text-warm-gray">
        Rows per page
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="rounded-lg border border-warm-border bg-white px-2 py-1.5 font-dm-sans text-sm text-warm-ink outline-none focus:border-brand-blue"
        >
          {PRODUCTS_PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
