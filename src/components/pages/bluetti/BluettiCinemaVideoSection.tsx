"use client";

import { useCallback, useRef } from "react";
import { BLUETTI_EP2000_CINEMA_VIDEO } from "@/utils/constant";

export function BluettiCinemaVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const {
    headingLine1,
    headingLine2,
    ctaLabel,
    videoSrcMp4,
    videoAriaLabel,
  } = BLUETTI_EP2000_CINEMA_VIDEO;

  const handleWatchVideo = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = false;
    void el.play().catch(() => {
      /* ignore — browser may still block until further gesture */
    });
  }, []);

  return (
    <section
      className="relative isolate flex min-h-dvh w-full items-center justify-center overflow-hidden bg-black"
      aria-labelledby="bluetti-cinema-heading"
    >
      <video
        ref={videoRef}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-label={videoAriaLabel}
      >
        <source src={videoSrcMp4} type="video/mp4" />
      </video>

      <div
        className="pointer-events-none absolute inset-0 z-1 bg-bluetti-cinema-overlay"
        aria-hidden
      />

      <div className="relative z-2 flex w-full max-w-4xl flex-col items-center px-4 py-16 text-center sm:px-6">
        <h2 id="bluetti-cinema-heading" className="bluetti-cinema-heading">
          <span className="block">{headingLine1}</span>
          <span className="block">{headingLine2}</span>
        </h2>
        <button
          type="button"
          onClick={handleWatchVideo}
          className="mt-8 rounded-xl bg-bluetti-cinema-cta-bg px-8 py-3.5 font-inter text-base font-semibold text-bluetti-cinema-cta-text shadow-sm transition hover:brightness-105 sm:px-10 sm:text-lg"
        >
          {ctaLabel}
        </button>
      </div>
    </section>
  );
}
