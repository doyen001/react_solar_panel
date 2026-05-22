import Image from "next/image";
import { CustomerSectionHeader } from "@/components/customer/CustomerSectionHeader";
import { designAssets } from "./designAssets";
import Icon from "@/components/ui/Icons";

export function ReferralProgramCard() {
  return (
    <section className="customer-panel-bg customer-panel-border-dark flex flex-col overflow-hidden rounded-[10px] border">
      <CustomerSectionHeader
        variant="dark"
        title="Referral Program"
        icon={
          <Icon
            name="MyDesignGift"
            className="size-4 shrink-0 text-white"
            aria-hidden
          />
        }
      />
      <div className="flex flex-col gap-3 p-4">
        <div className="customer-avatar-gradient rounded-[10px] px-4 py-4 text-center">
          <p className="font-inter text-xl font-bold leading-[30px] text-white">
            $500
          </p>
          <p
            className="mt-1 font-dm-sans text-[11px] font-normal leading-[16.5px] text-cream-200/70"
            style={{ fontVariationSettings: "'opsz' 9" }}
          >
            credit for every friend who goes solar
          </p>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="rounded-lg border customer-cream-card-border bg-cream-50 px-2 py-3 text-center">
            <p className="font-inter text-lg font-bold leading-[27px] text-warm-ink">
              2
            </p>
            <p
              className="mt-1 font-dm-sans text-[9px] font-normal uppercase leading-[13.5px] tracking-[0.3px] text-warm-gray"
              style={{ fontVariationSettings: "'opsz' 9" }}
            >
              Referrals Sent
            </p>
          </div>
          <div className="rounded-lg border customer-cream-card-border bg-cream-50 px-2 py-3 text-center">
            <p className="font-inter text-lg font-bold leading-[27px] text-success">
              1
            </p>
            <p
              className="mt-1 font-dm-sans text-[9px] font-normal uppercase leading-[13.5px] tracking-[0.3px] text-warm-gray"
              style={{ fontVariationSettings: "'opsz' 9" }}
            >
              Converted
            </p>
          </div>
          <div className="rounded-lg border customer-cream-card-border bg-cream-50 px-2 py-3 text-center">
            <p className="font-inter text-lg font-bold leading-[27px] text-orange-amber">
              $500
            </p>
            <p
              className="mt-1 font-dm-sans text-[9px] font-normal uppercase leading-[13.5px] tracking-[0.3px] text-warm-gray"
              style={{ fontVariationSettings: "'opsz' 9" }}
            >
              Earned
            </p>
          </div>
        </div>
        <button
          type="button"
          className="customer-gradient-accent-v flex h-[34px] w-full items-center justify-center gap-2 rounded-lg font-dm-sans text-[11px] font-bold text-warm-black"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          <Icon
            name="BlogDetailShareLink"
            className="size-4 shrink-0"
            aria-hidden
          />
          Refer a Friend
        </button>
      </div>
    </section>
  );
}
