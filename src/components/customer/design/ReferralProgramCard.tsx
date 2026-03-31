import Image from "next/image";
import { designAssets } from "./designAssets";

export function ReferralProgramCard() {
  return (
    <section className="flex flex-col overflow-hidden rounded-[10px] border border-[#dfd5c3] bg-[#fcfbf8]">
      <div className="flex items-center gap-2 border-b border-[#dfd5c3]/60 bg-gradient-to-b from-[rgba(245,159,10,0.15)] to-transparent py-2.5 pl-[18px] pr-4">
        <Image
          src={designAssets.gift}
          alt=""
          width={16}
          height={16}
          className="size-4 shrink-0"
          unoptimized
        />
        <h2 className="font-inter text-xs font-bold uppercase leading-[18px] tracking-[0.3px] text-[#2a2622]">
          Referral Program
        </h2>
      </div>
      <div className="flex flex-col gap-3 p-4">
        <div className="rounded-[10px] bg-gradient-to-b from-[#09234a] to-[#304566] px-4 py-4 text-center">
          <p className="font-inter text-xl font-bold leading-[30px] text-white">
            $500
          </p>
          <p
            className="mt-1 font-dm-sans text-[11px] font-normal leading-[16.5px] text-[rgba(241,237,228,0.7)]"
            style={{ fontVariationSettings: "'opsz' 9" }}
          >
            credit for every friend who goes solar
          </p>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="rounded-lg border border-[#dfd5c3] bg-white px-2 py-3 text-center">
            <p className="font-inter text-lg font-bold leading-[27px] text-[#2a2622]">
              2
            </p>
            <p
              className="mt-1 font-dm-sans text-[9px] font-normal uppercase leading-[13.5px] tracking-[0.3px] text-[#7c736a]"
              style={{ fontVariationSettings: "'opsz' 9" }}
            >
              Referrals Sent
            </p>
          </div>
          <div className="rounded-lg border border-[#dfd5c3] bg-white px-2 py-3 text-center">
            <p className="font-inter text-lg font-bold leading-[27px] text-[#16a34a]">
              1
            </p>
            <p
              className="mt-1 font-dm-sans text-[9px] font-normal uppercase leading-[13.5px] tracking-[0.3px] text-[#7c736a]"
              style={{ fontVariationSettings: "'opsz' 9" }}
            >
              Converted
            </p>
          </div>
          <div className="rounded-lg border border-[#dfd5c3] bg-white px-2 py-3 text-center">
            <p className="font-inter text-lg font-bold leading-[27px] text-[#f78d00]">
              $500
            </p>
            <p
              className="mt-1 font-dm-sans text-[9px] font-normal uppercase leading-[13.5px] tracking-[0.3px] text-[#7c736a]"
              style={{ fontVariationSettings: "'opsz' 9" }}
            >
              Earned
            </p>
          </div>
        </div>
        <button
          type="button"
          className="flex h-[34px] w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-[#ffef62] to-[#f78d00] font-dm-sans text-[11px] font-bold text-[#1c1a17]"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          <Image
            src={designAssets.share3}
            alt=""
            width={14}
            height={14}
            unoptimized
          />
          Refer a Friend
        </button>
      </div>
    </section>
  );
}
