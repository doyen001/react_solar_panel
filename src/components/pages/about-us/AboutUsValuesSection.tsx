import Image from "next/image";

import { ABOUT_US_PAGE } from "@/utils/constant";

export function AboutUsValuesSection() {
  const rows = [
    ABOUT_US_PAGE.values.items.slice(0, 5),
    ABOUT_US_PAGE.values.items.slice(5, 10),
  ];

  return (
    <section className="relative min-h-[879px] w-full overflow-hidden py-16 lg:py-[67px]">
      <Image
        src={ABOUT_US_PAGE.values.backgroundImageSrc}
        alt={ABOUT_US_PAGE.values.backgroundImageAlt}
        fill
        className="object-cover"
        // style={{
        //   background: `lightgray 50% / cover no-repeat`
        // }}
        sizes="100vw"
      />

      <div className="relative z-1 mx-auto flex w-full max-w-[1259px] flex-col items-center gap-[67px] px-4 sm:px-6 lg:px-0">
        <h2 className="text-center font-source-sans text-[32px] font-medium leading-normal tracking-[-0.4395px] text-about-values-text sm:text-[40px]">
          {ABOUT_US_PAGE.values.title}
        </h2>

        <div className="flex w-full flex-col gap-[22px]">
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-[24px]"
            >
              {row.map((item) => (
                <AboutUsValueCard key={String(item.label)} item={item} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutUsValueCard({
  item,
}: {
  item: (typeof ABOUT_US_PAGE.values.items)[number];
}) {
  const labelLines: string[] = Array.isArray(item.label)
    ? [...item.label]
    : [item.label];
  const isVariantB = item.variant === "b";

  return (
    <article
      className={`flex min-h-[180px] items-center justify-center rounded-[20px] px-4 py-8 sm:min-h-[234px] ${
        isVariantB
          ? "bg-linear-to-r from-about-values-card-bg-b-from to-about-values-card-bg-b-to"
          : "bg-about-values-card-bg-a"
      }`}
    >
      <p className="text-center font-source-sans text-lg font-medium leading-normal tracking-[-0.4395px] text-about-values-text sm:text-xl">
        {labelLines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>
    </article>
  );
}
