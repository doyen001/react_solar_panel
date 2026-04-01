"use client";

import Image from "next/image";
import { dashboardAssets } from "./assets";
import type { DesignOption } from "./types";

type Props = {
  option: DesignOption;
  selected: boolean;
  onSelect: () => void;
};

export function DesignOptionCard({ option, selected, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group w-full overflow-hidden rounded-[10px] text-left transition-[box-shadow,border-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-amber focus-visible:ring-offset-2 ${
        selected
          ? "border-[3px] border-orange-amber"
          : "border border-warm-border hover:border-stone-warm"
      }`}
    >
      <div className="relative bg-cream-100">
        <div className="relative aspect-[436/80] w-full opacity-80">
          <Image
            src={option.imageSrc}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized
          />
        </div>
        {selected ? (
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-linear-to-b from-yellow-lemon to-orange-amber px-2 py-0.5 pl-2">
            <Image
              src={dashboardAssets.checkCircle}
              alt=""
              width={12}
              height={12}
              className="size-3"
              unoptimized
            />
            <span
              className="font-dm-sans text-[8px] font-bold uppercase leading-3 tracking-[0.3px] text-warm-black"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              Selected
            </span>
          </div>
        ) : null}
      </div>

      <div className="bg-gradient-to-r from-yellow-lemon to-orange-amber px-3 pb-3 pt-3">
        <div className="flex items-start justify-between gap-2">
          <p
            className="font-dm-sans text-xs font-semibold leading-[18px] text-warm-ink"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            {option.title}
          </p>
          {option.badge === "approved" ? (
            <span className="shrink-0 rounded-full bg-mint-soft px-2 py-0.5 font-dm-sans text-[7px] font-bold uppercase leading-[10.5px] tracking-[0.3px] text-success">
              Approved
            </span>
          ) : (
            <span className="shrink-0 rounded-full bg-cream-150 px-2 py-0.5 font-dm-sans text-[7px] font-bold uppercase leading-[10.5px] tracking-[0.3px] text-warm-gray">
              Draft
            </span>
          )}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-dm-sans text-[10px] font-normal leading-[15px] text-warm-gray">
          <span style={{ fontVariationSettings: "'opsz' 9" }}>{option.kw}</span>
          <span>·</span>
          <span style={{ fontVariationSettings: "'opsz' 9" }}>
            {option.panels}
          </span>
          <span>·</span>
          <span
            className="font-semibold text-warm-ink"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            {option.price}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[9px] leading-[13.5px] text-warm-gray">
          <span style={{ fontVariationSettings: "'opsz' 9" }}>
            Savings:{" "}
            <span
              className="font-bold text-success"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              {option.savingsPerYr}
            </span>
          </span>
          <span>·</span>
          <span style={{ fontVariationSettings: "'opsz' 9" }}>
            Output: {option.outputKwh}
          </span>
        </div>
      </div>
    </button>
  );
}
