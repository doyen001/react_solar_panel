"use client";

import Icon from "@/components/ui/Icons";

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

/** Page numbers to render, condensed with "…" once there are more than a handful. */
function buildPageWindow(page: number, totalPages: number): (number | "ellipsis")[] {
  const window = 1;
  const pages = new Set<number>([1, totalPages]);
  for (let p = page - window; p <= page + window; p++) {
    if (p >= 1 && p <= totalPages) pages.add(p);
  }
  const sorted = Array.from(pages).sort((a, b) => a - b);

  const result: (number | "ellipsis")[] = [];
  let previous: number | null = null;
  for (const p of sorted) {
    if (previous !== null && p - previous > 1) result.push("ellipsis");
    result.push(p);
    previous = p;
  }
  return result;
}

export function ProductsPagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const items = buildPageWindow(page, totalPages);

  return (
    <nav
      aria-label="Product pagination"
      className="flex w-full flex-wrap items-center justify-center gap-2"
    >
      <button
        type="button"
        aria-label="Previous page"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="flex size-9 items-center justify-center rounded-lg border border-warm-border bg-white text-warm-ink shadow-sm enabled:hover:bg-cream-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Icon name="ChevronLeft" className="size-4" />
      </button>

      {items.map((item, index) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            aria-hidden="true"
            className="flex size-9 items-center justify-center font-dm-sans text-[13px] text-warm-gray"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-label={`Page ${item}`}
            aria-current={item === page ? "page" : undefined}
            onClick={() => onPageChange(item)}
            className={
              item === page
                ? "flex size-9 items-center justify-center rounded-lg bg-warm-ink font-dm-sans text-[13px] font-semibold text-white shadow-sm"
                : "flex size-9 items-center justify-center rounded-lg border border-warm-border bg-white font-dm-sans text-[13px] font-semibold text-warm-ink hover:bg-cream-50"
            }
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        aria-label="Next page"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="flex size-9 items-center justify-center rounded-lg border border-warm-border bg-white text-warm-ink shadow-sm enabled:hover:bg-cream-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Icon name="ChevronRight" className="size-4" />
      </button>
    </nav>
  );
}
