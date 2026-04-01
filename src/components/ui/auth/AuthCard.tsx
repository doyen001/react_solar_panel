"use client";

import type { ReactNode } from "react";

export function AuthCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[24px] bg-linear-to-r from-yellow-lemon to-orange-amber overflow-hidden ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

