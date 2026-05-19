import { AboutUsHeroSection } from "@/components/pages/about-us/AboutUsHeroSection";
import { AboutUsMissionSection } from "@/components/pages/about-us/AboutUsMissionSection";
import { AboutUsPortfolioSection } from "@/components/pages/about-us/AboutUsPortfolioSection";
import { AboutUsProcessSection } from "@/components/pages/about-us/AboutUsProcessSection";
import { AboutUsTimelineSection } from "@/components/pages/about-us/AboutUsTimelineSection";
import { AboutUsValuesSection } from "@/components/pages/about-us/AboutUsValuesSection";

export function AboutUsPageSection() {
  return (
    <>
      <AboutUsHeroSection />
      <AboutUsMissionSection />
      <AboutUsTimelineSection />
      <AboutUsProcessSection />
      <AboutUsValuesSection />
      <AboutUsPortfolioSection />
    </>
  );
}
