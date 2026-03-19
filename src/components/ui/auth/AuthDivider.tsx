"use client";

export function AuthDivider({ label }: { label: string }) {
  return (
    <div className="flex h-[16px] w-full items-center gap-[12px] px-[8px]">
      <div className="h-px flex-1 bg-linear-to-r from-auth-outline to-[#ff3c3c]" />
      <span className="font-source-sans text-[12px] leading-[16px] text-(--color-auth-subtle-50)">
        {label}
      </span>
      <div className="h-px flex-1 bg-linear-to-r from-auth-outline to-[#ff3c3c]" />
    </div>
  );
}

