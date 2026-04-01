"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { dashboardAssets } from "./assets";
import type { TimelineStep } from "./types";

type Props = {
  title?: string;
  /** Index of the current / in-progress step (0-based). Steps before are completed; after are upcoming. */
  activeStepIndex: number;
  steps: Omit<TimelineStep, "state">[];
  /** Footer slot (e.g. installer card). */
  footer?: ReactNode;
};

export function ProjectTimeline({
  title = "Project Timeline",
  activeStepIndex,
  steps,
  footer,
}: Props) {
  const resolved: TimelineStep[] = steps.map((s, i) => ({
    ...s,
    state:
      i < activeStepIndex
        ? "completed"
        : i === activeStepIndex
          ? "current"
          : "upcoming",
  }));

  return (
    <section className="flex min-h-[min(533px,80vh)] flex-col overflow-hidden rounded-[10px] border border-warm-border bg-cream-50 lg:min-h-[520px]">
      <div className="border-l-2 border-yellow-lemon bg-gradient-to-b from-amber-hot/15 to-transparent pl-[18px] pr-4 py-2.5">
        <h2 className="font-inter text-xs font-bold uppercase leading-[18px] tracking-[0.3px] text-warm-ink">
          {title}
        </h2>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-4 pb-4 pt-4">
        <ol className="flex flex-col">
          {resolved.map((step, i) => {
            const isLast = i === resolved.length - 1;
            const segmentGreen = !isLast && i + 1 < activeStepIndex;

            return (
              <li key={step.id} className="flex gap-3">
                <div className="flex w-5 shrink-0 flex-col items-center">
                  <TimelineDot state={step.state} />
                  {!isLast ? (
                    <div
                      className={`mt-0.5 w-0.5 flex-1 min-h-[48px] rounded-full ${
                        segmentGreen ? "bg-success" : "bg-warm-border"
                      }`}
                      aria-hidden
                    />
                  ) : null}
                </div>
                <div className={`min-w-0 pb-4 ${isLast ? "pb-0" : ""}`}>
                  <p
                    className={`font-dm-sans text-xs font-medium leading-[18px] ${
                      step.state === "completed"
                        ? "text-warm-ink"
                        : "text-warm-gray"
                    }`}
                    style={{ fontVariationSettings: "'opsz' 14" }}
                  >
                    {step.title}
                  </p>
                  <p
                    className="mt-1.5 font-dm-sans text-[10px] font-normal leading-[15px] text-warm-gray"
                    style={{ fontVariationSettings: "'opsz' 9" }}
                  >
                    {step.dateLabel ?? "—"}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
      {footer}
    </section>
  );
}

function TimelineDot({ state }: { state: TimelineStep["state"] }) {
  if (state === "completed") {
    return (
      <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-success">
        <Image
          src={dashboardAssets.check}
          alt=""
          width={12}
          height={12}
          unoptimized
        />
      </div>
    );
  }

  return (
    <div
      className={`size-5 shrink-0 rounded-full border border-warm-border bg-white ${
        state === "current" ? "ring-1 ring-warm-border" : ""
      }`}
      aria-hidden
    />
  );
}
