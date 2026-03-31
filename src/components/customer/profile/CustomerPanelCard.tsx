import type { ReactNode } from "react";

type Props = {
  title: string;
  icon: ReactNode;
  headerAction?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function CustomerPanelCard({
  title,
  icon,
  headerAction,
  children,
  className = "",
}: Props) {
  return (
    <section
      className={`flex min-h-0 flex-col overflow-hidden rounded-[10px] border border-[#dfd5c3] bg-[#fcfbf8] ${className}`}
    >
      <div className="flex min-h-[42px] shrink-0 items-center gap-2 border-l-2 border-[#ffef62] bg-gradient-to-b from-[rgba(245,159,10,0.15)] to-transparent pl-[18px] pr-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="flex size-4 shrink-0 items-center justify-center [&_img]:size-4">
            {icon}
          </span>
          <h2 className="font-inter text-xs font-bold uppercase leading-[18px] tracking-[0.3px] text-[#2a2622]">
            {title}
          </h2>
        </div>
        {headerAction ? (
          <div className="flex shrink-0 items-center">{headerAction}</div>
        ) : null}
      </div>
      <div className="flex min-h-0 flex-1 flex-col px-5 pb-5 pt-5">{children}</div>
    </section>
  );
}
