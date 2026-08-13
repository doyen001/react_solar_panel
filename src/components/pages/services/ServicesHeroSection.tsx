import { ServicesBreadcrumb } from "@/components/pages/services/ServicesBreadcrumb";
import { ServicesCounter } from "@/components/pages/services/ServicesCounter";
import { ServicesHeroMockup } from "@/components/pages/services/ServicesHeroMockup";
import { ServicesReveal } from "@/components/pages/services/ServicesReveal";
import { ServicesRippleLink } from "@/components/pages/services/ServicesRippleLink";
import Icon from "@/components/ui/Icons";
import { SERVICES_PAGE } from "@/utils/constant";

const { hero } = SERVICES_PAGE;

const FLOAT_POSITIONS = [
  "left-[-4%] top-[16%] svc-float",
  "right-[-2%] top-[6%] svc-float svc-float-delay-1",
  "bottom-[8%] left-[6%] svc-float-slow svc-float-delay-2",
] as const;

export function ServicesHeroSection() {
  return (
    <section
      aria-labelledby="services-hero-title"
      className="svc-hero-bg relative overflow-hidden"
    >
      <div aria-hidden="true" className="svc-grid-lines absolute inset-0" />

      <div className="relative mx-auto w-full max-w-[1226px] px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8 lg:pb-28">
        <ServicesBreadcrumb />

        <div className="mt-8 grid items-center gap-12 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)] lg:gap-14">
          <div className="flex flex-col gap-7">
            <ServicesReveal className="flex flex-col gap-6">
              <span className="svc-eyebrow-dark inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-1.5 font-inter text-xs font-semibold uppercase tracking-[0.12em] backdrop-blur-md">
                <Icon name="Sparkles" className="size-3.5 text-yellow-lemon" />
                {hero.badge}
              </span>

              <h1
                id="services-hero-title"
                className="max-w-[660px] font-outfit text-[34px] font-bold leading-[1.1] tracking-[-1.2px] text-white sm:text-[46px] lg:text-[56px]"
              >
                Professional{" "}
                <span className="svc-gradient-text">
                  Website Design &amp; Development
                </span>{" "}
                That Grows Your Business
              </h1>

              <p className="max-w-[560px] font-dm-sans text-base leading-7 text-svc-dark-body sm:text-lg sm:leading-8">
                {hero.subtitle}
              </p>
            </ServicesReveal>

            <ServicesReveal delayMs={120} className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <ServicesRippleLink
                  href={hero.primaryCta.href}
                  onDark
                  className="svc-cta-primary inline-flex h-13 min-w-[190px] items-center justify-center gap-2 rounded-xl px-7 font-outfit text-base font-semibold text-warm-black"
                >
                  {hero.primaryCta.label}
                  <Icon name="ArrowRight" className="size-[18px] text-current" />
                </ServicesRippleLink>

                <ServicesRippleLink
                  href={hero.secondaryCta.href}
                  onDark
                  className="svc-glass inline-flex h-13 min-w-[186px] items-center justify-center gap-2 rounded-xl px-7 font-outfit text-base font-semibold text-white transition hover:bg-svc-glass-strong"
                >
                  {hero.secondaryCta.label}
                  <Icon name="ArrowUpRight" className="size-[18px] text-current" />
                </ServicesRippleLink>
              </div>

              <p className="font-inter text-[13px] leading-5 text-svc-dark-muted">
                {hero.trustNote}
              </p>
            </ServicesReveal>

            <ServicesReveal delayMs={220}>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-7 border-t border-svc-dark-border pt-8 sm:grid-cols-4">
                {hero.stats.map((stat) => (
                  <div key={stat.id} className="flex flex-col gap-1">
                    <dt className="order-2 font-inter text-[13px] font-medium leading-5 text-svc-dark-muted">
                      {stat.label}
                    </dt>
                    <dd className="order-1 font-outfit text-[30px] font-bold leading-9 text-yellow-lemon sm:text-[34px]">
                      <ServicesCounter
                        value={stat.value}
                        suffix={stat.suffix}
                        srLabel={stat.srLabel}
                      />
                    </dd>
                  </div>
                ))}
              </dl>
            </ServicesReveal>
          </div>

          <ServicesReveal delayMs={160} className="relative">
            <div className="relative mx-auto w-full max-w-[620px]">
              <ServicesHeroMockup />

              {hero.floatingCards.map((card, index) => (
                <div
                  key={card.id}
                  aria-hidden="true"
                  className={`svc-glass pointer-events-none absolute hidden rounded-2xl px-4 py-3 shadow-lg sm:block ${FLOAT_POSITIONS[index]}`}
                >
                  <p className="font-outfit text-lg font-bold leading-6 text-white">
                    {card.title}
                  </p>
                  <p className="font-inter text-[11px] font-medium uppercase tracking-[0.1em] text-yellow-lemon">
                    {card.unit}
                  </p>
                  <p className="font-inter text-[11px] leading-4 text-svc-dark-muted">
                    {card.caption}
                  </p>
                </div>
              ))}
            </div>
          </ServicesReveal>
        </div>
      </div>
    </section>
  );
}
