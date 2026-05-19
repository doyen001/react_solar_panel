import Icon from "@/components/ui/Icons";
import { ABOUT_US_PAGE } from "@/utils/constant";

export function AboutUsHeroFeatureBar() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-2 [&::-webkit-scrollbar]:hidden">
      {ABOUT_US_PAGE.hero.features.map((feature) => (
        <article
          key={feature.title}
          className="flex h-[70px] w-[247px] shrink-0 items-center gap-4 rounded-[11.351px] border border-about-hero-feature-border bg-about-hero-feature-surface px-[15px] py-3 backdrop-blur-[11.351px]"
        >
          <div className="about-us-hero-icon-well flex size-[37.836px] shrink-0 items-center justify-center rounded-[7.567px]">
            <Icon
              name={feature.iconId}
              className="size-[18.918px] text-slate-ink"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate font-source-sans text-sm font-semibold text-about-hero-feature-title">
              {feature.title}
            </p>
            <p className="truncate font-source-sans text-xs text-about-hero-feature-subtitle">
              {feature.subtitle}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
