"use client";
import classNames from "classnames";
import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";

export type VideoSliderSlide =
  | {
      type: "video";
      src: string;
      poster?: string;
    }
  | {
      type: "image";
      src: string;
      alt: string;
      priority?: boolean;
    };

export function VideoSlider({
  slides,
  children,
  overlayClassName,
}: {
  slides: VideoSliderSlide[];
  children?: React.ReactNode;
  /** Merged onto the overlay wrapper (e.g. less top padding when there is no hero title). */
  overlayClassName?: string;
}) {
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
    [videoEnded, slides],
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
    <>
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
      <div
        className={classNames(
          "relative z-2 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-4 pb-6 pt-24 sm:px-8 sm:pt-[92px] lg:px-8",
          overlayClassName,
        )}
      >
        <div className="flex flex-col gap-4">
          {children}

          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`size-3 rounded-full transition-colors ${
                  i === currentSlide
                    ? "bg-gold"
                    : "bg-slate-ink/30"
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
        className="absolute left-3 top-1/2 z-3 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-7/50 bg-surface-50/60 backdrop-blur-[15px] transition-colors hover:bg-surface-50/80 sm:left-[19px] sm:size-[54px]"
        aria-label="Previous slide"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-slate-800"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        onClick={() => goToSlide(currentSlide + 1)}
        className="absolute right-3 top-1/2 z-3 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-7/50 bg-surface-50/60 backdrop-blur-[15px] transition-colors hover:bg-surface-50/80 sm:right-[19px] sm:size-[54px]"
        aria-label="Next slide"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-slate-800"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </>
  );
}
