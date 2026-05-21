import Icon, { type IconType } from "@/components/ui/Icons";

export type HeroFeatureItem = {
  iconId: IconType;
  title: string;
  subtitle: string;
};

type HeroFeatureBarProps = {
  features: readonly HeroFeatureItem[];
  className?: string;
};

export function HeroFeatureBar({ features, className = "" }: HeroFeatureBarProps) {
  return (
    <div
      className={`flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-[15px] [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {features.map((feature) => (
        <article
          key={feature.title}
          className="flex h-[70px] w-[247px] shrink-0 items-center gap-4 rounded-[11px] border border-about-hero-feature-border bg-about-hero-feature-surface px-[15px] py-3 backdrop-blur-[11px]"
        >
          <div className="about-us-hero-icon-well flex size-[38px] shrink-0 items-center justify-center rounded-lg">
            <Icon
              name={feature.iconId}
              className="size-[19px] text-slate-ink"
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
