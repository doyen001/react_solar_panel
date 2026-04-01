"use client";

import Image from "next/image";
import { FeatureBarOfHero } from "../../modules/FeatureBarOfHero";
import { VideoSlider } from "../../ui/VideoSlider";

const slides = [
  { type: "video" as const, src: "/videos/homeHero.mp4" },
  {
    type: "image" as const,
    src: "/images/home/hero-slide-2.png",
    alt: "Solar installation",
  },
  {
    type: "image" as const,
    src: "/images/home/hero-slide-3.png",
    alt: "Solar installation",
  },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[760px] w-full overflow-hidden sm:h-[716px] sm:min-h-0">
      {/* Slides */}
      <VideoSlider slides={slides}>
        {/* Overlay content */}
        <div className="relative z-2 flex h-full flex-col justify-between max-w-[1400px] mx-auto px-4 pb-6 pt-24 sm:px-8 sm:pt-[92px] lg:px-8">
          {/* Main content */}
          <div className="max-w-[813px] rounded-[14px] py-5 sm:py-[20px]">
            <div className="flex flex-col gap-8 sm:gap-10">
              <div className="flex flex-col gap-5 sm:gap-8">
                <div className="flex flex-col gap-[19px]">
                  {/* Badge */}
                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-facebook/92 bg-facebook/20 px-4 py-[9px] backdrop-blur-sm">
                    <Image
                      src="/images/home/hero-badge-icon.svg"
                      alt=""
                      width={16}
                      height={16}
                    />
                    <span className="font-source-sans text-sm font-medium text-teal-deep">
                      Australia&apos;s Trusted Solar Partner
                    </span>
                  </div>

                  {/* Heading */}
                  <h1 className="font-outfit text-[2.25rem] font-bold leading-none tracking-[-1.2px] text-primary-yellow drop-shadow-[0_3.5px_5.9px_rgba(0,0,0,0.26)] sm:text-[52px] sm:tracking-[-1.56px]">
                    <span className="[text-shadow:0_0_8px_white]">
                      Power Your Home with
                    </span>
                    <br />
                    <span className="text-primary-yellow [text-shadow:0_0_8px_white]">
                      Premium{" "}
                    </span>
                    <span className="bg-linear-to-r from-brand-blue to-brand-teal bg-clip-text text-transparent">
                      BLUETTI
                    </span>
                    <br />
                    <span className="[text-shadow:0_0_8px_white]">
                      Energy Storage
                    </span>
                  </h1>

                  {/* Subtext */}
                  <p className="max-w-[551px] font-source-sans text-base leading-relaxed text-tangerine drop-shadow-[0_3.8px_14.4px_var(--color-violet-accent)] sm:text-[23px] sm:leading-normal sm:tracking-[-0.46px] font-bold [text-shadow:0_0_15px_white]">
                    Easylink Solar installations by Solar Accreditation
                    Australia Accredited Professional Installers.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    className="flex items-center gap-2 rounded-xl px-2 py-[7.5px] text-base font-semibold text-white shadow-[0_0_40px_rgba(32,148,243,0.3)]"
                    style={{
                      backgroundImage:
                        "linear-gradient(156deg, #5474eb 16%, #ff3c3c 100%)",
                    }}
                  >
                    <Image
                      src="/images/solarDesignLogo.png"
                      alt=""
                      width={37}
                      height={37}
                    />
                    <span>Solar Design</span>
                    <Image
                      src="/images/home/hero-arrow-right.svg"
                      alt=""
                      width={17}
                      height={17}
                    />
                  </button>
                  <button className="rounded-xl border-2 border-ocean/60 bg-white px-6 py-3 font-source-sans text-base font-medium text-sky-brand backdrop-blur-sm">
                    Explore Products
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-source-sans text-base font-medium">
                <div className="flex items-center gap-2">
                  <span className="text-slate-ink">11,000+</span>
                  <span className="text-slate-ink/80">quotes created</span>
                </div>
                <div className="h-[17px] w-px bg-slate-ink" />
                <div className="flex items-center gap-2">
                  <span className="text-slate-ink">500+</span>
                  <span className="text-slate-ink/80">
                    certified installers
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom area: feature bar + nav */}
          <div className="flex flex-col gap-4">
            {/* Feature bar */}
            <FeatureBarOfHero />
          </div>
        </div>
      </VideoSlider>
    </section>
  );
}
