"use client";

import { useEffect, useRef } from "react";

type ServicesRevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Stagger inside a group. Keep totals under ~400ms so long grids never drag. */
  delayMs?: number;
};

/**
 * Fade-up-on-scroll wrapper.
 *
 * Deliberately a thin client shell: `children` stay server-rendered and arrive
 * through the RSC payload, so the marketing copy never lands in the JS bundle.
 * Visibility is a class toggled straight on the node rather than React state —
 * there is nothing to re-render, and it keeps this a one-way write to the DOM.
 * The hidden initial state lives in CSS (`.svc-reveal`) and is overridden for
 * no-JS visitors by the <noscript> block on the page.
 */
export function ServicesReveal({
  children,
  className = "",
  delayMs = 0,
}: ServicesRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      node.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          node.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`svc-reveal${className ? ` ${className}` : ""}`}
      style={delayMs ? { animationDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}
