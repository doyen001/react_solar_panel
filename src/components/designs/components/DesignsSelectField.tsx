"use client";

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={21}
      height={21}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="#2094F3"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export type DesignsSelectOption = { value: string; label: string };

export type DesignsSelectFieldProps = {
  id: string;
  ariaLabel: string;
  placeholder: string;
  value: string;
  options: DesignsSelectOption[];
  onChange: (value: string) => void;
  className?: string;
};

/**
 * Figma 3:4436 — white field, 2px #2094F3 border, 10px radius, 49px height;
 * Inter semibold 14px / #020202 / tracking -0.1504px; chevron right.
 */
export function DesignsSelectField({
  id,
  ariaLabel,
  placeholder,
  value,
  options,
  onChange,
  className,
}: DesignsSelectFieldProps) {
  return (
    <div className={`relative w-full ${className ?? ""}`}>
      <select
        id={id}
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-[49px] w-full cursor-pointer appearance-none rounded-[10px] border-2 border-[#2094F3] bg-white py-0 pl-[18px] pr-[42px] font-inter text-[14px] font-semibold leading-normal tracking-[-0.1504px] text-[#020202] outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-[14px] top-1/2 -translate-y-1/2">
        <ChevronDown />
      </span>
    </div>
  );
}
