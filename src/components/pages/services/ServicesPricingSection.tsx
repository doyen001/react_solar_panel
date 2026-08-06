import { ServicesReveal } from "@/components/pages/services/ServicesReveal";
import { ServicesRippleLink } from "@/components/pages/services/ServicesRippleLink";
import { ServicesSectionHeading } from "@/components/pages/services/ServicesSectionHeading";
import Icon from "@/components/ui/Icons";
import { SERVICES_PAGE } from "@/utils/constant";

const { pricing } = SERVICES_PAGE;

export function ServicesPricingSection() {
  return (
    <section
      id="pricing"
      aria-labelledby="services-pricing-title"
      className="svc-anchor border-y border-svc-border-soft bg-white py-16 sm:py-20 lg:py-28"
    >
      <div className="mx-auto w-full max-w-[1226px] px-4 sm:px-6 lg:px-8">
        <ServicesSectionHeading
          eyebrow={pricing.eyebrow}
          title={pricing.title}
          subtitle={pricing.subtitle}
          headingId="services-pricing-title"
        />

        <ul className="mt-12 grid items-stretch gap-6 lg:mt-16 lg:grid-cols-3">
          {pricing.tiers.map((tier, index) => {
            // Only the featured tier carries a badge, so the union needs a guard.
            const badge = "badge" in tier ? tier.badge : null;
            const isFeatured = tier.featured;

            return (
              <li key={tier.id} className="flex">
                <ServicesReveal delayMs={index * 80} className="flex w-full">
                  <article
                    className={`svc-card svc-lift relative flex h-full w-full flex-col gap-6 rounded-3xl p-7 sm:p-8 ${
                      isFeatured
                        ? "border-svc-accent bg-svc-ink lg:-mt-4 lg:mb-4"
                        : ""
                    }`}
                  >
                    {badge ? (
                      <span className="absolute -top-3 left-8 inline-flex items-center rounded-full bg-svc-gold px-3 py-1 font-inter text-[11px] font-bold uppercase tracking-[0.1em] text-warm-black">
                        {badge}
                      </span>
                    ) : null}

                    <div className="flex flex-col gap-2">
                      <h3
                        className={`font-outfit text-xl font-bold leading-7 ${
                          isFeatured ? "text-white" : "text-svc-ink"
                        }`}
                      >
                        {tier.name}
                      </h3>
                      <p
                        className={`font-dm-sans text-[14px] leading-6 ${
                          isFeatured ? "text-svc-dark-body" : "text-svc-body"
                        }`}
                      >
                        {tier.summary}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1">
                      <p
                        className={`font-outfit text-[32px] font-bold leading-10 ${
                          isFeatured ? "text-white" : "text-svc-ink"
                        }`}
                      >
                        {tier.priceLabel}
                      </p>
                      <p
                        className={`font-inter text-[13px] leading-5 ${
                          isFeatured ? "text-svc-dark-muted" : "text-svc-muted"
                        }`}
                      >
                        {tier.cadence}
                      </p>
                    </div>

                    <ul className="flex flex-1 flex-col gap-3">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <span
                            aria-hidden="true"
                            className={`mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full ${
                              isFeatured
                                ? "bg-white/15 text-svc-accent"
                                : "bg-mint-soft text-success"
                            }`}
                          >
                            <Icon name="Check" className="size-3 text-current" />
                          </span>
                          <span
                            className={`font-dm-sans text-[14px] leading-6 ${
                              isFeatured ? "text-svc-dark-body" : "text-svc-body"
                            }`}
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <ServicesRippleLink
                      href={tier.ctaHref}
                      onDark={isFeatured}
                      ariaLabel={`${tier.ctaLabel} for the ${tier.name} package`}
                      className={
                        isFeatured
                          ? "svc-cta-primary inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-6 font-outfit text-base font-semibold text-white"
                          : "inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-svc-accent bg-white px-6 font-outfit text-base font-semibold text-svc-accent-text transition hover:bg-svc-accent-soft"
                      }
                    >
                      {tier.ctaLabel}
                      <Icon name="ArrowRight" className="size-[18px] text-current" />
                    </ServicesRippleLink>
                  </article>
                </ServicesReveal>
              </li>
            );
          })}
        </ul>

        <p className="mt-8 text-center font-inter text-[13px] leading-6 text-svc-muted">
          {pricing.footnote}
        </p>
      </div>
    </section>
  );
}
