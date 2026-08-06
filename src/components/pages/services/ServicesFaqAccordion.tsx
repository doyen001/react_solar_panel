"use client";

import { useId, useState } from "react";

import Icon from "@/components/ui/Icons";
import type { ServicesFaqEntry } from "@/utils/constant";

type ServicesFaqAccordionProps = {
  items: readonly ServicesFaqEntry[];
};

export function ServicesFaqAccordion({ items }: ServicesFaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);
  const baseId = useId();

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const isOpen = item.id === openId;
        const buttonId = `${baseId}-${item.id}-button`;
        const panelId = `${baseId}-${item.id}-panel`;

        return (
          <div
            key={item.id}
            className={`svc-card overflow-hidden rounded-2xl ${
              isOpen ? "border-svc-accent" : ""
            }`}
          >
            <h3 className="m-0">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="svc-focusable flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-7"
              >
                <span className="font-outfit text-base font-semibold leading-6 text-svc-ink sm:text-lg">
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full transition-[transform,background-color,color] duration-300 ${
                    isOpen
                      ? "rotate-180 bg-svc-accent text-white"
                      : "bg-svc-surface-alt text-svc-accent-text"
                  }`}
                >
                  <Icon name="ChevronDown" className="size-4 text-current" />
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!isOpen}
              data-open={isOpen}
              className="svc-accordion-panel"
            >
              <div>
                <p className="px-5 pb-6 font-dm-sans text-[15px] leading-7 text-svc-body sm:px-7 sm:text-base">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
