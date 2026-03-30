import Image from "next/image";
import { DesignsHeroBadgeOverlay } from "./DesignsHeroBadgeOverlay";
import { designHeroTokens } from "./designHeroTokens";

const PANEL_IMG = "/images/home/solar-panel-design.png";

type DesignsHeroImagePanelProps = {
  className?: string;
};

export function DesignsHeroImagePanel({
  className,
}: DesignsHeroImagePanelProps) {
  const t = designHeroTokens;
  return (
    <div
      className={`relative w-full shrink-0 overflow-hidden rounded-[30px] lg:max-w-[634px] ${className ?? ""}`}
      style={{ aspectRatio: `${t.visualMaxW} / ${t.cardH}` }}
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
