import { ServicesProcessStage } from "@/components/pages/services/ServicesProcessStage";
import { ServicesSectionHeading } from "@/components/pages/services/ServicesSectionHeading";
import { SERVICES_PAGE } from "@/utils/constant";

const { process } = SERVICES_PAGE;

export function ServicesProcessSection() {
  return (
    <section
      id="process"
      aria-labelledby="services-process-title"
      className="svc-anchor bg-svc-page-bg py-16 sm:py-20 lg:py-28"
    >
      <div className="mx-auto w-full max-w-[1226px] px-4 sm:px-6 lg:px-8">
        <ServicesSectionHeading
          eyebrow={process.eyebrow}
          title={process.title}
          subtitle={process.subtitle}
          headingId="services-process-title"
        />

        <ServicesProcessStage className="relative mt-12 lg:mt-20">
          {/* Connecting rail: vertical on small screens, horizontal from lg up.
              Track sits under a fill that draws itself as the section arrives. */}
          <div
            aria-hidden="true"
            className="absolute left-[19px] top-2 h-[calc(100%-1rem)] w-0.5 lg:hidden"
          >
            <span className="svc-rail-track absolute inset-0 rounded-full" />
            <span className="svc-rail-v-fill absolute left-0 top-0 w-full rounded-full" />
          </div>
          <div
            aria-hidden="true"
            className="absolute left-0 top-[19px] hidden h-0.5 w-full lg:block"
          >
            <span className="svc-rail-track absolute inset-0 rounded-full" />
            <span className="svc-rail-h-fill absolute left-0 top-0 h-full rounded-full" />
          </div>

          <ol className="relative grid gap-8 lg:grid-cols-7 lg:gap-4">
            {process.steps.map((step, index) => (
              <li
                key={step.id}
                className="svc-step relative"
                // Drives this step's slot in the staggered sequence.
                style={{ "--svc-i": index } as React.CSSProperties}
              >
                <div className="flex gap-5 lg:flex-col lg:gap-0">
                  <span
                    aria-hidden="true"
                    className="svc-step-marker-wrap relative flex size-10 shrink-0 items-center justify-center"
                  >
                    <span className="svc-step-pulse absolute inset-0 rounded-full" />
                    <span className="svc-step-marker relative flex size-10 items-center justify-center rounded-full font-outfit text-[13px] font-bold text-white">
                      {step.step}
                    </span>
                  </span>

                  <div className="svc-step-body flex flex-col gap-1.5 pb-2 lg:pt-6">
                    <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.12em] text-svc-accent-text">
                      {step.duration}
                    </p>
                    <h3 className="svc-step-title font-outfit text-base font-semibold leading-6 text-svc-ink">
                      {step.title}
                    </h3>
                    <p className="font-dm-sans text-[14px] leading-6 text-svc-body">
                      {step.description}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </ServicesProcessStage>
      </div>
    </section>
  );
}
