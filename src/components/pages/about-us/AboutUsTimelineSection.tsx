import { AboutUsTimelineCard } from "@/components/pages/about-us/AboutUsTimelineCard";
import { ABOUT_US_PAGE } from "@/utils/constant";
import { Fragment } from "react/jsx-runtime";

export function AboutUsTimelineSection() {
  return (
    <section className="about-us-timeline-surface relative overflow-hidden px-4 py-16 sm:px-6 lg:px-[90px] lg:py-[177px]">
      <div className="pointer-events-none absolute left-1/2 top-[177px] hidden h-[min(1800px,100%)] w-[17px] -translate-x-1/2 lg:block">
        <div className="about-us-timeline-line h-full w-full rounded-full" />
        {[0, 1, 2, 3].map((node) => (
          <span
            key={node}
            className="absolute left-1/2 size-10 -translate-x-1/2 rounded-[7px] bg-design-accent-cyan"
            style={{ top: `${node * 32}%` }}
            aria-hidden
          />
        ))}
      </div>

      <div className="relative mx-auto flex w-full max-w-[1260px] flex-col gap-12 lg:gap-[80px]">
        {ABOUT_US_PAGE.timeline.events.map((event) => (
          <Fragment key={event.id}>
            <div
              key={event.id}
              className={`flex w-full ${
                event.side === "left" ? "lg:justify-start" : "lg:justify-end"
              }`}
            >
              <AboutUsTimelineCard event={event} />
            </div>
          </Fragment>
        ))}
      </div>
    </section>
  );
}
