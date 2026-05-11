"use client";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import Image from "next/image";
import type { Options } from "@splidejs/splide";
import { BLUETTI_EP2000_SAFETY_SECTION } from "@/utils/constant";

const SAFETY_SPLIDE_OPTIONS: Options = {
  type: "slide",
  rewind: true,
  gap: "1rem",
  autoWidth: true,
  pagination: true,
  arrows: true,
  speed: 500,
  i18n: {
    prev: "Previous safety feature",
    next: "Next safety feature",
  },
};

export function BluettiSafetySection() {
  const { heading, description, diagram, slides } = BLUETTI_EP2000_SAFETY_SECTION;

  return (
    <section
      className="padding-section bg-bluetti-safety-section-bg"
      aria-labelledby="bluetti-safety-heading"
    >
      <div className="container-large">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <div className="order-2 flex justify-center lg:order-1">
            <Image
              src={diagram.src}
              alt={diagram.alt}
              width={diagram.width}
              height={diagram.height}
              className="h-auto w-full max-w-[min(100%,707px)] object-contain"
              sizes="(min-width: 1024px) 40vw, 100vw"
              priority
            />
          </div>
          <div className="order-1 lg:order-2 lg:text-left">
            <h2
              id="bluetti-safety-heading"
              className="bluetti-safety-heading text-center lg:text-left"
            >
              {heading}
            </h2>
            <p className="mx-auto mt-5 max-w-xl font-inter text-base leading-relaxed text-bluetti-safety-body sm:text-lg lg:mx-0">
              {description}
            </p>
          </div>
        </div>

        <Splide
          className="bluetti-safety-splide mt-12 md:mt-14 lg:mt-16"
          options={SAFETY_SPLIDE_OPTIONS}
          aria-label="BLUETTI EP2000 six-layer safety highlights"
        >
          {slides.map((slide) => (
            <SplideSlide
              key={slide.id}
              className={
                slide.wide
                  ? "bluetti-safety-slide--wide"
                  : "bluetti-safety-slide--normal"
              }
            >
              <div className="flex flex-col">
                <div className="relative h-[400px] w-full overflow-hidden rounded-2xl sm:h-[450px]">
                  <Image
                    src={slide.imageSrc}
                    alt={slide.imageAlt}
                    fill
                    sizes={
                      slide.wide
                        ? "(max-width: 639px) 92vw, 560px"
                        : "(max-width: 639px) 72vw, 280px"
                    }
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <p className="mt-4 px-3 font-inter text-lg font-bold text-bluetti-safety-card-title">
                  {slide.title}
                </p>
              </div>
            </SplideSlide>
          ))}
        </Splide>
      </div>
    </section>
  );
}
