"use client";

import { useEffect, useRef } from "react";

type ServicesCounterProps = {
  value: number;
  suffix?: string;
  /** Full phrase read by screen readers instead of the ticking digits. */
  srLabel: string;
  durationMs?: number;
  className?: string;
};

/**
 * Counts up once, the first time the number scrolls into view.
 *
 * The digits are written straight to the DOM node instead of through state:
 * a 1.6s count-up is ~96 frames, and re-rendering the React tree on every one
 * of them buys nothing. Server-rendered markup already carries the final value,
 * so no-JS visitors and crawlers see the real number.
 */
export function ServicesCounter({
  value,
  suffix = "",
  srLabel,
  durationMs = 1600,
  className = "",
}: ServicesCounterProps) {
  const hostRef = useRef<HTMLSpanElement | null>(null);
  const digitsRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    const digits = digitsRef.current;
    if (!host || !digits) return;

    const write = (current: number) => {
      digits.textContent = `${current}${suffix}`;
    };

    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      write(value);
      return;
    }

    // Reset to zero up front; the observer decides when the run begins.
    write(0);

    let frame = 0;
    let cancelled = false;

    const animate = () => {
      const start = performance.now();
      const tick = (now: number) => {
        if (cancelled) return;
        const progress = Math.min(1, (now - start) / durationMs);
        // easeOutExpo — fast start, long settle, reads as "landing" on a value.
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        write(Math.round(value * eased));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          animate();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(host);

    return () => {
      cancelled = true;
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, suffix, durationMs]);

  return (
    <span ref={hostRef} className={className}>
      <span ref={digitsRef} aria-hidden="true">
        {value}
        {suffix}
      </span>
      <span className="sr-only">{srLabel}</span>
    </span>
  );
}
