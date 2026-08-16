import { ServicesReveal } from "@/components/pages/services/ServicesReveal";

type ServicesSectionHeadingProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  /** Anchors the section for skip links and the in-page "View Portfolio" CTA. */
  headingId: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
};

export function ServicesSectionHeading({
  eyebrow,
  title,
  subtitle,
  headingId,
  align = "center",
  tone = "light",
}: ServicesSectionHeadingProps) {
  const isCentered = align === "center";
  const isDark = tone === "dark";

  return (
    <ServicesReveal
      className={`flex flex-col gap-4 ${isCentered ? "items-center text-center" : "items-start text-left"}`}
    >
      <span
        className={`inline-flex w-fit items-center rounded-full border px-3.5 py-1.5 font-inter text-xs font-semibold uppercase tracking-[0.12em] ${
          isDark
            ? "border-svc-dark-border bg-svc-glass text-svc-dark-body"
            : "border-svc-border bg-svc-accent-soft text-svc-accent-text"
        }`}
      >
        {eyebrow}
      </span>
      <h2
        id={headingId}
        className={`max-w-[760px] font-outfit text-[30px] font-bold leading-[1.16] tracking-[-0.8px] sm:text-[38px] lg:text-[44px] ${
          isDark ? "text-white" : "text-svc-ink"
        }`}
      >
        {title}
      </h2>
      <p
        className={`max-w-[680px] font-dm-sans text-base leading-7 sm:text-lg ${
          isDark ? "text-svc-dark-body" : "text-svc-body"
        }`}
      >
        {subtitle}
      </p>
    </ServicesReveal>
  );
}
