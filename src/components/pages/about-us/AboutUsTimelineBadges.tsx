import Icon from "@/components/ui/Icons";

type Badge = {
  label: string;
  suffix?: string;
  emphasis?: boolean;
  showStar?: boolean;
};

type Props = {
  badges: readonly Badge[];
};

export function AboutUsTimelineBadges({ badges }: Props) {
  return (
    <div className="flex flex-col gap-[23px]">
      <div className="h-px w-full bg-about-timeline-badge-border" />
      <div className="flex flex-wrap gap-[17px]">
        {badges.map((badge) => (
          <div
            key={`${badge.label}-${badge.suffix ?? ""}`}
            className="flex min-h-[52px] flex-1 items-center justify-center border-2 border-about-timeline-badge-border px-4 py-3"
          >
            <p className="text-center font-source-sans text-xl tracking-[-0.1504px] text-about-timeline-text">
              {badge.showStar ? (
                <span className="inline-flex items-center gap-[5px] font-bold">
                  {badge.label}
                  <Icon
                    name="AboutUsStar"
                    className="size-6 text-gold"
                    aria-hidden
                  />
                  {badge.suffix ? (
                    <span className="font-medium"> {badge.suffix}</span>
                  ) : null}
                </span>
              ) : (
                <>
                  <span className={badge.emphasis ? "font-bold" : "font-medium"}>
                    {badge.label}
                    {badge.suffix ? "  - " : ""}
                  </span>
                  {badge.suffix ? (
                    <span className="font-medium">{badge.suffix}</span>
                  ) : null}
                </>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
