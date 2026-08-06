import { ServicesReveal } from "@/components/pages/services/ServicesReveal";
import { ServicesSectionHeading } from "@/components/pages/services/ServicesSectionHeading";
import Icon from "@/components/ui/Icons";
import { SERVICES_PAGE } from "@/utils/constant";

const { benefits } = SERVICES_PAGE;

export function ServicesBenefitsSection() {
  return (
    <section
      id="benefits"
      aria-labelledby="services-benefits-title"
      className="svc-anchor border-y border-svc-border-soft bg-white py-16 sm:py-20 lg:py-28"
    >
      <div className="mx-auto w-full max-w-[1226px] px-4 sm:px-6 lg:px-8">
        <ServicesSectionHeading
          eyebrow={benefits.eyebrow}
          title={benefits.title}
          subtitle={benefits.subtitle}
          headingId="services-benefits-title"
        />

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {benefits.items.map((item, index) => (
            <li key={item.id} className="flex">
              <ServicesReveal
                delayMs={Math.min(index, 7) * 50}
                className="flex w-full"
              >
                <div className="svc-card svc-lift flex h-full w-full flex-col gap-3 rounded-2xl p-5">
                  <span
                    aria-hidden="true"
                    className="inline-flex size-8 items-center justify-center rounded-full bg-mint-soft text-success"
                  >
                    <Icon name="Check" className="size-4 text-current" />
                  </span>
                  <h3 className="font-outfit text-[15px] font-semibold leading-6 text-svc-ink">
                    {item.title}
                  </h3>
                  <p className="font-dm-sans text-[14px] leading-6 text-svc-body">
                    {item.description}
                  </p>
                </div>
              </ServicesReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
