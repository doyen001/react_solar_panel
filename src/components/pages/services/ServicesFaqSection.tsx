import { ServicesFaqAccordion } from "@/components/pages/services/ServicesFaqAccordion";
import { ServicesReveal } from "@/components/pages/services/ServicesReveal";
import { ServicesSectionHeading } from "@/components/pages/services/ServicesSectionHeading";
import { SERVICES_PAGE } from "@/utils/constant";

const { faq } = SERVICES_PAGE;

export function ServicesFaqSection() {
  return (
    <section
      id="faq"
      aria-labelledby="services-faq-title"
      className="svc-anchor svc-section-warm bg-svc-page-bg py-16 sm:py-20 lg:py-28"
    >
      <div className="mx-auto w-full max-w-[880px] px-4 sm:px-6 lg:px-8">
        <ServicesSectionHeading
          eyebrow={faq.eyebrow}
          title={faq.title}
          subtitle={faq.subtitle}
          headingId="services-faq-title"
        />

        <ServicesReveal className="mt-10 lg:mt-14">
          <ServicesFaqAccordion items={faq.items} />
        </ServicesReveal>
      </div>
    </section>
  );
}
