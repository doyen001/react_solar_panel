import Image from "next/image";
import type { DesignSummaryItem } from "./types";
import { productsAssets } from "./productsAssets";

type Props = {
  items: DesignSummaryItem[];
};

export function SelectedDesignProductsSection({ items }: Props) {
  return (
    <section className="overflow-hidden rounded-[10px] border border-[#dfd5c3] bg-[#fcfbf8]">
      <div className="flex min-h-[42px] items-center gap-2 border-l-2 border-[#ffef62] bg-gradient-to-b from-[rgba(245,159,10,0.15)] to-transparent pl-[18px] pr-4">
        <Image
          src={productsAssets.checkCircle}
          alt=""
          width={16}
          height={16}
          className="size-4 shrink-0"
          unoptimized
        />
        <h2 className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase leading-[18px] tracking-[0.3px] text-[#2a2622]">
          Products in Your Selected Design
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex min-h-[68px] items-center gap-3 rounded-lg border border-[#dfd5c3] bg-white px-3 py-2"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-b from-[#ffef62] to-[#f78d00]">
              <Image
                src={item.icon === "sun" ? productsAssets.sun : productsAssets.cpu}
                alt=""
                width={16}
                height={16}
                unoptimized
              />
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="font-[family-name:var(--font-dm-sans)] text-xs font-semibold leading-[18px] text-[#2a2622]"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                {item.name}
              </p>
              <p
                className="mt-1 font-[family-name:var(--font-dm-sans)] text-[10px] font-normal leading-[15px] text-[#7c736a]"
                style={{ fontVariationSettings: "'opsz' 9" }}
              >
                {item.detail}
              </p>
            </div>
            <button
              type="button"
              className="flex shrink-0 items-center gap-1 font-[family-name:var(--font-dm-sans)] text-[10px] font-semibold leading-[15px] text-[#f78d00]"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              View Details
              <Image
                src={productsAssets.externalLink}
                alt=""
                width={12}
                height={12}
                unoptimized
              />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
