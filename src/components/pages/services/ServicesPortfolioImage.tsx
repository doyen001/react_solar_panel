import Image from "next/image";

type ServicesPortfolioImageProps = {
  src: string;
  alt: string;
  featured?: boolean;
};

export function ServicesPortfolioImage({
  src,
  alt,
  featured = false,
}: ServicesPortfolioImageProps) {
  return (
    <div
      className={`svc-scale-target relative w-full overflow-hidden bg-svc-ink ${
        featured ? "aspect-[16/11] sm:aspect-[16/10]" : "aspect-16/10"
      }`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={
          featured
            ? "(max-width: 1024px) 100vw, 66vw"
            : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        }
        className="object-cover object-top transition duration-500 ease-out group-hover:scale-[1.03]"
        priority={featured}
      />

      {/* Soft vignette keeps long screenshots readable in the card frame. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-svc-ink/55 via-svc-ink/5 to-transparent"
      />

      {/* Gold hairline at the top edge — ties into the page accent palette. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-yellow-lemon/70 to-transparent"
      />
    </div>
  );
}
