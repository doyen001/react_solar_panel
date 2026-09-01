"use client";

import Link from "next/link";

import { AboutUsHeroFeatureBar } from "@/components/pages/about-us/AboutUsHeroFeatureBar";
import { RainbowButton } from "@/components/ui/RainbowButton";
import { VideoSlider } from "@/components/ui/VideoSlider";
import { ABOUT_US_PAGE } from "@/utils/constant";

const heroSlides = ABOUT_US_PAGE.hero.slides.map((slide, index) => ({
  type: "image" as const,
  src: slide.src,
  alt: slide.alt,
  priority: index === 0,
}));

export function AboutUsHeroSection() {
  return (
    <section className="relative h-[806px] w-full overflow-hidden pt-14">
      <VideoSlider
        slides={heroSlides}
        overlayClassName="!items-stretch !justify-between !pt-[120px] !pb-5"
      >
        <div className="flex h-full flex-col justify-between">
          <div className="flex max-w-[574px] flex-col gap-[51px] pb-20">
            <div className="flex flex-col gap-[17px]">
              <div className="flex flex-col gap-6">
                <span className="inline-flex w-fit items-center rounded-full border border-about-hero-badge-border bg-about-hero-badge-bg px-[13px] py-[5px] font-inter text-sm font-medium leading-5 tracking-[-0.1504px] text-about-hero-badge-text">
                  {ABOUT_US_PAGE.hero.badge}
                </span>
                <h1 className="font-source-sans text-[40px] font-bold leading-[1.2] tracking-[-1.5px] text-about-hero-title sm:text-[60px]">
                  {ABOUT_US_PAGE.hero.title}
                </h1>
              </div>
              <p className="font-source-sans text-lg font-normal leading-normal tracking-[-0.4395px] text-about-hero-subtitle">
                {ABOUT_US_PAGE.hero.subtitle}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={ABOUT_US_PAGE.hero.primaryCta.href}
                className="about-us-hero-cta-primary inline-flex h-12 min-w-[186.61px] items-center justify-center rounded-xl px-8 font-source-sans text-base font-semibold leading-6 text-about-hero-cta-primary-text"
              >
                {ABOUT_US_PAGE.hero.primaryCta.label}
              </Link>
              <RainbowButton
                href={ABOUT_US_PAGE.hero.secondaryCta.href}
                shape="rounded"
                variant="outline"
                className="h-12 min-w-[188.56px] bg-about-hero-cta-secondary-bg px-8 font-source-sans text-base font-semibold leading-6 text-about-hero-cta-secondary-text"
              >
                {ABOUT_US_PAGE.hero.secondaryCta.label}
              </RainbowButton>
            </div>
          </div>
          <AboutUsHeroFeatureBar />
        </div>
      </VideoSlider>
      <div className="pointer-events-none absolute inset-0 z-1 bg-linear-to-r from-void/55 via-void/25 to-transparent" />
    </section>
  );
}
