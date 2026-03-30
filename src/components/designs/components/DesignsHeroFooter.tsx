import { DesignsHeroProgressBar } from "./DesignsHeroProgressBar";
import { IconArrowIn } from "../../ui/Icons";

type DesignsHeroFooterProps = {
  className?: string;
  onNext?: () => void;
  /** Screen 13 (3:4064) omits the Next button. */
  showNext?: boolean;
  fillPercent?: number;
};

/**
 * Progress bar (1278px max) aligned with 81px inset; optional Next CTA.
 */
export function DesignsHeroFooter({
  className,
  onNext,
  fillPercent = 10,
  showNext = false,
}: DesignsHeroFooterProps) {
  return (
    <div
      className={`relative z-10 mt-auto w-full pb-8 pt-10 ${className ?? ""}`}
    >
      <div className="mx-auto w-full max-w-[1446px] px-4 sm:px-8 lg:px-[81px]">
        <DesignsHeroProgressBar fillPercent={fillPercent} />
        {showNext && (
          <div className="mt-7 flex justify-end">
            <button
              type="button"
              onClick={onNext}
              className="inline-flex min-h-12 min-w-[157px] items-center justify-center gap-[14px] rounded-xl bg-design-next font-source-sans text-[18px] font-semibold uppercase leading-6 text-black shadow-[0px_0px_40px_0px_rgba(140,140,140,0.3)] transition hover:brightness-95"
            >
              Next
              <IconArrowIn className="size-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
