import Icon from "../../ui/Icons";

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
    <section className="customer-welcome-banner flex w-full flex-col gap-4 rounded-[14px] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-warm-black/15 text-warm-black">
          <Icon name="Sun" className="size-6 text-warm-black" />
        </div>
        <div className="min-w-0">
          <h1 className="font-inter text-xl font-bold leading-[30px] tracking-[-0.45px] text-warm-black">
            Welcome back, {firstName}!
          </h1>
          <p className="mt-0.5 font-inter text-xs font-normal leading-[18px] text-warm-black/65">
            Your solar journey is {journeyPercent}% complete
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-start gap-4 sm:justify-end md:gap-10">
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
      <p className="font-inter text-[10px] font-normal uppercase leading-[15px] tracking-[1.12px] text-warm-black/55">
        {label}
      </p>
      <p className="mt-1 font-inter text-sm font-bold leading-[21px] tracking-[-0.15px] text-warm-black">
        {value}
      </p>
    </div>
  );
}
