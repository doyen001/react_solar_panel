import { ServicesReveal } from "@/components/pages/services/ServicesReveal";
import Icon from "@/components/ui/Icons";
import { RainbowButton } from "@/components/ui/RainbowButton";
import { SERVICES_PAGE } from "@/utils/constant";

const { whyChooseUs } = SERVICES_PAGE;

export function ServicesWhyChooseSection() {
  return (
    <section
      id="why-us"
      aria-labelledby="services-why-title"
      className="svc-anchor border-y border-svc-border-soft bg-white py-16 sm:py-20 lg:py-28"
    >
      <div className="mx-auto grid w-full max-w-[1226px] gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-16 lg:px-8">
        <ServicesReveal className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start">
          <span className="inline-flex w-fit items-center rounded-full border border-svc-border bg-svc-accent-soft px-3.5 py-1.5 font-inter text-xs font-semibold uppercase tracking-[0.12em] text-svc-accent-text">
            {whyChooseUs.eyebrow}
          </span>
          <h2
            id="services-why-title"
            className="font-outfit text-[30px] font-bold leading-[1.16] tracking-[-0.8px] text-svc-ink sm:text-[38px] lg:text-[42px]"
          >
            {whyChooseUs.title}
          </h2>
          <p className="font-dm-sans text-base leading-7 text-svc-body sm:text-lg">
            {whyChooseUs.subtitle}
          </p>
          <RainbowButton
            href={whyChooseUs.cta.href}
            shape="rounded"
            className="svc-cta-primary mt-2 h-12 w-fit px-6 font-outfit text-base font-semibold text-warm-black"
          >
            {whyChooseUs.cta.label}
            <Icon name="ArrowRight" className="size-[18px] text-current" />
          </RainbowButton>
        </ServicesReveal>

        <ul className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
          {whyChooseUs.items.map((item, index) => (
            <li key={item.id}>
              <ServicesReveal delayMs={Math.min(index, 5) * 55}>
                <div className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="svc-icon-well mt-0.5 inline-flex size-11 shrink-0 items-center justify-center rounded-xl"
                  >
                    <Icon name={item.iconId} className="size-[22px] text-current" />
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="font-outfit text-base font-semibold leading-6 text-svc-ink">
                      {item.title}
                    </h3>
                    <p className="font-dm-sans text-[15px] leading-7 text-svc-body">
                      {item.description}
                    </p>
                  </div>
                </div>
              </ServicesReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
