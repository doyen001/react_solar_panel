import Image from "next/image";
import type { InstallerLandingBand } from "@/components/pages/installer/installerLandingBands";

function InstallerValueBandCard({ band }: { band: InstallerLandingBand }) {
  const imageBlock = (
    <div className="relative aspect-[519/393] w-full max-w-[519px] shrink-0 overflow-hidden rounded-2xl lg:h-[393px] lg:max-h-none lg:w-[min(100%,519px)]">
      <Image
        src={band.imageSrc}
        alt={band.imageAlt}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 519px"
      />
    </div>
  );

  const copyBlock = (
    <div className="flex w-full max-w-[476px] flex-col gap-10 lg:gap-11">
      <div className="flex flex-col gap-2.5">
        <h2 className="font-[family-name:var(--font-source-sans)] text-3xl font-bold tracking-[-1.1px] text-ink lg:text-[36px]">
          {band.title}
        </h2>
        <p className="font-[family-name:var(--font-source-sans)] text-lg leading-normal text-[#393939]">
          {band.description}
        </p>
      </div>
      <ul className="flex flex-col gap-3 font-[family-name:var(--font-source-sans)] text-lg text-[#393939]">
        {band.bullets.map((line) => (
          <li key={line} className="flex gap-2">
            <span className="shrink-0 font-bold text-brand-cyan" aria-hidden>
              •
            </span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="w-full rounded-[7px] px-11 py-2.5 font-[family-name:var(--font-source-sans)] text-base font-semibold tracking-[-0.16px] text-white shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)] transition-opacity hover:opacity-95"
        style={{
          backgroundImage:
            "linear-gradient(161deg, rgb(32, 148, 243) 0%, rgb(23, 207, 207) 100%)",
        }}
      >
        Register
      </button>
    </div>
  );

  return (
    <div className="rounded-[38px] bg-gold-2 shadow-[0px_8px_32px_-8px_rgba(17,28,39,0.26)]">
      <div
        className={`flex flex-col gap-12 px-8 py-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:px-[66px] lg:py-[52px] ${
          band.imageSide === "right" ? "lg:flex-row-reverse" : ""
        }`}
      >
        {imageBlock}
        {copyBlock}
      </div>
    </div>
  );
}

export function InstallerValueBands({
  bands,
}: {
  bands: InstallerLandingBand[];
}) {
  return (
    <section className="mx-auto flex max-w-[1260px] flex-col gap-10 px-4 py-10 sm:px-6 lg:gap-10 lg:px-[90px] lg:py-12">
      {bands.map((band) => (
        <InstallerValueBandCard key={band.id} band={band} />
      ))}
    </section>
  );
}
