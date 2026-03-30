import Image from "next/image";
import { DesignsHeroProgressBar } from "./DesignsHeroProgressBar";
import { designHeroTokens } from "./designHeroTokens";

type DesignsHeroFooterProps = {
  className?: string;
  onNext?: () => void;
};

/**
 * Figma 3:4026 footer: progress bar (1278px max) then 28px gap, Next at left calc(80% + 50px).
 */
export function DesignsHeroFooter({ className, onNext }: DesignsHeroFooterProps) {
  const t = designHeroTokens;
  return (
    <div className={`relative z-10 mt-auto w-full pb-8 pt-10 ${className ?? ""}`}>
      {/* Line aligns with 81px content inset */}
      <div className="mx-auto w-full max-w-[1446px] px-4 sm:px-8 lg:px-[81px]">
        <DesignsHeroProgressBar />
      </div>

      {/* Full-width positioning context so 80% matches Figma screen */}
      <div
        className="relative h-12 w-full"
        style={{ marginTop: t.footerLineToButton }}
      >
        <button
          type="button"
          onClick={onNext}
          className="absolute top-0 inline-flex h-12 items-center justify-center gap-[14px] rounded-xl font-source-sans text-[18px] font-semibold uppercase leading-6 text-black shadow-[0px_0px_40px_0px_rgba(140,140,140,0.3)] transition hover:brightness-95 max-sm:left-1/2 max-sm:-translate-x-1/2 sm:left-[calc(80%+50px)]"
          style={{
            backgroundColor: t.nextYellow,
            minWidth: t.next.width,
            minHeight: t.next.height,
            gap: t.next.gapIcon,
          }}
        >
          Next
          <span className="relative size-6 shrink-0">
            <Image
              src="/images/designs/design-hero-next-arrow.svg"
              alt=""
              width={24}
              height={24}
              className="size-6"
            />
          </span>
        </button>
      </div>
    </div>
  );
}
