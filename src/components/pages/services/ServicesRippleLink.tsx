"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";

type Ink = { id: number; x: number; y: number; size: number };

type ServicesRippleLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  /** Use the light-on-dark focus ring when the button sits on a dark surface. */
  onDark?: boolean;
  ariaLabel?: string;
};

/**
 * CTA link with a material-style ripple originating at the pointer.
 * The ripple element is removed on animation end, so no nodes accumulate;
 * `prefers-reduced-motion` hides it entirely via CSS.
 */
export function ServicesRippleLink({
  href,
  children,
  className = "",
  onDark = false,
  ariaLabel,
}: ServicesRippleLinkProps) {
  const [inks, setInks] = useState<Ink[]>([]);
  const nextId = useRef(0);

  const spawnInk = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    // Keyboard "clicks" report 0,0 — centre the ripple instead of cornering it.
    const isPointer = event.clientX !== 0 || event.clientY !== 0;
    const size = Math.max(rect.width, rect.height);
    const x = isPointer ? event.clientX - rect.left : rect.width / 2;
    const y = isPointer ? event.clientY - rect.top : rect.height / 2;
    const id = nextId.current++;

    setInks((current) => [...current, { id, x, y, size }]);
  }, []);

  const removeInk = useCallback((id: number) => {
    setInks((current) => current.filter((ink) => ink.id !== id));
  }, []);

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      onClick={spawnInk}
      className={`svc-ripple ${onDark ? "svc-focusable-dark" : "svc-focusable"} ${className}`}
    >
      {inks.map((ink) => (
        <span
          key={ink.id}
          aria-hidden="true"
          className="svc-ripple-ink"
          style={{
            left: ink.x - ink.size / 2,
            top: ink.y - ink.size / 2,
            width: ink.size,
            height: ink.size,
          }}
          onAnimationEnd={() => removeInk(ink.id)}
        />
      ))}
      {children}
    </Link>
  );
}
