"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import type { DesignOption } from "./types";
import Icon from "../../ui/Icons";

type Props = {
  option: DesignOption;
  selected: boolean;
  onSelect: () => void;
  /** Set once the design is approved — the choice can no longer change. */
  disabled?: boolean;
  /** Extra content under the specs, e.g. the custom design's edit link. */
  footer?: ReactNode;
};

export function DesignOptionCard({
  option,
  selected,
  onSelect,
  disabled = false,
  footer,
}: Props) {
  return (
    <div
      className={`group w-full overflow-hidden rounded-[14px] text-left transition-[box-shadow,border-color] ${
        selected
          ? "border-[3px] border-orange-amber"
          : "customer-card-border border hover:border-customer-border-strong"
      }`}
    >
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      className={`block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-amber focus-visible:ring-offset-2 focus-visible:ring-offset-customer-page-bg ${
        disabled ? "cursor-not-allowed opacity-70" : ""
      }`}
    >
      <div className="relative bg-customer-design-image-bg">
        <div className="relative aspect-[436/80] w-full">
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
          <div className="customer-gradient-accent-h absolute right-2 top-2 flex items-center gap-1 rounded-full px-2 py-0.5 pl-2 text-warm-black">
            <Icon name="CheckCircle" className="size-3 text-warm-black" />
            <span className="font-inter text-[9px] font-bold uppercase leading-3 tracking-[0.62px] text-warm-black">
              Selected
            </span>
          </div>
        ) : null}
      </div>

      <div className="customer-gradient-accent-h px-4 pb-3 pt-3">
        <div className="flex items-start justify-between gap-2">
          <p className="font-inter text-sm font-semibold leading-[21px] tracking-[-0.15px] text-warm-ink">
            {option.title}
          </p>
          {option.badge === "approved" ? (
            <span className="shrink-0 rounded-full bg-mint-soft px-2 py-0.5 font-inter text-[8px] font-bold uppercase leading-3 tracking-[0.61px] text-success">
              Approved
            </span>
          ) : (
            <span className="customer-draft-badge shrink-0 rounded-full px-2 py-0.5 font-inter text-[8px] font-bold uppercase leading-3 tracking-[0.61px]">
              Draft
            </span>
          )}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-inter text-[11px] font-normal leading-[16.5px] tracking-[0.06px] text-customer-card-spec-text">
          <span>{option.kw}</span>
          <span className="opacity-50">·</span>
          <span>{option.panels}</span>
          <span className="opacity-50">·</span>
          <span className="font-semibold text-warm-black">{option.price}</span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] leading-[15px] tracking-[0.12px] text-customer-card-spec-text">
          <span>
            Savings:{" "}
            <span className="font-bold text-success">{option.savingsPerYr}</span>
          </span>
          <span className="opacity-50">·</span>
          <span>Output: {option.outputKwh}</span>
        </div>
      </div>
    </button>

      {footer ? (
        <div className="customer-gradient-accent-h border-t border-white/30 px-4 pb-3">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
