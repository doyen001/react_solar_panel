"use client";

import classNames from "classnames";
import { useId, useState } from "react";
import { BLUETTI_EP2000_USE_CASE_SECTION } from "@/utils/constant";

export function BluettiUseCaseTabsSection() {
  const baseId = useId();
  const { heading, tabs } = BLUETTI_EP2000_USE_CASE_SECTION;
  const [activeIndex, setActiveIndex] = useState(0);
  const tab = tabs[activeIndex];

  return (
    <section
      className="padding-section-medium bg-white"
      aria-labelledby={`${baseId}-use-case-heading`}
    >
      <div className="container-large">
        <h2
          id={`${baseId}-use-case-heading`}
          className="mx-auto max-w-4xl text-center font-inter text-3xl font-bold tracking-tight text-bluetti-combo-heading md:text-4xl lg:text-[2.5rem] lg:leading-tight"
        >
          {heading}
        </h2>

        <div className="mt-10 w-full md:mt-12">
          <div
            className="[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:overflow-visible overflow-x-auto pb-1"
            role="presentation"
          >
            <div
              className="mx-auto flex w-max max-w-none flex-nowrap gap-1 rounded-full bg-bluetti-combo-tab-shell p-1 sm:w-auto sm:max-w-fit sm:flex-wrap sm:justify-center"
              role="tablist"
              aria-label="Solar and backup use cases"
            >
              {tabs.map((t, index) => {
                const selected = index === activeIndex;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    id={`${baseId}-use-tab-${t.id}`}
                    aria-selected={selected}
                    aria-controls={`${baseId}-use-case-panel`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActiveIndex(index)}
                    className={classNames(
                      "min-h-11 shrink-0 rounded-full px-4 py-2.5 font-inter text-sm font-semibold whitespace-nowrap transition sm:min-h-0 sm:px-5",
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
        </div>

        <div
          id={`${baseId}-use-case-panel`}
          role="tabpanel"
          aria-labelledby={`${baseId}-use-tab-${tab.id}`}
          className="mt-8 md:mt-10"
        >
          <p className="mx-auto max-w-3xl text-center font-inter text-base leading-relaxed text-bluetti-combo-body sm:text-lg md:text-xl">
            {tab.description}
          </p>

          <div className="mx-auto mt-8 max-w-5xl overflow-hidden rounded-2xl sm:mt-10 sm:rounded-3xl">
            <div className="relative aspect-video w-full">
              <video
                key={tab.id}
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-label={tab.videoAriaLabel}
              >
                <source src={tab.videoSrc} type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
