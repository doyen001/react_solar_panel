import Image from "next/image";

const features = [
  { name: "Instant Solar Designs", easylink: true, competitor: false },
  { name: "Transparent Pricing", easylink: true, competitor: false },
  { name: "System Customizations", easylink: true, competitor: false },
  { name: "Premium Equipment", easylink: true, competitor: false },
  { name: "Aggressive Phone Calls", easylink: false, competitor: true },
];

function CheckIcon() {
  return (
    <div className="flex size-6 items-center justify-center rounded-full bg-success-bright/20">
      <Image src="/images/home/tech-check.svg" alt="Yes" width={16} height={16} />
    </div>
  );
}

function XIcon() {
  return (
    <div className="flex size-6 items-center justify-center rounded-full bg-faint">
      <Image src="/images/home/tech-x.svg" alt="No" width={16} height={16} />
    </div>
  );
}

function WarningIcon() {
  return (
    <div className="flex size-6 items-center justify-center rounded-full bg-danger/20">
      <Image src="/images/home/tech-warning.svg" alt="Warning" width={16} height={16} />
    </div>
  );
}

export function TechnologySection() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:py-[87px]">
      <div className="mx-auto max-w-[768px]">
        {/* Heading */}
        <div className="text-center">
          <h2 className="font-source-sans text-3xl font-bold tracking-[-0.9px] text-ink sm:text-4xl">
            Our Technology
          </h2>
          <h3 className="mt-4 font-source-sans text-xl font-semibold tracking-[-0.5px] text-ink">
            Why Easylink is better than the rest?
          </h3>
          <p className="mx-auto mt-4 max-w-[657px] font-source-sans text-base leading-6 text-muted">
            We are imaginers, and we know you are too. That&apos;s why we&apos;ve put a lot of engineering effort into building this tool, giving you a sneak peek of what going solar could look like for you.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="mt-10 overflow-x-auto rounded-2xl bg-white shadow-[0_8px_32px_-8px_rgba(17,28,39,0.12)]">
          <div className="min-w-[640px]">
          {/* Header row */}
          <div className="flex items-center border-b border-border-soft bg-faint/50 px-4 py-4">
            <span className="flex-1 font-source-sans text-sm font-semibold text-ink">Features</span>
            <span className="w-[150px] text-center font-source-sans text-sm font-semibold text-primary sm:w-[200px]">Easylink Solar</span>
            <span className="w-[120px] text-center font-source-sans text-sm font-semibold text-muted sm:w-[160px]">Competitors</span>
          </div>

          {/* Feature rows */}
          {features.map((f, i) => {
            const isLast = i === features.length - 1;
            return (
              <div
                key={f.name}
                className={`flex items-center px-4 py-4 ${!isLast ? "border-b border-border-soft" : ""}`}
              >
                <span className="flex-1 font-source-sans text-sm text-ink">{f.name}</span>
                <div className="flex w-[150px] justify-center sm:w-[200px]">
                  {f.easylink ? <CheckIcon /> : <XIcon />}
                </div>
                <div className="flex w-[120px] justify-center sm:w-[160px]">
                  {f.competitor ? <WarningIcon /> : <XIcon />}
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
}
