type Props = {
  initials: string;
  companyName: string;
  subtitle: string;
};

export function TimelineInstallerCard({
  initials,
  companyName,
  subtitle,
}: Props) {
  return (
    <div className="customer-card-border border-t p-4">
      <p
        className="font-dm-sans text-[9px] font-normal uppercase leading-[13.5px] tracking-[0.3px] customer-text-muted"
        style={{ fontVariationSettings: "'opsz' 9" }}
      >
        Your Installer
      </p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-navy-800 font-inter text-[10px] font-semibold leading-[15px] tracking-wide text-white">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p
            className="font-dm-sans text-xs font-semibold leading-[18px] customer-text-on-dark"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            {companyName}
          </p>
          <p
            className="mt-1 font-dm-sans text-[10px] font-normal leading-[15px] customer-text-muted"
            style={{ fontVariationSettings: "'opsz' 9" }}
          >
            {subtitle}
          </p>
        </div>
        <button
          type="button"
          className="customer-gradient-accent-v flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 font-dm-sans text-[9px] font-bold uppercase leading-[13.5px] tracking-[0.3px] text-warm-black"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          Message
        </button>
      </div>
    </div>
  );
}
