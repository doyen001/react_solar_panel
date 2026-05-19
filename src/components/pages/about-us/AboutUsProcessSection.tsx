import Image from "next/image";

import { ABOUT_US_PAGE } from "@/utils/constant";

export function AboutUsProcessSection() {
  return (
    <section className="relative min-h-[1076px] w-full overflow-hidden py-16 lg:py-[77px]">
      <Image
        src={ABOUT_US_PAGE.process.backgroundImageSrc}
        alt={ABOUT_US_PAGE.process.backgroundImageAlt}
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-about-process-overlay" aria-hidden />

      <div className="relative z-1 mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:gap-9 lg:px-[90px]">
        <div className="flex w-full max-w-[395px] shrink-0 items-center justify-center rounded-[23.641px] border-[3.546px] border-about-process-title-card-border bg-about-process-title-card-bg px-6 py-10 shadow-[0_30.271px_60.542px_-14.53px_rgba(0,0,0,0.25)] lg:min-h-[163px] lg:self-center">
          <h2 className="text-center font-source-sans text-[32px] font-medium leading-normal tracking-[-0.92px] text-about-process-text sm:text-[46px]">
            {ABOUT_US_PAGE.process.title}
          </h2>
        </div>

        <div className="w-full flex-1 rounded-[30px] bg-about-process-panel-bg p-6 sm:p-9 lg:max-w-[846px]">
          <ol className="flex flex-col">
            {ABOUT_US_PAGE.process.steps.map((step, index) => (
              <li
                key={step.title}
                className={`flex flex-col gap-5 pb-[22px] ${
                  index < ABOUT_US_PAGE.process.steps.length - 1
                    ? "mb-0 border-b border-about-process-step-border"
                    : ""
                }`}
              >
                <h3 className="font-source-sans text-[26px] font-medium leading-normal tracking-[-0.4395px] text-about-process-text">
                  {step.title}
                </h3>
                <ul className="list-disc pl-[27px]">
                  <li className="font-source-sans text-lg font-normal leading-normal tracking-[-0.4395px] text-about-process-text">
                    {step.body}
                  </li>
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
