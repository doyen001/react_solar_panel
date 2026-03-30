import Link from "next/link";

type DesignsSavingsPromoCardProps = {
  className?: string;
};

export function DesignsSavingsPromoCard({
  className,
}: DesignsSavingsPromoCardProps) {
  return (
    <div
      className={`relative flex min-h-[411px] w-full max-w-[629px] shrink-0 flex-col overflow-hidden rounded-[30px] border-[3px] border-design-accent-cyan bg-linear-to-r from-auth-card-from to-auth-card-to shadow-[0px_0px_40px_0px_rgba(140,140,140,0.3)] ${className ?? ""}`}
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-9 px-6 py-10 sm:px-8">
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
