import { HeroFeatureBar } from "@/components/modules/HeroFeatureBar";
import { HOME_PAGE } from "@/utils/constant";

export function FeatureBarOfHero() {
  return (
    <HeroFeatureBar
      features={HOME_PAGE.hero.features}
      className="hidden md:flex"
    />
  );
}
