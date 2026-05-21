import { HeroFeatureBar } from "@/components/modules/HeroFeatureBar";
import { ABOUT_US_PAGE } from "@/utils/constant";

export function AboutUsHeroFeatureBar() {
  return <HeroFeatureBar features={ABOUT_US_PAGE.hero.features} />;
}
