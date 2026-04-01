import Image from "next/image";
import { dashboardAssets } from "./assets";

type Props = {
  initials: string;
  companyName: string;
  subtitle: string;
};

export function TimelineInstallerCard({
  initials,
  companyName,
  subtitle,
}: Props) {
  return (
    <div className="border-t border-warm-border bg-white p-4">
      <p
        className="font-dm-sans text-[9px] font-normal uppercase leading-[13.5px] tracking-[0.3px] text-warm-gray"
        style={{ fontVariationSettings: "'opsz' 9" }}
      >
        Your Installer
      </p>
      <div className="mt-2 flex items-center gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-navy-800 font-inter text-[10px] font-semibold leading-[15px] tracking-wide text-white">
          {initials.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p
            className="font-dm-sans text-xs font-semibold leading-[18px] text-warm-ink"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            {companyName}
          </p>
          <p
            className="mt-1 font-dm-sans text-[10px] font-normal leading-[15px] text-warm-gray"
            style={{ fontVariationSettings: "'opsz' 9" }}
          >
            {subtitle}
          </p>
        </div>
        <button
          type="button"
          className="flex shrink-0 items-center gap-1.5 rounded-md bg-gradient-to-b from-yellow-lemon to-orange-amber px-3 py-1.5 font-dm-sans text-[9px] font-bold uppercase leading-[13.5px] tracking-[0.3px] text-warm-black"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          <Image
            src={dashboardAssets.messageSquare}
            alt=""
            width={12}
            height={12}
            unoptimized
          />
          Message
        </button>
      </div>
    </div>
  );
}
