import Link from "next/link";

import { ServicesPortfolioThumb } from "@/components/pages/services/ServicesPortfolioThumb";
import { ServicesReveal } from "@/components/pages/services/ServicesReveal";
import { ServicesSectionHeading } from "@/components/pages/services/ServicesSectionHeading";
import Icon from "@/components/ui/Icons";
import { SERVICES_PAGE } from "@/utils/constant";

const { portfolio } = SERVICES_PAGE;

export function ServicesPortfolioSection() {
  return (
    <section
      id="portfolio"
      aria-labelledby="services-portfolio-title"
      className="svc-anchor border-y border-svc-border-soft bg-white py-16 sm:py-20 lg:py-28"
    >
      <div className="mx-auto w-full max-w-[1226px] px-4 sm:px-6 lg:px-8">
        <ServicesSectionHeading
          eyebrow={portfolio.eyebrow}
          title={portfolio.title}
          subtitle={portfolio.subtitle}
          headingId="services-portfolio-title"
        />

        <ul className="mt-12 grid gap-7 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {portfolio.items.map((item, index) => (
            <li key={item.id} className="flex">
              <ServicesReveal
                delayMs={Math.min(index, 5) * 60}
                className="flex w-full"
              >
                <article className="svc-card svc-lift svc-scale flex h-full w-full flex-col overflow-hidden rounded-2xl">
                  <div className="relative aspect-16/10 overflow-hidden bg-svc-ink">
                    <ServicesPortfolioThumb
                      variant={item.variant}
                      label={item.imageAlt}
                    />

                    {/* Inner hairline reads as glass over the artwork rather than a hard crop. */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-t-2xl ring-1 ring-inset ring-white/12"
                    />

                    <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-svc-ink/60 px-3 py-1.5 font-inter text-[11px] font-semibold uppercase tracking-[0.1em] text-white backdrop-blur-md">
                      <span
                        aria-hidden="true"
                        className="size-1.5 rounded-full bg-svc-accent"
                      />
                      {item.category}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col gap-4 p-6">
                    <div className="flex flex-col gap-2">
                      <h3 className="font-outfit text-lg font-semibold leading-7 text-svc-ink">
                        {item.title}
                      </h3>
                      <p className="font-dm-sans text-[15px] leading-7 text-svc-body">
                        {item.summary}
                      </p>
                    </div>

                    <ul
                      aria-label={`Technologies used on ${item.title}`}
                      className="flex flex-wrap gap-2"
                    >
                      {item.technologies.map((tech) => (
                        <li
                          key={tech}
                          className="rounded-md border border-svc-border bg-svc-surface-alt px-2.5 py-1 font-inter text-[11px] font-medium text-svc-muted"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={item.href}
                      aria-label={`${portfolio.viewLabel}: ${item.title}`}
                      className="svc-focusable mt-auto inline-flex w-fit items-center gap-1.5 rounded-md font-inter text-sm font-semibold text-svc-accent-text transition hover:gap-2.5 hover:text-svc-ink"
                    >
                      {portfolio.viewLabel}
                      <Icon name="ArrowUpRight" className="size-4 text-current" />
                    </Link>
                  </div>
                </article>
              </ServicesReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
