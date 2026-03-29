import Image from "next/image";
import type { EquipmentCardData } from "./designConstants";

type Props = {
  card: EquipmentCardData;
};

export function EquipmentCard({ card }: Props) {
  return (
    <div className="flex min-h-[150px] flex-col gap-3 rounded-[10px] border border-[#dfd5c3] bg-gradient-to-r from-[#ffef62] to-[#f78d00] p-3.5">
      <div className="flex items-center gap-2">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-[rgba(9,35,74,0.16)] bg-gradient-to-b from-[#ffef62] to-[#f78d00]">
          <Image
            src={card.iconSrc}
            alt=""
            width={14}
            height={14}
            className="size-3.5"
            unoptimized
          />
        </div>
        <h3 className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase leading-[18px] tracking-[0.3px] text-[#2a2622]">
          {card.title}
        </h3>
      </div>
      <div className="flex flex-col gap-1">
        {card.rows.map((row) => (
          <div
            key={row.label}
            className="flex items-start justify-between gap-2 text-xs"
          >
            <span
              className="font-[family-name:var(--font-dm-sans)] font-normal text-[#7c736a]"
              style={{ fontVariationSettings: "'opsz' 9" }}
            >
              {row.label}
            </span>
            <span
              className="text-right font-[family-name:var(--font-dm-sans)] font-medium text-[#2a2622]"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
