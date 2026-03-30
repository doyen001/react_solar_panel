import { DesignsHeroBackground } from "./DesignsHeroBackground";
import { DesignsHeroFooter } from "./DesignsHeroFooter";
import { DesignsHeroImagePanel } from "./DesignsHeroImagePanel";
import { DesignsHeroTagline } from "./DesignsHeroTagline";
import { DesignsSavingsPromoCard } from "./DesignsSavingsPromoCard";
import { designHeroTokens } from "./designHeroTokens";

type DesignsHeroSectionProps = {
  onNext?: () => void;
};

/**
 * Figma node 3:4026 — hero with dual cards, tagline, progress strip, Next CTA.
 */
export function DesignsHeroSection({ onNext }: DesignsHeroSectionProps) {
  const t = designHeroTokens;
  return (
    <section className="relative flex min-h-dvh flex-col overflow-hidden">
      <DesignsHeroBackground />

      <div
        className="relative z-10 mx-auto flex w-full max-w-[1446px] flex-1 flex-col px-4 pt-24 sm:px-8 sm:pt-28 lg:px-[81px] lg:pt-[155px]"
        style={{ gap: t.gapRowToTagline }}
      >
        <div
          className="flex w-full max-w-[1283px] flex-col items-stretch lg:flex-row"
          style={{ gap: t.gapCards }}
        >
          <DesignsSavingsPromoCard className="lg:w-[629px]" />
          <DesignsHeroImagePanel className="lg:w-[634px]" />
        </div>
        <DesignsHeroTagline />
      </div>

      <DesignsHeroFooter onNext={onNext} />
    </section>
  );
}
