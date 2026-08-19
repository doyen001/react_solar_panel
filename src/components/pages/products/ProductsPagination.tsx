"use client";

import Icon from "@/components/ui/Icons";

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function ProductsPagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Product pagination"
      className="mx-auto flex w-full max-w-[1120px] items-center justify-center gap-2"
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

      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          aria-label={`Page ${pageNumber}`}
          aria-current={pageNumber === page ? "page" : undefined}
          onClick={() => onPageChange(pageNumber)}
          className={
            pageNumber === page
              ? "flex size-9 items-center justify-center rounded-lg bg-warm-ink font-dm-sans text-[13px] font-semibold text-white shadow-sm"
              : "flex size-9 items-center justify-center rounded-lg border border-warm-border bg-white font-dm-sans text-[13px] font-semibold text-warm-ink hover:bg-cream-50"
          }
        >
          {pageNumber}
        </button>
      ))}

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
