import Image from "next/image";
import { dashboardAssets } from "./assets";

type Props = {
  firstName: string;
  journeyPercent: number;
  systemKw: string;
  savingsYr: string;
  nextStep: string;
};

export function DashboardWelcomeBanner({
  firstName,
  journeyPercent,
  systemKw,
  savingsYr,
  nextStep,
}: Props) {
  return (
    <section
      className="flex w-full flex-col gap-4 rounded-xl px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6"
      style={{
        backgroundImage:
          "linear-gradient(176.69deg, rgb(255, 239, 98) 0%, rgb(247, 141, 0) 50%, rgb(232, 114, 10) 100%)",
      }}
    >
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[rgba(28,26,23,0.15)]">
          <Image
            src={dashboardAssets.sun}
            alt=""
            width={24}
            height={24}
            unoptimized
          />
        </div>
        <div className="min-w-0">
          <h1 className="font-[family-name:var(--font-inter)] text-xl font-bold leading-[30px] text-[#1c1a17]">
            Welcome back, {firstName}!
          </h1>
          <p
            className="mt-0.5 font-[family-name:var(--font-dm-sans)] text-xs font-medium leading-[18px] text-[rgba(28,26,23,0.65)]"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            Your solar journey is {journeyPercent}% complete
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-start gap-4 sm:justify-end md:gap-6">
        <StatBlock label="Selected System" value={systemKw} />
        <StatBlock label="Est. Savings" value={savingsYr} />
        <StatBlock label="Next Step" value={nextStep} />
      </div>
    </section>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[88px] text-center sm:text-left">
      <p
        className="font-[family-name:var(--font-dm-sans)] text-[10px] font-normal uppercase leading-[15px] tracking-[0.5px] text-[rgba(28,26,23,0.55)]"
        style={{ fontVariationSettings: "'opsz' 9" }}
      >
        {label}
      </p>
      <p
        className="mt-1 font-[family-name:var(--font-dm-sans)] text-sm font-bold leading-[21px] text-[#1c1a17]"
        style={{ fontVariationSettings: "'opsz' 14" }}
      >
        {value}
      </p>
    </div>
  );
}
