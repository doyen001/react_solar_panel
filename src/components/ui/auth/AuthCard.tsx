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
      className={`rounded-[24px] bg-linear-to-r from-auth-card-from to-auth-card-to overflow-hidden ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

