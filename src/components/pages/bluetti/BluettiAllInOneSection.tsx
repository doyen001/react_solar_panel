import Image from "next/image";
import { BLUETTI_EP2000_ALL_IN_ONE_SECTION } from "@/utils/constant";

export function BluettiAllInOneSection() {
  const { heading, body, footnote, imageSrc, imageAlt } =
    BLUETTI_EP2000_ALL_IN_ONE_SECTION;

  return (
    <section
      className="relative isolate flex min-h-dvh w-full items-start justify-center overflow-hidden"
      aria-labelledby="bluetti-allin-one-heading"
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority={false}
        sizes="100vw"
        className="object-center"
      />
      <div
        className="bluetti-allin-one-overlay pointer-events-none absolute inset-0 z-1"
        aria-hidden
      />
      <div className="relative z-2 mx-auto flex w-full flex-col items-center px-4 pb-20 pt-24 text-center sm:px-6 sm:pt-28 md:pb-24 md:pt-32 lg:px-8 lg:pb-28 lg:pt-20">
        <h2 id="bluetti-allin-one-heading" className="bluetti-allin-one-heading">
          {heading}
        </h2>
        <p className="bluetti-allin-one-body">{body}</p>
        <p className="bluetti-allin-one-footnote">{footnote}</p>
      </div>
    </section>
  );
}
