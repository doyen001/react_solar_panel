"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import solarDesignLogo from "@/components/ui/Icons/solarDesignLogo.svg";

const features = [
  {
    icon: "/images/home/hero-feature-sun.svg",
    title: "Solar Generation",
    sub: "Harness the sun",
  },
  {
    icon: "/images/home/hero-feature-bolt.svg",
    title: "Smart Storage",
    sub: "EP760 & EP2000",
  },
  {
    icon: "/images/home/hero-feature-home.svg",
    title: "Home Power",
    sub: "24/7 backup",
  },
  {
    icon: "/images/home/hero-feature-ev.svg",
    title: "EV Ready",
    sub: "Charge overnight",
  },
  {
    icon: "/images/home/hero-feature-shield.svg",
    title: "Dual Core Safety Guard",
    sub: "Advanced protection",
  },
];

const slides = [
  { type: "video" as const, src: "/videos/homeHero.mp4" },
  { type: "image" as const, src: "/images/home/hero-slide-2.png" },
  { type: "image" as const, src: "/images/home/hero-slide-3.png" },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const goToSlide = useCallback(
    (index: number) => {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      setCurrentSlide(index);
      if (index !== 0 && !videoEnded) setVideoEnded(true);
    },
    [videoEnded],
  );

  useEffect(() => {
    if (currentSlide === 0 && videoEnded && videoRef.current) {
      videoRef.current.currentTime = 0;
      void videoRef.current.play();
      setTimeout(() => {
        setVideoEnded(false);
      }, 100);
    }
  }, [currentSlide, videoEnded]);

  const handleVideoEnd = useCallback(() => {
    setVideoEnded(true);
    setCurrentSlide(1);
  }, []);

  return (
    <section className="relative min-h-[760px] w-full overflow-hidden sm:h-[716px] sm:min-h-0">
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === currentSlide ? "z-1 opacity-100" : "z-0 opacity-0"
          }`}
        >
          {slide.type === "video" ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              onEnded={handleVideoEnd}
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src={slide.src} type="video/mp4" />
            </video>
          ) : (
            <Image
              src={slide.src}
              alt="Solar installation"
              fill
              className="object-cover"
              priority={i === 1}
            />
          )}
        </div>
      ))}

      {/* Overlay content */}
      <div className="relative z-2 flex h-full flex-col justify-between max-w-[1400px] mx-auto px-4 pb-6 pt-24 sm:px-8 sm:pt-[92px] lg:px-8">
        {/* Main content */}
        <div className="max-w-[813px] rounded-[14px] py-5 sm:py-[20px]">
          <div className="flex flex-col gap-8 sm:gap-10">
            <div className="flex flex-col gap-5 sm:gap-8">
              <div className="flex flex-col gap-[19px]">
                {/* Badge */}
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[rgba(96,165,250,0.92)] bg-[rgba(59,130,246,0.2)] px-4 py-[9px] backdrop-blur-sm">
                  <Image
                    src="/images/home/hero-badge-icon.svg"
                    alt=""
                    width={16}
                    height={16}
                  />
                  <span className="font-source-sans text-sm font-medium text-[#02475a]">
                    Australia&apos;s Trusted Solar Partner
                  </span>
                </div>

                {/* Heading */}
                <h1 className="font-outfit text-[2.25rem] font-bold leading-none tracking-[-1.2px] text-black drop-shadow-[0_3.5px_5.9px_rgba(0,0,0,0.26)] sm:text-[52px] sm:tracking-[-1.56px]">
                  Power Your Home with
                  <br />
                  <span className="text-[#efad06]">Premium </span>
                  <span className="bg-linear-to-r from-[#2094f3] to-[#17cfcf] bg-clip-text text-transparent">
                    BLUETTI
                  </span>
                  <br />
                  Energy Storage
                </h1>

                {/* Subtext */}
                <p className="max-w-[551px] font-source-sans text-base leading-relaxed text-black drop-shadow-[0_3.8px_14.4px_white] sm:text-[23px] sm:leading-normal sm:tracking-[-0.46px]">
                  Easylink Solar installations by Solar Accreditation Australia
                  Accredited Professional Installers.
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
                  <Image src={solarDesignLogo} alt="" width={37} height={37} />
                  <span>Solar Design</span>
                  <Image
                    src="/images/home/hero-arrow-right.svg"
                    alt=""
                    width={17}
                    height={17}
                  />
                </button>
                <button className="rounded-xl border-2 border-[rgba(2,132,197,0.6)] bg-white px-6 py-3 font-source-sans text-base font-medium text-[#1cb0e2] backdrop-blur-sm">
                  Explore Products
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-source-sans text-base font-medium">
              <div className="flex items-center gap-2">
                <span className="text-[#0f1729]">11,000+</span>
                <span className="text-[rgba(15,23,41,0.8)]">
                  quotes created
                </span>
              </div>
              <div className="h-[17px] w-px bg-[#0f1729]" />
              <div className="flex items-center gap-2">
                <span className="text-[#0f1729]">500+</span>
                <span className="text-[rgba(15,23,41,0.8)]">
                  certified installers
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom area: feature bar + nav */}
        <div className="flex flex-col gap-4">
          {/* Feature bar */}
          <div className="hidden gap-[15px] overflow-x-auto pb-1 md:flex">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex shrink-0 items-center gap-4 rounded-[11px] border border-[rgba(200,211,223,0.5)] bg-[rgba(248,250,252,0.6)] px-4 py-3 backdrop-blur-[11px]"
                style={{ width: 247, height: 70 }}
              >
                <div
                  className="flex size-[38px] items-center justify-center rounded-lg"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #efad06 0%, rgba(239,173,6,0.8) 100%)",
                  }}
                >
                  <Image src={f.icon} alt="" width={19} height={19} />
                </div>
                <div>
                  <p className="font-source-sans text-sm font-semibold text-[#0f1729]">
                    {f.title}
                  </p>
                  <p className="font-source-sans text-xs text-[rgba(15,23,41,0.6)]">
                    {f.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`size-3 rounded-full transition-colors ${
                  i === currentSlide
                    ? "bg-[#efad06]"
                    : "bg-[rgba(15,23,41,0.3)]"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => goToSlide(currentSlide - 1)}
        className="absolute left-3 top-1/2 z-3 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(200,211,223,0.5)] bg-[rgba(248,250,252,0.6)] backdrop-blur-[15px] transition-colors hover:bg-[rgba(248,250,252,0.8)] sm:left-[19px] sm:size-[54px]"
        aria-label="Previous slide"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1e293b"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        onClick={() => goToSlide(currentSlide + 1)}
        className="absolute right-3 top-1/2 z-3 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(200,211,223,0.5)] bg-[rgba(248,250,252,0.6)] backdrop-blur-[15px] transition-colors hover:bg-[rgba(248,250,252,0.8)] sm:right-[19px] sm:size-[54px]"
        aria-label="Next slide"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1e293b"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </section>
  );
}
