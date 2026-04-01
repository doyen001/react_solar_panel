/** Right triangle (211×142 in Figma) — bottom-right, yellow/orange fill only. */
const W = 211;
const H = 142;
const GRAD_ID = "easylink-solar-triangle-grad";

/**
 * “EASYLINK SOLAR” triangular badge only — no nested frame math.
 */
export function DesignsHeroBadgeOverlay() {
  return (
    <div className="pointer-events-none absolute bottom-0 right-0 z-2 flex max-h-[45%] max-w-[55%] items-end justify-end">
      <div className="relative aspect-211/142 w-full max-w-[211px]">
        <svg
          className="block h-auto w-full"
          viewBox={`0 0 ${W} ${H}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <linearGradient
              id={GRAD_ID}
              x1="0"
              y1="0"
              x2="100%"
              y2="100%"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="var(--color-yellow-lemon)" />
              <stop offset="1" stopColor="var(--color-orange-amber)" />
            </linearGradient>
          </defs>
          <polygon
            points={`${W},0 ${W},${H} 0,${H}`}
            fill={`url(#${GRAD_ID})`}
          />
        </svg>
        <p className="absolute inset-0 flex items-end justify-center pb-[3%] pl-[18%] pr-0 pt-[28%] text-center font-source-sans text-[clamp(12px,3.2vw,18px)] font-bold uppercase leading-6 tracking-wide text-badge-text">
          EASYLINK SOLAR
        </p>
      </div>
    </div>
  );
}
