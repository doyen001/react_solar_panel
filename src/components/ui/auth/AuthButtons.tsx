"use client";

import type { ReactNode } from "react";

export function AuthPrimaryButton({
  icon,
  label,
  onClick,
  borderVariant = "solid",
  type = "button",
}: {
  icon?: ReactNode;
  label: string;
  onClick?: () => void;
  borderVariant?: "solid" | "gradient";
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="relative h-[48px] w-full rounded-[14px] text-center shadow-[0px_4px_15px_0px_rgba(180,120,30,0.3)]"
    >
      <span
        className={`pointer-events-none absolute inset-0 rounded-[inherit] ${
          borderVariant === "gradient"
            ? "bg-linear-to-r from-auth-outline to-[#ff3c3c]"
            : "bg-auth-outline"
        }`}
      />
      <span className="pointer-events-none absolute inset-[2px] rounded-[12px] bg-auth-card-from" />
      <span className="absolute left-1/2 top-[10px] flex -translate-x-1/2 items-center gap-[8px]">
        {icon ? <span className="text-black">{icon}</span> : null}
        <span className="font-source-sans text-[16px] font-bold leading-[24px] tracking-[-0.3125px] text-black">
          {label}
        </span>
      </span>
      <span className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.5)]" />
    </button>
  );
}

export function AuthGhostButton({
  label,
  onClick,
  width = 180,
}: {
  label: string;
  onClick?: () => void;
  width?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-[41.257px] rounded-[14px] border border-auth-outline bg-auth-ghost"
      style={{ width }}
    >
      <span className="font-source-sans text-[14px] font-medium leading-[20px] tracking-[-0.1504px] text-(--color-auth-subtle-80)">
        {label}
      </span>
    </button>
  );
}

