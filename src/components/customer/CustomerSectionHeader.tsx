import type { ReactNode } from "react";

type Props = {
  title: string;
  variant?: "dark" | "cream";
  meta?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
};

export function CustomerSectionHeader({
  title,
  variant = "cream",
  meta,
  action,
  icon,
  className = "",
}: Props) {
  const isDark = variant === "dark";

  return (
    <div
      className={`flex min-h-[42px] shrink-0 items-center justify-between gap-2 pl-[18px] pr-4 py-2.5 ${
        isDark ? "customer-section-header-dark" : "customer-section-header-cream"
      } ${className}`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {icon ? (
          <span className="flex size-4 shrink-0 items-center justify-center [&_img]:size-4 [&_svg]:size-4">
            {icon}
          </span>
        ) : null}
        <h2
          className={`font-inter text-xs font-bold uppercase leading-[18px] tracking-[0.3px] ${
            isDark ? "customer-text-on-dark" : "text-warm-ink"
          }`}
        >
          {title}
        </h2>
      </div>
      {meta ? (
        <p
          className={`shrink-0 font-dm-sans text-[11px] font-normal leading-[16.5px] ${
            isDark ? "customer-text-subtle" : "text-warm-gray"
          }`}
          style={{ fontVariationSettings: "'opsz' 9" }}
        >
          {meta}
        </p>
      ) : null}
      {action ? (
        <div className="flex shrink-0 items-center">{action}</div>
      ) : null}
    </div>
  );
}
