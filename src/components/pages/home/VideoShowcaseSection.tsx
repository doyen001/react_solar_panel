"use client";

import { useState } from "react";

const slides = [
  { type: "video" as const, src: "/videos/solarWall.mp4" },
  { type: "video" as const, src: "/videos/solarWall.mp4" },
  { type: "video" as const, src: "/videos/solarWall.mp4" },
];

export function VideoShowcaseSection() {
  const [current, setCurrent] = useState(0);

  return (
    <section
      className="relative min-h-[260px] w-full overflow-hidden sm:min-h-[420px]"
      style={{ aspectRatio: "1440/733" }}
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={slide.src} type="video/mp4" />
          </video>
        </div>
      ))}

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2 sm:bottom-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`size-3 rounded-full transition-colors ${
              i === current ? "bg-[#05afd1]" : "bg-[rgba(15,23,41,0.47)]"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
