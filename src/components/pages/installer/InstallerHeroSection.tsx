"use client";

import { FeatureBarOfHero } from "@/components/modules/FeatureBarOfHero";
import { VideoSlider } from "@/components/ui/VideoSlider";
import type { VideoSliderSlide } from "@/components/ui/VideoSlider";

/** Figma 3:1835 — installer hero: full-bleed carousel, side nav, dots, bottom feature pills; no headline block (unlike home `HeroSection`). */
const slides: VideoSliderSlide[] = [
  { type: "video", src: "/videos/installerLanding.mp4" },
  {
    type: "image",
    src: "/images/home/hero-slide-2.png",
    alt: "Solar installation",
  },
  {
    type: "image",
    src: "/images/home/hero-slide-3.png",
    alt: "Solar installation",
  },
];

export function InstallerHeroSection() {
  return (
    <section
      className="relative min-h-[760px] w-full overflow-hidden sm:h-[717px] sm:min-h-0"
      data-node-id="3:1835"
    >
      <VideoSlider slides={slides} overlayClassName="pt-0 sm:pt-0">
        <FeatureBarOfHero />
      </VideoSlider>
    </section>
  );
}
