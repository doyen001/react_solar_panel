import Image from "next/image";
import {
  PERFORMANCE_ESTIMATES,
  SELECTED_DESIGN_SPECS,
} from "./designConstants";
import { designAssets } from "./designAssets";
import { DesignSpecRow } from "./DesignSpecRow";

type Props = {
  title: string;
  lastUpdated: string;
  savingsLabel: string;
};

export function SelectedDesignPanel({
  title,
  lastUpdated,
  savingsLabel,
}: Props) {
  return (
    <section className="overflow-hidden rounded-[10px] border border-warm-border bg-cream-50">
      <div className="flex flex-col gap-3 border-b border-warm-border/60 bg-gradient-to-b from-amber-hot/15 to-transparent pl-4 sm:flex-row sm:items-center sm:justify-between sm:pl-[18px] sm:pr-4">
        <div className="flex items-center gap-2 border-l-2 border-yellow-lemon py-2.5 pl-4">
          <Image
            src={designAssets.sunHeader}
            alt=""
            width={16}
            height={16}
            className="size-4 shrink-0"
            unoptimized
          />
          <h2 className="font-inter text-xs font-bold uppercase leading-[18px] tracking-[0.3px] text-warm-ink">
            {title}
          </h2>
        </div>
        <span className="mb-2 shrink-0 self-start rounded-full bg-mint-soft px-2.5 py-0.5 font-dm-sans text-[9px] font-bold uppercase leading-[13.5px] tracking-[0.3px] text-success sm:mb-0 sm:self-center">
          Approved
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 p-4 lg:grid-cols-3 lg:gap-6">
        <div className="flex min-w-0 flex-col gap-2">
          <div className="relative overflow-hidden rounded-[10px] border border-amber-soft">
            <div className="relative aspect-[377/198] w-full overflow-hidden">
              <Image
                src={designAssets.mapHero}
                alt="Aerial view of property with solar design"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
                unoptimized
              />
            </div>
            <div className="absolute bottom-3 right-3 flex flex-wrap justify-end gap-1.5">
              <button
                type="button"
                className="inline-flex h-7 items-center gap-1.5 rounded-md border border-warm-border bg-white/90 px-2.5 font-dm-sans text-[10px] font-semibold text-warm-ink shadow-sm backdrop-blur-sm"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                <Image
                  src={designAssets.eye}
                  alt=""
                  width={12}
                  height={12}
                  unoptimized
                />
                View PDF
              </button>
              <button
                type="button"
                className="inline-flex h-7 items-center gap-1.5 rounded-md bg-navy-800 px-2.5 font-dm-sans text-[10px] font-semibold text-white shadow-sm"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                <Image
                  src={designAssets.download}
                  alt=""
                  width={12}
                  height={12}
                  unoptimized
                />
                Download PDF
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 pl-1">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px]">
              <span className="inline-flex items-center gap-1.5 font-dm-sans font-medium leading-[15px] text-warm-gray">
                <span
                  className="size-2 shrink-0 rounded-full bg-leaf"
                  aria-hidden
                />
                Design Approved
              </span>
              <span
                className="font-dm-sans font-normal leading-[15px] text-warm-gray/60"
                style={{ fontVariationSettings: "'opsz' 9" }}
              >
                Last updated: {lastUpdated}
              </span>
            </div>
            <p
              className="bg-clip-text font-dm-sans text-[10px] font-semibold leading-[15px] text-transparent"
              style={{
                fontVariationSettings: "'opsz' 14",
                backgroundImage:
                  "linear-gradient(172deg, rgb(32, 148, 243) 8.57%, rgb(23, 207, 207) 91.43%)",
              }}
            >
              {savingsLabel}
            </p>
          </div>
        </div>

        <div className="min-w-0">
          <h3 className="font-inter text-[11px] font-semibold leading-[16.5px] text-warm-ink">
            Design Specifications
          </h3>
          <div className="mt-2 flex flex-col">
            {SELECTED_DESIGN_SPECS.map((row) => (
              <DesignSpecRow
                key={row.label}
                label={row.label}
                value={row.value}
              />
            ))}
          </div>
        </div>

        <div className="min-w-0">
          <h3 className="font-inter text-[11px] font-semibold leading-[16.5px] text-warm-ink">
            Performance Estimates
          </h3>
          <div className="mt-2 flex flex-col">
            {PERFORMANCE_ESTIMATES.map((row) => (
              <DesignSpecRow
                key={row.label}
                label={row.label}
                value={row.value}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
