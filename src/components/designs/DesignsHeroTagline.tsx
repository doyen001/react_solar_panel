import { designHeroTokens } from "./designHeroTokens";

type DesignsHeroTaglineProps = {
  className?: string;
};

export function DesignsHeroTagline({ className }: DesignsHeroTaglineProps) {
  const t = designHeroTokens;
  return (
    <p
      className={`w-full text-center font-source-sans text-[clamp(20px,2.8vw,26px)] font-extrabold leading-normal text-white ${className ?? ""}`}
      style={{ letterSpacing: `${t.tagline.tracking}px` }}
    >
      We design to maximise your savings and end your energy bills.
    </p>
  );
}
