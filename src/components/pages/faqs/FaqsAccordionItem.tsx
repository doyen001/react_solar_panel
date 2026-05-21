"use client";

import Image from "next/image";

import type { FaqItem } from "@/utils/constant";

type FaqsAccordionItemProps = {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
};

export function FaqsAccordionItem({
  item,
  isOpen,
  onToggle,
}: FaqsAccordionItemProps) {
  const isGold = item.variant === "gold";

  return (
    <div className="w-full">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
        className={`relative flex min-h-[115px] w-full items-center overflow-hidden rounded-2xl px-5 py-6 text-left sm:px-[42px] sm:py-9 ${
          isGold ? "faqs-item-gradient-gold" : "faqs-item-gradient-blue"
        }`}
      >
        <span
          className={`max-w-[calc(100%-4.5rem)] pr-4 font-inter text-xl font-medium leading-[1.41] tracking-[-0.4429px] sm:text-[27.8px] sm:leading-[39px] ${
            isGold ? "text-faqs-item-gold-text" : "text-faqs-item-blue-text"
          }`}
        >
          {item.question}
        </span>
        <div
          className="absolute right-4 top-1/2 flex size-18 -translate-y-1/2 items-center justify-center overflow-hidden sm:right-8"
          aria-hidden
        >
          <Image
            src="/images/solarDesignLogo.png"
            alt=""
            fill
            unoptimized
            className="object-contain"
          />
        </div>
      </button>
      {isOpen ? (
        <div className="rounded-b-2xl border border-t-0 border-white/10 bg-slate-ink/80 px-5 py-5 sm:px-[42px] sm:py-6">
          <p className="font-inter text-base leading-[1.75] tracking-[-0.3125px] text-gray-1">
            {item.answer}
          </p>
        </div>
      ) : null}
    </div>
  );
}
