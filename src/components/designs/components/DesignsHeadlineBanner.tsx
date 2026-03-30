const HEADLINE = "Let's Design your Solar and battery system";

/**
 * Figma 3:4084 — gradient pill, 3px cyan border, white title (40px / 50px line-height).
 */
export function DesignsHeadlineBanner() {
  return (
    <div
      className="mx-auto flex w-full max-w-[1278px] min-h-[173px] items-center justify-center overflow-hidden rounded-[46px] border-[3px] border-design-accent-cyan bg-linear-to-r from-auth-card-from to-auth-card-to px-5 shadow-[0px_0px_40px_0px_rgba(140,140,140,0.3)]"
    >
      <p
        className="w-full max-w-[498px] text-center font-source-sans text-[clamp(26px,5vw,40px)] font-bold capitalize leading-tight text-white sm:text-[40px] sm:leading-[50px]"
        style={{ letterSpacing: "0.248px" }}
      >
        {HEADLINE}
      </p>
    </div>
  );
}
