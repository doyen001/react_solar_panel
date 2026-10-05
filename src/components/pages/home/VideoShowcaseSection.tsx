"use client";

import { useEffect, useRef, useState } from "react";

const slides = [
  { type: "video" as const, src: "/videos/solarWall.mp4" },
  { type: "video" as const, src: "/videos/solarWall.mp4" },
  { type: "video" as const, src: "/videos/solarWall.mp4" },
];

export function VideoShowcaseSection() {
  const [current, setCurrent] = useState(0);
  // The clip is ~12 MB and this section sits below the fold, so nothing is
  // fetched until it scrolls into view. Previously all three slides rendered
  // their own <video autoPlay> of the same file at once — three concurrent
  // downloads of the same 12 MB before the visitor had scrolled to any of it.
  const sectionRef = useRef<HTMLElement>(null);
  // No IntersectionObserver (very old browser) — just show it; there's no
  // way to defer loading without one anyway.
  const [inView, setInView] = useState(
    () => typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || inView || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setInView(true);
      },
      // Start fetching slightly before it's on screen so playback has
      // buffered by the time it is.
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [inView]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[260px] w-full overflow-hidden bg-slate-ink/10 sm:min-h-[420px]"
      style={{ aspectRatio: "1440/733" }}
    >
      {inView ? (
        <video
          // Only remounts (and refetches) when the active slide is a
          // genuinely different file.
          key={slides[current].src}
          src={slides[current].src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2 sm:bottom-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`size-3 rounded-full transition-colors ${
              i === current ? "bg-primary" : "bg-slate-ink/47"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
