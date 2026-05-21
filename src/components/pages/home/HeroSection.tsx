"use client";

import { HeroFeatureBar } from "@/components/modules/HeroFeatureBar";
import { VideoSlider } from "@/components/ui/VideoSlider";
import { HOME_PAGE } from "@/utils/constant";

import { HomeHeroContent } from "./HomeHeroContent";

const heroSlides = HOME_PAGE.hero.slides.map((slide) => ({ ...slide }));

export function HeroSection() {
  return (
    <section className="relative min-h-[760px] w-full overflow-hidden sm:h-[716px] sm:min-h-0">
      <VideoSlider
        slides={heroSlides}
        overlayClassName="!items-stretch !justify-between !pt-[108px] !pb-6 sm:!pt-[92px]"
        dotsVariant="vertical-right"
        navButtonClassName="border-home-hero-nav-border bg-home-hero-nav-surface backdrop-blur-[15px]"
      >
        <div className="flex h-full flex-col justify-between gap-6">
          <HeroFeatureBar
            features={HOME_PAGE.hero.features}
            className="mx-auto w-full max-w-fit justify-start lg:justify-center"
          />
          <HomeHeroContent />
        </div>
      </VideoSlider>

      <div
        className="home-hero-gradient-overlay pointer-events-none absolute inset-x-0 bottom-0 z-1 h-[min(386px,54%)]"
        aria-hidden
      />
    </section>
  );
}
