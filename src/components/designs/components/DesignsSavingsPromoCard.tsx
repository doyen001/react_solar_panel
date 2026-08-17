import Link from "next/link";

type DesignsSavingsPromoCardProps = {
  className?: string;
};

export function DesignsSavingsPromoCard({
  className,
}: DesignsSavingsPromoCardProps) {
  return (
    <div
      className={`relative flex aspect-[629/411] w-full min-w-0 flex-col overflow-hidden rounded-[30px] border-[3px] border-design-accent-cyan bg-linear-to-r from-yellow-lemon to-orange-amber shadow-[0px_0px_40px_0px_rgba(140,140,140,0.3)] lg:aspect-auto lg:h-full lg:min-h-0 ${className ?? ""}`}
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-5 py-6 sm:gap-9 sm:px-8 sm:py-10">
        <p className="w-full max-w-[498px] text-center font-source-sans text-[clamp(28px,4vw,40px)] font-bold capitalize text-white lg:text-[40px] lg:leading-[50px] lg:tracking-[0.248px]">
          Let&apos;s Design your Solar and battery system
        </p>
        <Link
          href="/customers"
          className="inline-flex h-14 w-full max-w-[318px] items-center justify-center rounded-xl border-0 bg-design-card-dark font-source-sans text-[20px] font-semibold uppercase leading-6 text-white shadow-[0px_0px_40px_0px_rgba(140,140,140,0.3)] transition hover:opacity-95"
        >
          See your savings
        </Link>
      </div>
    </div>
  );
}
