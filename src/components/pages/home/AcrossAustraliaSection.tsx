import Image from "next/image";

const stats = [
  { value: "500+", label: "Certified Installers" },
  { value: "11,000+", label: "Quotes Created" },
  { value: "25", label: "Days Avg. Install" },
  { value: "All States", label: "Coverage" },
];

export function AcrossAustraliaSection() {
  return (
    <section className="bg-faint/30 px-4 py-16 sm:px-6 lg:py-[120px]">
      <div className="mx-auto flex max-w-[1250px] flex-col items-center gap-12 lg:flex-row lg:gap-[147px]">
        {/* Map */}
        <div className="relative w-full max-w-[519px] shrink-0">
          <Image
            src="/images/home/australia-map.png"
            alt="Australia coverage map"
            width={519}
            height={519}
            className="h-auto w-full"
          />
          {/* <Image
            src="/images/home/australia-map-overlay.png"
            alt=""
            width={519}
            height={519}
            className="absolute inset-0 h-full w-full"
          /> */}
          {/* Legend */}
          <div className="absolute bottom-5 left-1.5 rounded-[10px] border border-faint bg-gray-1/90 p-3 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full border border-white bg-flame shadow-sm" />
              <span className="font-[family-name:var(--font-source-sans)] text-xs font-medium text-deep">
                Solar Site Hub
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-primary" />
              <span className="font-[family-name:var(--font-source-sans)] text-xs font-medium text-deep">
                Installer Location
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-7">
          <div className="flex flex-col gap-[27px]">
            <h2 className="font-[family-name:var(--font-source-sans)] text-3xl font-bold tracking-[-0.9px] text-ink sm:text-4xl">
              Across Australia
            </h2>
            <p className="max-w-[555px] font-[family-name:var(--font-source-sans)] text-base leading-7 text-text sm:text-lg">
              We are actively installing in all regions across the continent.
              From Perth to Sydney, Brisbane to Melbourne, our network of
              certified installers ensures quality solar solutions wherever you
              are.
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl bg-white p-4 shadow-[0_4px_24px_-4px_rgba(17,28,39,0.08)]"
              >
                <p className="font-[family-name:var(--font-source-sans)] text-2xl font-bold text-primary">
                  {s.value}
                </p>
                <p className="mt-1 font-[family-name:var(--font-source-sans)] text-sm text-muted">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
