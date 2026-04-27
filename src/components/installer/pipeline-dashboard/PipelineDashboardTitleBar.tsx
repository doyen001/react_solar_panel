"use client";

import Icon from "@/components/ui/Icons";
import { TITLE } from "./pipelineDashboardMock";

export function PipelineDashboardTitleBar() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <h1 className="font-inter text-[28px] font-bold leading-9 tracking-tight text-warm-ink md:text-[36px] md:leading-[36px]">
          {TITLE.headline}
        </h1>
        <p className="mt-2 font-inter text-[14px] leading-5 text-warm-gray md:text-[15px] md:leading-5">
          {TITLE.subtitle}
        </p>
      </div>
      <div className="flex flex-wrap gap-2 md:justify-end">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md border border-warm-border bg-white px-4 py-2 font-inter text-[13px] font-semibold leading-[18px] text-warm-ink shadow-sm hover:bg-cream-50"
        >
          <Icon name="Doc" className="size-[14px]" />
          CSV
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md border border-warm-border bg-white px-4 py-2 font-inter text-[13px] font-semibold leading-[18px] text-warm-ink shadow-sm hover:bg-cream-50"
        >
          <Icon name="Download" className="size-[14px]" />
          PDF
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md bg-ocean px-4 py-2 font-inter text-[13px] font-semibold leading-[18px] text-white shadow-sm hover:bg-teal-deep"
        >
          <span className="text-lg leading-none">+</span>
          New Deal
        </button>
      </div>
    </div>
  );
}
