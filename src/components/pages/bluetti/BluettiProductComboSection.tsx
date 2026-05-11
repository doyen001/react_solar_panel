"use client";

import classNames from "classnames";
import Image from "next/image";
import { useId, useState } from "react";
import {
  BLUETTI_EP2000_COMBO_SECTION,
  BLUETTI_EP2000_ESSENTIAL_APPLIANCES,
  BLUETTI_EP2000_HEAVY_APPLIANCES,
} from "@/utils/constant";
import {
  BLUETTI_APPLIANCE_ICON_MAP,
  type BluettiApplianceIconId,
} from "./bluettiApplianceIcons";

function ApplianceGridItem({
  iconId,
  label,
  dimmed,
}: {
  iconId: BluettiApplianceIconId;
  label: string;
  dimmed?: boolean;
}) {
  const Icon = BLUETTI_APPLIANCE_ICON_MAP[iconId];
  return (
    <div
      className={classNames(
        "flex flex-col items-center gap-2 sm:gap-2.5",
        dimmed && "opacity-40",
      )}
    >
      <div className="flex size-[30px] shrink-0 items-center justify-center sm:size-10">
        <Icon className="h-full w-full max-h-10 max-w-10" aria-hidden />
      </div>
      <span className="max-w-26 text-center font-inter text-[11px] font-medium leading-tight text-bluetti-combo-icon sm:text-xs">
        {label}
      </span>
    </div>
  );
}

export function BluettiProductComboSection() {
  const baseId = useId();
  const { heading, subheading, comboLabel, warrantyBadge, note, tabs } =
    BLUETTI_EP2000_COMBO_SECTION;
  const [activeIndex, setActiveIndex] = useState(0);
  const tab = tabs[activeIndex];

  return (
    <section
      className="padding-section-medium bg-bluetti-combo-bg"
      aria-labelledby={`${baseId}-combo-heading`}
    >
      <div className="container-large">
        <header className="mx-auto mb-10 max-w-4xl text-center md:mb-12">
          <h2
            id={`${baseId}-combo-heading`}
            className="font-inter text-3xl font-bold tracking-tight text-bluetti-combo-heading md:text-4xl"
          >
            {heading}
          </h2>
          <p className="mt-4 font-inter text-lg font-normal leading-relaxed text-bluetti-combo-body md:text-xl">
            {subheading}
          </p>
        </header>

        <div className="mb-10 flex justify-center md:mb-12">
          <div
            className="inline-flex flex-wrap justify-center gap-1 rounded-full bg-bluetti-combo-tab-shell p-1 sm:flex-nowrap"
            role="tablist"
            aria-label="Battery capacity options"
          >
            {tabs.map((t, index) => {
              const selected = index === activeIndex;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${t.id}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-combo-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveIndex(index)}
                  className={classNames(
                    "min-h-[44px] rounded-full px-4 py-2.5 font-inter text-sm font-semibold transition sm:min-h-0 sm:px-6",
                    selected
                      ? "bg-bluetti-combo-tab-active text-white shadow-sm"
                      : "text-bluetti-combo-tab-idle-text hover:bg-white/70",
                  )}
                >
                  {t.tabLabel}
                </button>
              );
            })}
          </div>
        </div>

        <div
          id={`${baseId}-combo-panel`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${tab.id}`}
        >
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-x-16 xl:gap-x-20">
            <div className="flex min-w-0 flex-col">
              <p className="font-inter text-xs font-medium uppercase tracking-wide text-bluetti-combo-label sm:text-sm">
                {comboLabel}
              </p>
              <h3 className="mt-3 font-inter text-xl font-bold leading-snug text-bluetti-combo-heading sm:text-2xl">
                <span>1 Power Module + </span>
                <span
                  className="font-bold text-bluetti-combo-tab-active text-[1.35em]"
                >
                  {tab.batteryModules}
                </span>
                <span> Battery Modules</span>
              </h3>

              <p className="bluetti-combo-gradient-text bluetti-combo-price-text mt-6">
                {tab.priceLine}
              </p>
              <p className="bluetti-combo-gradient-text bluetti-combo-specs-text mt-3">
                {tab.specsLine}
              </p>

              <div className="mt-10">
                <h4 className="font-inter text-sm font-bold text-bluetti-combo-heading sm:text-base">
                  Essential Appliances
                </h4>
                <div className="mt-4 grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-6 sm:gap-x-2 md:gap-x-4">
                  {BLUETTI_EP2000_ESSENTIAL_APPLIANCES.map((item) => (
                    <ApplianceGridItem
                      key={item.iconId}
                      iconId={item.iconId}
                      label={item.label}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-10">
                <h4 className="font-inter text-sm font-bold text-bluetti-combo-heading sm:text-base">
                  Heavy Appliances
                </h4>
                <div className="mt-4 grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-6 sm:gap-x-2 md:gap-x-4">
                  {BLUETTI_EP2000_HEAVY_APPLIANCES.map((item, heavyIdx) => (
                    <ApplianceGridItem
                      key={item.iconId}
                      iconId={item.iconId}
                      label={item.label}
                      dimmed={
                        tab.dimLastThreeHeavyAppliances && heavyIdx >= 3
                      }
                    />
                  ))}
                </div>
              </div>

              <div className="mt-10 border-t border-border-soft pt-6">
                <p className="font-inter text-xs font-semibold text-bluetti-combo-note">
                  {note.title}
                </p>
                <ol className="mt-2 list-decimal space-y-2 pl-4 font-inter text-[11px] leading-snug text-bluetti-combo-note sm:text-xs">
                  <li>{note.items[0]}</li>
                  <li>{note.items[1]}</li>
                  <li>
                    {note.items[2]}{" "}
                    <a
                      href={note.emailHref}
                      className="font-medium text-bluetti-combo-link underline underline-offset-2"
                    >
                      {note.email}
                    </a>
                    .
                  </li>
                </ol>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl lg:mx-0 lg:max-w-none">
              <div className="relative aspect-4/5 w-full sm:aspect-5/6 lg:aspect-auto lg:min-h-[min(520px,55vh)]">
                <Image
                  key={tab.id}
                  src={tab.imageSrc}
                  alt={tab.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-contain object-center"
                  priority={activeIndex === 0}
                />
              </div>
              <p
                className="pointer-events-none absolute bottom-3 right-3 max-w-44 text-right font-inter text-xs font-semibold tracking-wide text-bluetti-combo-warranty sm:bottom-5 sm:right-5 sm:text-sm"
                aria-hidden
              >
                {warrantyBadge}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
