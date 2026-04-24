import type { ReactNode } from "react";

type Props = {
  title: string;
  headerRight?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Body padding; default matches dashboard cards. Use for chart blocks to match Figma spacing. */
  bodyClassName?: string;
};

export function MasterSectionCard({
  title,
  headerRight,
  children,
  className = "",
  bodyClassName = "px-4 pb-4 pt-4",
}: Props) {
  return (
    <section
      className={`overflow-hidden rounded-[10px] border border-warm-border bg-cream-50 ${className}`}
      style={{ borderWidth: "0.636px" }}
    >
      <header className="master-section-banner flex h-[41.992px] min-h-[41.992px] items-center justify-between gap-4 pl-[18.533px] pr-[18.533px]">
        <h2 className="font-inter text-[12px] font-bold uppercase leading-[18px] tracking-[0.3px] text-warm-ink">
          {title}
        </h2>
        {headerRight ? (
          <div className="shrink-0 text-right">{headerRight}</div>
        ) : null}
      </header>
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}
