import Image from "next/image";

type Props = {
  label: string;
  value: string;
  sublabel: string;
  iconSrc: string;
  iconBgClass: string;
};

export function DashboardKpiCard({
  label,
  value,
  sublabel,
  iconSrc,
  iconBgClass,
}: Props) {
  return (
    <div className="flex min-h-[115px] flex-col rounded-[10px] border border-[#dfd5c3] bg-[#fcfbf8] p-4">
      <div className="flex items-center justify-between gap-2">
        <span
          className="font-dm-sans text-[11px] font-normal leading-[16.5px] text-[#7c736a]"
          style={{ fontVariationSettings: "'opsz' 9" }}
        >
          {label}
        </span>
        <div
          className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${iconBgClass}`}
        >
          <Image src={iconSrc} alt="" width={16} height={16} unoptimized />
        </div>
      </div>
      <p className="mt-3 font-inter text-2xl font-bold leading-7 text-[#2a2622]">
        {value}
      </p>
      <p
        className="mt-1 font-dm-sans text-[10px] font-normal leading-[15px] text-[rgba(124,115,106,0.5)]"
        style={{ fontVariationSettings: "'opsz' 9" }}
      >
        {sublabel}
      </p>
    </div>
  );
}
