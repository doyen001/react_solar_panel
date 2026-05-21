"use client";

import Image from "next/image";

import Icon from "@/components/ui/Icons";
import { FAQS_PAGE } from "@/utils/constant";

type FaqsHeroSectionProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
};

export function FaqsHeroSection({
  searchQuery,
  onSearchChange,
}: FaqsHeroSectionProps) {
  const { hero } = FAQS_PAGE;

  return (
    <section className="relative h-[480px] w-full overflow-hidden sm:h-[560px] lg:h-[605px]">
      <Image
        src={hero.heroImageSrc}
        alt={hero.heroImageAlt}
        fill
        priority
        className="object-cover"
      />
      <div className="faqs-hero-overlay absolute inset-0" aria-hidden />

      <div className="relative z-1 mx-auto flex h-full max-w-[751px] flex-col items-center justify-center gap-[23px] px-4 pt-24 sm:px-6 lg:pt-28">
        <div className="flex w-full flex-col items-center gap-4 text-center">
          <span className="inline-flex h-[26px] items-center rounded-full border border-faqs-hero-badge-border bg-faqs-hero-badge-bg px-3 font-source-sans text-xs font-bold uppercase tracking-[0.6px] text-faqs-hero-badge-text">
            {hero.badge}
          </span>
          <div className="flex w-full flex-col gap-4">
            <h1 className="font-source-sans text-[40px] font-bold leading-[1.3] text-faqs-hero-title sm:text-[52px] lg:text-[60px]">
              {hero.title}
            </h1>
            <p className="font-inter text-base font-normal leading-normal tracking-[-0.4395px] text-faqs-hero-subtitle sm:text-lg">
              {hero.subtitle}
            </p>
          </div>
        </div>

        <label className="relative block h-[58px] w-full">
          <span className="sr-only">Search FAQs</span>
          <Icon
            name="Search"
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-faqs-search-placeholder"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={hero.searchPlaceholder}
            className="h-full w-full rounded-2xl border border-faqs-search-border bg-faqs-search-bg py-4 pl-12 pr-6 font-inter text-base tracking-[-0.3125px] text-gray-1 shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] placeholder:text-faqs-search-placeholder focus:border-brand-cyan focus:outline-none"
          />
        </label>
      </div>
    </section>
  );
}
