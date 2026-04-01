type DesignsHeroProgressBarProps = {
  /** Default ~30% (Figma Screen 13). */
  fillPercent?: number;
};

/**
 * Light gray track (gray-5) with yellow→orange gradient fill.
 */
export function DesignsHeroProgressBar({
  fillPercent = 0,
}: DesignsHeroProgressBarProps) {
  return (
    <div
      className="h-3 w-full max-w-[1278px] overflow-hidden rounded-4xl bg-gray-5 sm:h-[12px]"
      aria-hidden
    >
      <div
        className="h-full rounded-none transition-[width] duration-700 ease-in-out motion-reduce:transition-none"
        style={{
          width: `${Math.min(100, Math.max(0, fillPercent))}%`,
          background:
            "linear-gradient(to right, var(--color-progress-fill-start), var(--color-progress-fill-mid), var(--color-orange-amber))",
        }}
      />
    </div>
  );
}
