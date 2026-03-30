import { designHeroTokens } from "./designHeroTokens";

/**
 * Figma 3:4032 — light gray track with yellow→orange gradient fill (~72% width).
 */
export function DesignsHeroProgressBar() {
  const t = designHeroTokens;
  return (
    <div
      className="h-3 w-full overflow-hidden rounded-none sm:h-[12px]"
      style={{
        maxWidth: t.progressLine.maxW,
        backgroundColor: t.progressLine.track,
      }}
      aria-hidden
    >
      <div
        className="h-full rounded-none bg-gradient-to-r from-[#fff27e] via-[#f5c026] to-[#f78d00]"
        style={{ width: `${t.progressLine.fillPercent}%` }}
      />
    </div>
  );
}
