"use client";

import { useEffect, useRef } from "react";

type ServicesProcessStageProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Arms the timeline choreography.
 *
 * All this does is add `.is-running` once the timeline scrolls into view — the
 * rail draw, marker pops, pulse rings, and copy stagger are pure CSS keyed off
 * that class and each step's `--svc-i` index. Keeping the sequencing in CSS
 * means no JS timers to drift, no re-renders, and the seven steps stay
 * server-rendered inside this client shell.
 */
export function ServicesProcessStage({
  children,
  className = "",
}: ServicesProcessStageProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      node.classList.add("is-running");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          node.classList.add("is-running");
          observer.disconnect();
        }
      },
      // Waits until a decent slice is on screen so the run is not half-missed.
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`svc-process ${className}`}>
      {children}
    </div>
  );
}
