import { initialsFromPersonName } from "@/lib/customer/initialsFromName";

const sizeClasses = {
  xs: "size-[18px] text-[7px] font-bold leading-[10.5px]",
  sm: "size-8 text-[10px] font-semibold leading-[15px] tracking-wide",
  md: "size-8 text-[11px] font-semibold leading-4",
  lg: "size-16 text-xl font-bold leading-[30px] tracking-[-0.45px]",
} as const;

const variantClasses = {
  navy: "bg-linear-to-b from-navy-800 to-blue-slate text-white",
  gradient: "bg-linear-to-b from-yellow-lemon to-orange-amber text-warm-black",
  orange: "bg-orange-amber text-white",
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
  // No name to work with — during the brief window where the session is valid
  // but the profile has not loaded back into Redux yet, and for any record
  // genuinely missing a name. A silhouette reads as "your account" where the
  // helper's literal "??" reads as a bug.
  const hasName = Boolean(
    initialsOverride?.trim() || firstName?.trim() || lastName?.trim(),
  );
  const raw =
    initialsOverride?.trim() || initialsFromPersonName(firstName, lastName);
  const text = raw.slice(0, 2).toUpperCase();

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-inter ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      aria-label={ariaLabel ?? (hasName ? `Avatar ${text}` : "Your account")}
      role="img"
    >
      {hasName ? (
        text
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="size-[60%] opacity-80"
        >
          <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z" />
        </svg>
      )}
    </div>
  );
}
