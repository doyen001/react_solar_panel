import { ServicesReveal } from "@/components/pages/services/ServicesReveal";
import { ServicesSectionHeading } from "@/components/pages/services/ServicesSectionHeading";
import Icon from "@/components/ui/Icons";
import { SERVICES_PAGE } from "@/utils/constant";

const { testimonials } = SERVICES_PAGE;

export function ServicesTestimonialsSection() {
  return (
    <section
      id="testimonials"
      aria-labelledby="services-testimonials-title"
      className="svc-anchor bg-svc-page-bg py-16 sm:py-20 lg:py-28"
    >
      <div className="mx-auto w-full max-w-[1226px] px-4 sm:px-6 lg:px-8">
        <ServicesSectionHeading
          eyebrow={testimonials.eyebrow}
          title={testimonials.title}
          subtitle={testimonials.subtitle}
          headingId="services-testimonials-title"
        />

        <ul className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-3">
          {testimonials.items.map((item, index) => (
            <li key={item.id} className="flex">
              <ServicesReveal delayMs={index * 80} className="flex w-full">
                <figure className="svc-card svc-lift flex h-full w-full flex-col gap-5 rounded-2xl p-7">
                  <div
                    className="flex items-center gap-1"
                    role="img"
                    aria-label={`Rated ${item.rating} out of 5`}
                  >
                    {Array.from({ length: item.rating }, (_, star) => (
                      <Icon
                        key={star}
                        name="Star"
                        className="size-4 text-svc-gold"
                      />
                    ))}
                  </div>

                  <blockquote className="flex-1">
                    <p className="font-dm-sans text-[15px] leading-7 text-svc-body">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </blockquote>

                  <figcaption className="flex items-center gap-3 border-t border-svc-border-soft pt-5">
                    <span
                      aria-hidden="true"
                      className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-svc-ink font-outfit text-sm font-bold text-white"
                    >
                      {item.initials}
                    </span>
                    <span className="flex flex-col">
                      <span className="font-outfit text-[15px] font-semibold leading-5 text-svc-ink">
                        {item.name}
                      </span>
                      <span className="font-inter text-[13px] leading-5 text-svc-muted">
                        {item.role}, {item.company}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </ServicesReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
