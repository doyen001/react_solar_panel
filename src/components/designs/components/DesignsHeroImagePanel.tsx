import Image from "next/image";
import { DesignsHeroBadgeOverlay } from "./DesignsHeroBadgeOverlay";

const PANEL_IMG = "/images/home/solar-panel-design.png";

type DesignsHeroImagePanelProps = {
  className?: string;
};

export function DesignsHeroImagePanel({
  className,
}: DesignsHeroImagePanelProps) {
  return (
    <div
      className={`relative w-full max-w-[634px] shrink-0 overflow-hidden rounded-[30px] ${className ?? ""}`}
      style={{ aspectRatio: "634 / 411" }}
    >
      <Image
        src={PANEL_IMG}
        alt="Solar home with EasyLink Solar"
        fill
        className="object-cover"
        sizes="(min-width: 1024px) 634px, 100vw"
      />
      <DesignsHeroBadgeOverlay />
    </div>
  );
}
