"use client";

const DEFAULT_ADDRESS = "42 Bondi Rd, Bondi, NSW 2026";

function ProposalStatCard({
  label,
  value,
  variant,
}: {
  label: string;
  value: string;
  variant: "cyan" | "gold";
}) {
  const bg =
    variant === "cyan"
      ? "bg-[linear-gradient(156.24deg,rgba(32,148,243,0.24)_0%,rgba(23,207,207,0.24)_100%)]"
      : "bg-[linear-gradient(156.24deg,rgba(253,224,71,0.24)_0%,rgba(247,141,0,0.24)_100%)]";

  return (
    <div
      className={`flex min-h-[110.136px] min-w-0 flex-1 flex-col gap-[4.113px] rounded-[16.471px] px-[20.579px] pt-[20.579px] ${bg}`}
    >
      <p className="text-center font-source-sans text-[14.412px] font-normal uppercase leading-[21.618px] tracking-[0.7206px] text-white/70">
        {label}
      </p>
      <p className="text-center font-source-sans text-[28.824px] font-normal leading-[43.235px] text-white">
        {value}
      </p>
    </div>
  );
}

function ProposalDetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex w-full max-w-[478.263px] items-center justify-between gap-4 text-[14.412px] leading-[21.618px]">
      <span className="shrink-0 font-inter font-normal text-black/60">
        {label}
      </span>
      <span className="min-w-0 text-right font-source-sans font-normal text-black">
        {value}
      </span>
    </div>
  );
}

function ProposalSubMetric({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  /** Applied to the value span (e.g. gradient text). */
  valueClassName?: string;
}) {
  return (
    <div className="flex min-h-[100.866px] min-w-0 flex-1 flex-col rounded-[14.412px] bg-white/10 px-[16.465px] pt-[10px]">
      <p className="text-center font-inter text-[12.353px] font-normal leading-[18.529px] text-white/50">
        {label}
      </p>
      <p className="mt-1 text-center font-source-sans text-[20.588px] font-normal leading-[30.882px]">
        <span className={valueClassName ?? "text-white"}>{value}</span>
      </p>
    </div>
  );
}

export type DesignsProposalStepContentProps = {
  /** When empty, uses Figma placeholder address. */
  address?: string;
  customerName?: string;
};

/**
 * Figma Screen 32 (20:22020) — proposal summary, system details, pricing, CTA.
 */
export function DesignsProposalStepContent({
  address,
  customerName = "Charli Abdo",
}: DesignsProposalStepContentProps) {
  const displayAddress = address?.trim() ? address.trim() : DEFAULT_ADDRESS;

  return (
    <div className="flex flex-1 items-center">
      <div className="relative z-10 mx-auto flex w-full max-w-[1446px] flex-col px-4 pt-8 sm:px-8 sm:pt-1 lg:px-[81px] lg:pt-[5px]">
        <div className="mx-auto flex w-full max-w-[1050px] flex-col gap-[32.941px]">
          <div className="flex flex-col gap-[20px]">
            <div className="flex flex-col gap-[12.352px]">
              <h1 className="text-center font-source-sans text-[clamp(28px,3.2vw,39.118px)] font-medium capitalize leading-[1.2] text-white">
                Your Solar Proposal
              </h1>
              <p className="text-center font-source-sans text-[clamp(15px,1.6vw,18.529px)] font-normal leading-[27.794px] text-white/60">
                Here&apos;s your personalized system design and pricing.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-[16.465px] lg:grid-cols-4">
              <ProposalStatCard
                label="System Size"
                value="6.6 kW"
                variant="cyan"
              />
              <ProposalStatCard
                label="Total Panels"
                value="16"
                variant="gold"
              />
              <ProposalStatCard
                label="Yearly Savings"
                value="$1,580"
                variant="cyan"
              />
              <ProposalStatCard
                label="Payback"
                value="7.1 yrs"
                variant="gold"
              />
            </div>
          </div>

          <div className="flex flex-col items-stretch justify-center gap-[24.706px] lg:flex-row lg:items-start">
            <div className="mx-auto w-full max-w-[550.735px] shrink-0 rounded-[28.824px] border-[1.5px] border-solid border-design-accent-cyan bg-[linear-gradient(133.09deg,#FFEF62_0%,#F78D00_100%)] px-[34.397px] pb-[34.397px] pt-[34.397px]">
              <h2 className="text-center font-source-sans text-[22.647px] font-medium uppercase leading-[33.971px] tracking-[1.1324px] text-black">
                System Details
              </h2>

              <div className="mx-auto mt-[12px] flex max-w-[478.263px] flex-col gap-[12px]">
                <div className="flex flex-col gap-[20px]">
                  <ProposalDetailRow label="Customer" value={customerName} />
                  <ProposalDetailRow label="Address" value={displayAddress} />
                  <ProposalDetailRow label="Property" value="Residential" />
                </div>
                <hr className="h-px w-full max-w-[478.263px] border-0 bg-black/20" />
                <div className="flex flex-col gap-[20px]">
                  <ProposalDetailRow
                    label="Solar Panels"
                    value="Jinko Tiger Neo 440W"
                  />
                  <ProposalDetailRow
                    label="Inverter"
                    value="Fronius Primo GEN24 5kW"
                  />
                  <ProposalDetailRow
                    label="Battery"
                    value="Tesla Powerwall 2 (13.5 kWh)"
                  />
                </div>
                <hr className="h-px w-full max-w-[478.263px] border-0 bg-black/20" />
                <div className="flex flex-col gap-[20px]">
                  <ProposalDetailRow label="Number of Panels" value="16" />
                  <ProposalDetailRow
                    label="CO₂ Offset"
                    value="7.2 tonnes/year"
                  />
                </div>
              </div>
            </div>

            <div className="mx-auto flex w-full max-w-[478.263px] shrink-0 flex-col gap-[10px] lg:mx-0">
              <div className="rounded-[28.824px] border-[1.5px] border-solid border-design-accent-cyan bg-[rgba(23,23,23,0.6)] px-[32.93px] py-[20px]">
                <p className="text-center font-source-sans text-[16.471px] font-normal uppercase leading-[24.706px] tracking-[0.8235px] text-white/60">
                  Total System Price
                </p>
                <p className="mt-2 text-center font-source-sans text-[clamp(36px,5vw,53.529px)] font-normal leading-[1.15]">
                  <span className="bg-[linear-gradient(154.91deg,#FFEF62_0%,#F78D00_100%)] bg-clip-text text-transparent">
                    $11,200
                  </span>
                </p>
                <p className="mt-2 text-center font-source-sans text-[14.412px] font-normal leading-[21.618px] text-white/40">
                  *Price includes installation and GST
                </p>
                <div className="mt-2 flex gap-[12.352px]">
                  <ProposalSubMetric label="Monthly Savings" value="$132" />
                  <ProposalSubMetric label="Current Bill" value="$500" />
                  <ProposalSubMetric
                    label="New Bill"
                    value="$368"
                    valueClassName="inline-block bg-[linear-gradient(142.91deg,#FFEF62_0%,#F78D00_100%)] bg-clip-text text-transparent"
                  />
                </div>
              </div>

              <div className="rounded-[28.824px] border-[1.5px] border-solid border-design-accent-cyan bg-[rgba(255,255,255,0.08)] px-[26.17px] py-[15px]">
                <p className="text-center font-source-sans text-[14.412px] font-normal uppercase leading-[21.618px] tracking-[0.7206px] text-white/60">
                  25-Year Net Savings
                </p>
                <p className="mt-2 text-center font-source-sans text-[clamp(28px,4vw,37.059px)] font-normal leading-[1.2]">
                  <span className="bg-[linear-gradient(154.98deg,#2094F3_0%,#17CFCF_100%)] bg-clip-text text-transparent">
                    $28,300
                  </span>
                </p>
              </div>

              <button
                type="button"
                className="py-2 w-full rounded-[14.412px] bg-[linear-gradient(172.76deg,#2094F3_0%,#17CFCF_100%)] font-source-sans text-[18.529px] font-medium uppercase leading-[27.794px] tracking-[0.9265px] text-white shadow-[0px_0px_30.882px_0px_rgba(32,148,243,0.4)] transition hover:brightness-105"
              >
                Download your proposal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
