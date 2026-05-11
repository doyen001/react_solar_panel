import Image from "next/image";
import { BLUETTI_EP2000_TECH_PIONEER } from "@/utils/constant";

export function BluettiTechnologyPioneerSection() {
  const { heading, desktopRows, mobileRows } = BLUETTI_EP2000_TECH_PIONEER;

  return (
    <section
      className="padding-section-medium bg-bluetti-tech-section-bg"
      aria-labelledby="bluetti-tech-pioneer-heading"
    >
      <div className="container-large mb-8 md:mb-10 lg:mb-12">
        <h2 id="bluetti-tech-pioneer-heading" className="bluetti-tech-pioneer-heading">
          {heading}
        </h2>
      </div>

      <div className="container-large">
        <div
          id="ep2000-image-grid-desktop"
          className="ep2000_image-grid ep2000-image-grid hidden flex-col lg:flex"
        >
          {desktopRows.map((row, index) => (
            <div key={row.src} className="relative w-full">
              <Image
                src={row.src}
                alt={row.alt}
                width={2800}
                height={1200}
                sizes="100vw"
                className="block h-auto w-full"
                priority={index === 0}
                decoding="async"
              />
            </div>
          ))}
        </div>

        <div
          id="ep2000-image-grid-mobile"
          className="ep2000_image-grid ep2000-image-grid flex flex-col lg:hidden"
        >
          {mobileRows.map((row, index) => (
            <div key={row.src} className="relative w-full">
              <Image
                src={row.src}
                alt={row.alt}
                width={1200}
                height={900}
                sizes="100vw"
                className="block h-auto w-full"
                priority={false}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
