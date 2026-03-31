import Image from "next/image";
import { DesignsHeroBadgeOverlay } from "./DesignsHeroBadgeOverlay";

export type DesignsPropertyTypeCardProps = {
  imageSrc: string;
  label: string;
  imageAlt: string;
  className?: string;
};

/** ~407.6 / 264.233 from Figma */
const CARD_IMAGE_ASPECT = 407.6 / 264.233;

/**
 * Figma 3:4088–3:4102 — image + badge + category label (22px extrabold, white).
 */
export function DesignsPropertyTypeCard({
  imageSrc,
  label,
  imageAlt,
  className,
}: DesignsPropertyTypeCardProps) {
  return (
    <div
      className={`flex w-full max-w-[407px] flex-col items-center gap-10 ${className ?? ""}`}
    >
      <div
        className="relative w-full overflow-hidden rounded-2xl"
        style={{ aspectRatio: CARD_IMAGE_ASPECT }}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 407px"
        />
        <DesignsHeroBadgeOverlay />
      </div>
      <p
        className="w-full text-center font-source-sans text-[22px] font-extrabold capitalize leading-normal text-white"
        style={{ letterSpacing: "0.248px" }}
      >
        {label}
      </p>
    </div>
  );
}
