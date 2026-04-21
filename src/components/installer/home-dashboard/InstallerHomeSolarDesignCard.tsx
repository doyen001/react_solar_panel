"use client";

import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/ui/Icons";
import { INSTALLER_HOME_SOLAR_DESIGN } from "./installerHomeMock";

/** Figma node 3:8616 — rooftop preview asset (expires on MCP host after ~7 days). */
export const INSTALLER_SOLAR_DESIGN_PREVIEW_URL =
  "/images/home/installer-solar-design.png";

function ExternalLinkGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
    </svg>
  );
}

function SolarSpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-h-[19.875px] items-center justify-between gap-3 font-dm-sans">
      <span className="text-[13.25px] leading-[19.875px] text-warm-gray">
        {label}
      </span>
      <span className="shrink-0 text-right text-[13.25px] font-medium leading-[19.875px] text-warm-ink">
        {value}
      </span>
    </div>
  );
}

export function InstallerHomeSolarDesignCard() {
  const sd = INSTALLER_HOME_SOLAR_DESIGN;

  return (
    <section
      data-node-id="3:8616"
      className="overflow-hidden rounded-[11px] border border-warm-border bg-cream-50"
    >
      {/* Header strip: left yellow rule + amber wash (Figma 3:8617) */}
      <header className="flex min-h-[43px] items-center justify-between gap-3 border-b border-warm-border bg-linear-to-b from-[rgba(245,159,10,0.15)] to-transparent py-2 pl-[17px] pr-[17px] border-l-[2.3px] border-l-yellow-lemon">
        <div className="flex min-w-0 items-center gap-[10px]">
          <Icon name="Sun" className="size-[17.65px] shrink-0 text-warm-ink" />
          <span className="truncate font-inter text-[13.25px] font-bold uppercase leading-[19.875px] tracking-[0.33px] text-warm-ink">
            Solar Design
          </span>
        </div>
        <Link
          href="/designs"
          className="inline-flex shrink-0 items-center gap-[6px] font-dm-sans text-[11px] font-semibold leading-[16.56px] text-[#333333] hover:opacity-80"
        >
          Open Designer
          <ExternalLinkGlyph className="size-[13.24px] shrink-0 text-[#333333]" />
        </Link>
      </header>

      {/* Three-column body (Figma 3:8636): image | specs | performance */}
      <div className="grid gap-[17px] px-[17px] pt-[17px] lg:grid-cols-[minmax(0,375px)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-[17px] lg:gap-y-0">
        {/* Image frame: golden border (3:8705–3:8706) */}
        <div className="flex shrink-0 flex-col overflow-hidden rounded-[11px] border-[1.157px] border-amber-soft p-[1.157px] lg:max-w-[375px]">
          <div className="relative aspect-373/174 w-full overflow-hidden rounded-[9.89px] bg-cream-200">
            <Image
              src={INSTALLER_SOLAR_DESIGN_PREVIEW_URL}
              alt="Solar roof design preview"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 375px"
              priority
            />
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-[8.825px] pt-0 lg:max-w-[360px]">
          <h4 className="font-inter text-[12.146px] font-semibold leading-[18.22px] text-warm-ink">
            Design Specifications
          </h4>
          <div className="flex flex-col gap-[4.413px]">
            {sd.designSpecs.map((row) => (
              <SolarSpecRow
                key={row.label}
                label={row.label}
                value={row.value}
              />
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-[8.825px] pt-0 lg:max-w-[360px]">
          <h4 className="font-inter text-[12.146px] font-semibold leading-[18.22px] text-warm-ink">
            Performance Estimates
          </h4>
          <div className="flex flex-col gap-[4.413px]">
            {sd.performance.map((row) => (
              <SolarSpecRow
                key={row.label}
                label={row.label}
                value={row.value}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer row (Figma 3:8707) */}
      <footer className="mx-[17px] mt-[17px] mb-[14px] flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-warm-border pt-[10px]">
        <div className="flex min-w-0 flex-wrap items-center gap-x-[22px] gap-y-2">
          <span className="inline-flex items-center gap-[10px]">
            <span
              className="size-[8.83px] shrink-0 rounded-full bg-leaf"
              aria-hidden
            />
            <span className="font-dm-sans text-[11px] font-medium leading-[16.56px] text-warm-gray">
              {sd.footer.status}
            </span>
          </span>
          <span className="font-dm-sans text-[11px] leading-[16.56px] text-[rgba(124,115,106,0.6)]">
            {sd.footer.updated}
          </span>
        </div>
        <span className="bg-linear-to-br from-brand-blue to-brand-teal bg-clip-text font-dm-sans text-[11px] font-semibold leading-[16.56px] text-transparent">
          {sd.footer.savings}
        </span>
      </footer>
    </section>
  );
}
