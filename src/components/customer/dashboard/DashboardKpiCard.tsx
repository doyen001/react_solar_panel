import Icon, { IconType } from "../../ui/Icons";

type Props = {
  label: string;
  value: string;
  sublabel: string;
  icon: IconType;
  iconBgClass: string;
};

export function DashboardKpiCard({
  label,
  value,
  sublabel,
  icon,
  iconBgClass,
}: Props) {
  return (
    <div className="flex min-h-[115px] flex-col rounded-[10px] border border-warm-border bg-cream-50 p-4">
      <div className="flex items-center justify-between gap-2">
        <span
          className="font-dm-sans text-[11px] font-normal leading-[16.5px] text-warm-gray"
          style={{ fontVariationSettings: "'opsz' 9" }}
        >
          {label}
        </span>
        <div
          className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${iconBgClass}`}
        >
          <Icon name={icon} className="size-4 text-blue-700" />
        </div>
      </div>
      <p className="mt-3 font-inter text-2xl font-bold leading-7 text-warm-ink">
        {value}
      </p>
      <p
        className="mt-1 font-dm-sans text-[10px] font-normal leading-[15px] text-warm-gray/50"
        style={{ fontVariationSettings: "'opsz' 9" }}
      >
        {sublabel}
      </p>
    </div>
  );
}
