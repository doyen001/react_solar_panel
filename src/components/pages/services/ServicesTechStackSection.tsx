import { ServicesReveal } from "@/components/pages/services/ServicesReveal";
import { ServicesSectionHeading } from "@/components/pages/services/ServicesSectionHeading";
import { SERVICES_PAGE } from "@/utils/constant";

const { techStack } = SERVICES_PAGE;

export function ServicesTechStackSection() {
  return (
    <section
      id="technology"
      aria-labelledby="services-tech-title"
      className="svc-anchor bg-svc-page-bg py-16 sm:py-20 lg:py-28"
    >
      <div className="mx-auto w-full max-w-[1226px] px-4 sm:px-6 lg:px-8">
        <ServicesSectionHeading
          eyebrow={techStack.eyebrow}
          title={techStack.title}
          subtitle={techStack.subtitle}
          headingId="services-tech-title"
        />

        <div className="mt-12 flex flex-col gap-10 lg:mt-16">
          {techStack.groups.map((group, groupIndex) => (
            <ServicesReveal
              key={group.id}
              delayMs={Math.min(groupIndex, 4) * 70}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center gap-4">
                <h3 className="font-inter text-xs font-semibold uppercase tracking-[0.14em] text-svc-muted">
                  {group.label}
                </h3>
                <span
                  aria-hidden="true"
                  className="h-px flex-1 bg-svc-border"
                />
              </div>

              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {group.items.map((tech) => (
                  <li key={tech.name}>
                    <div className="svc-card svc-lift flex items-center gap-3 rounded-xl px-4 py-3.5">
                      <span
                        aria-hidden="true"
                        className="svc-icon-well inline-flex size-9 shrink-0 items-center justify-center rounded-lg font-outfit text-[13px] font-bold"
                      >
                        {tech.abbr}
                      </span>
                      <span className="truncate font-inter text-sm font-medium text-svc-ink">
                        {tech.name}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </ServicesReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
