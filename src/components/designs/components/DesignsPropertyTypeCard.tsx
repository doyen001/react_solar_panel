import Image from "next/image";
import { DesignsHeroBadgeOverlay } from "./DesignsHeroBadgeOverlay";

export type DesignsPropertyTypeCardProps = {
  imageSrc: string;
  label: string;
  imageAlt: string;
  className?: string;
  selected?: boolean;
  onClick?: () => void;
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
  selected = false,
  onClick,
}: DesignsPropertyTypeCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full max-w-[407px] flex-col items-center gap-10 text-left transition ${selected ? "scale-[1.01]" : "hover:scale-[1.005]"} ${className ?? ""}`}
    >
      <div
        className={`relative w-full overflow-hidden rounded-2xl ${selected ? "ring-4 ring-design-accent-cyan/70" : ""}`}
        style={{ aspectRatio: CARD_IMAGE_ASPECT }}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          className="absolute inset-0 h-full w-full object-cover"
          width={407.6}
          height={264.233}
        />
        <DesignsHeroBadgeOverlay />
      </div>
      <p
        className={`w-full text-center font-source-sans text-[22px] font-extrabold capitalize leading-normal ${selected ? "text-yellow-lemon" : "text-white"}`}
        style={{ letterSpacing: "0.248px" }}
      >
        {label}
      </p>
    </button>
  );
}
