import Image from "next/image";
import Link from "next/link";
import appStoreBadge from "@/components/ui/Icons/app-store.svg";
import { BLUETTI_EP2000_APP_CTA_SECTION } from "@/utils/constant";

export function BluettiAppCtaSection() {
  const {
    heading,
    videoSrcMp4,
    videoAriaLabel,
    bullets,
    googlePlayBadgeSrc,
    googlePlayBadgeAlt,
    appleBadgeAlt,
    appStoreHref,
    playStoreHref,
  } = BLUETTI_EP2000_APP_CTA_SECTION;

  return (
    <section
      className="padding-section-medium bg-white border-b border-gray-7"
      aria-labelledby="bluetti-app-cta-heading"
    >
      <div className="container-large">
        <div className="bluetti-app-cta-card flex flex-col overflow-hidden rounded-2xl border border-bluetti-app-cta-shell-border bg-white lg:grid lg:grid-cols-2 lg:rounded-3xl">
          <div className="relative order-2 min-h-88 w-full sm:min-h-88 lg:order-1 lg:min-h-104">
            <video
              className="absolute inset-0 z-0 h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              aria-label={videoAriaLabel}
            >
              <source src={videoSrcMp4} type="video/mp4" />
            </video>
          </div>

          <div className="order-1 flex flex-col justify-center bg-white px-6 py-10 sm:px-8 sm:py-12 lg:order-2 lg:px-10 lg:py-14 xl:px-12">
            <h2 id="bluetti-app-cta-heading" className="bluetti-app-cta-heading">
              {heading}
            </h2>
            <ul className="bluetti-app-cta-list">
              {bullets.map((item) => (
                <li key={item.label}>
                  <strong>{item.label}:</strong> {item.body}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-4 sm:mt-10 sm:gap-5">
              <Link
                href={appStoreHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block shrink-0 transition hover:opacity-90"
              >
                <Image
                  src={appStoreBadge}
                  alt={appleBadgeAlt}
                  width={158}
                  height={47}
                  unoptimized
                  className="h-[42px] w-auto max-w-[158px]"
                />
              </Link>
              <Link
                href={playStoreHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block shrink-0 transition hover:opacity-90"
              >
                <Image
                  src={googlePlayBadgeSrc}
                  alt={googlePlayBadgeAlt}
                  width={180}
                  height={54}
                  className="h-[42px] w-auto max-w-[180px]"
                  unoptimized
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
