import Link from "next/link";

import { ServicesReveal } from "@/components/pages/services/ServicesReveal";
import { ServicesSectionHeading } from "@/components/pages/services/ServicesSectionHeading";
import Icon from "@/components/ui/Icons";
import { SERVICES_PAGE } from "@/utils/constant";

const { services } = SERVICES_PAGE;

export function ServicesOfferingsSection() {
  return (
    <section
      id="services"
      aria-labelledby="services-offerings-title"
      className="svc-anchor bg-svc-page-bg py-16 sm:py-20 lg:py-28"
    >
      <div className="mx-auto w-full max-w-[1226px] px-4 sm:px-6 lg:px-8">
        <ServicesSectionHeading
          eyebrow={services.eyebrow}
          title={services.title}
          subtitle={services.subtitle}
          headingId="services-offerings-title"
        />

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {services.items.map((item, index) => (
            <li key={item.id} className="flex">
              <ServicesReveal
                delayMs={Math.min(index, 5) * 60}
                className="flex w-full"
              >
                <article className="svc-card svc-lift flex h-full w-full flex-col gap-4 rounded-2xl p-6 sm:p-7">
                  <span
                    aria-hidden="true"
                    className="svc-icon-well inline-flex size-12 items-center justify-center rounded-xl"
                  >
                    <Icon name={item.iconId} className="size-6 text-current" />
                  </span>

                  <h3 className="font-outfit text-lg font-semibold leading-7 text-svc-ink">
                    {item.title}
                  </h3>

                  <p className="flex-1 font-dm-sans text-[15px] leading-7 text-svc-body">
                    {item.description}
                  </p>

                  <Link
                    href={services.learnMoreHref}
                    aria-label={`${services.learnMoreLabel} about ${item.title}`}
                    className="svc-focusable inline-flex w-fit items-center gap-1.5 rounded-md font-inter text-sm font-semibold text-svc-accent-text transition hover:gap-2.5 hover:text-svc-ink"
                  >
                    {services.learnMoreLabel}
                    <Icon name="ArrowRight" className="size-4 text-current" />
                  </Link>
                </article>
              </ServicesReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
