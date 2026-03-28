import { initialsFromPersonName } from "@/lib/customer/initialsFromName";

const sizeClasses = {
  xs: "size-[18px] text-[7px] font-bold leading-[10.5px]",
  sm: "size-8 text-[10px] font-semibold leading-[15px] tracking-wide",
  md: "size-8 text-[11px] font-semibold leading-4",
  lg: "size-16 text-xl font-bold leading-[30px] tracking-[-0.45px]",
} as const;

const variantClasses = {
  navy: "bg-gradient-to-b from-[#09234a] to-[#304566] text-white",
  gradient: "bg-gradient-to-b from-[#ffef62] to-[#f78d00] text-[#1c1a17]",
  orange: "bg-[#f78d00] text-white",
} as const;

type Props = {
  firstName?: string | null;
  lastName?: string | null;
  /** When set, skips name-based initials (e.g. org “SM”, “ES”). */
  initialsOverride?: string;
  size?: keyof typeof sizeClasses;
  variant?: keyof typeof variantClasses;
  className?: string;
  "aria-label"?: string;
};

export function CustomerAvatar({
  firstName,
  lastName,
  initialsOverride,
  size = "md",
  variant = "navy",
  className = "",
  "aria-label": ariaLabel,
}: Props) {
  const raw =
    initialsOverride?.trim() ||
    initialsFromPersonName(firstName, lastName);
  const text = raw.slice(0, 2).toUpperCase();

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-[family-name:var(--font-inter)] ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      aria-label={ariaLabel ?? `Avatar ${text}`}
      role="img"
    >
      {text}
    </div>
  );
}
