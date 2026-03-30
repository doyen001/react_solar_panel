import Link from "next/link";
import { designHeroTokens } from "./designHeroTokens";

type DesignsSavingsPromoCardProps = {
  className?: string;
};

export function DesignsSavingsPromoCard({ className }: DesignsSavingsPromoCardProps) {
  const t = designHeroTokens;
  return (
    <div
      className={`relative flex w-full shrink-0 flex-col overflow-hidden rounded-[30px] border-0 bg-gradient-to-r from-[#ffef62] to-[#f78d00] shadow-[0px_0px_40px_0px_rgba(140,140,140,0.3)] ${className ?? ""}`}
      style={{
        maxWidth: t.cardMaxW,
        minHeight: t.cardH,
      }}
    >
      <div
        className="flex flex-1 flex-col items-center justify-center px-6 py-10 sm:px-8"
        style={{ gap: t.gapCardInner }}
      >
        <p
          className="w-full max-w-[498px] text-center font-source-sans text-[clamp(28px,4vw,40px)] font-bold capitalize text-white lg:text-[40px] lg:leading-[50px] lg:tracking-[0.248px]"
        >
          Let&apos;s Design your Solar and battery system
        </p>
        <Link
          href="/customers"
          className="inline-flex h-14 w-full max-w-[318px] items-center justify-center rounded-xl border-0 font-source-sans text-[20px] font-semibold uppercase leading-6 text-white shadow-[0px_0px_40px_0px_rgba(140,140,140,0.3)] transition hover:opacity-95"
          style={{
            backgroundColor: t.cardDark,
            minHeight: t.cta.height,
            maxWidth: t.cta.width,
          }}
        >
          See your savings
        </Link>
      </div>
    </div>
  );
}
