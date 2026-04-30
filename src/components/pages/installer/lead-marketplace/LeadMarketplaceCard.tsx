"use client";

import Link from "next/link";
import type { InstallerLeadMarketplaceCard } from "@/utils/constant";

type Props = {
  card: InstallerLeadMarketplaceCard;
  signUpLabel: string;
  signUpHref: string;
};

export function LeadMarketplaceCard({ card, signUpLabel, signUpHref }: Props) {
  const barTeal = card.badgeVariant === "cyan";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-lead-marketplace-card-border bg-white shadow-[0_4px_24px_var(--color-lead-marketplace-card-shadow)]">
      <div
        className={
          barTeal
            ? "bg-lead-marketplace-badge-teal py-[10px] text-center font-source-sans text-[10px] font-bold uppercase leading-none tracking-[0.08em] text-white"
            : "bg-lead-marketplace-badge-amber py-[10px] text-center font-source-sans text-[10px] font-bold uppercase leading-none tracking-[0.08em] text-white"
        }
      >
        {card.badge}
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <h3 className="font-source-sans text-[17px] font-semibold leading-snug text-ink">
          {card.title}
        </h3>

        <dl className="mt-4 grid grid-cols-2 gap-x-8 gap-y-3 font-source-sans">
          <div>
            <dt className="text-[11px] font-semibold uppercase leading-tight tracking-wide text-lead-marketplace-field-label">
              System
            </dt>
            <dd className="mt-1 text-[14px] leading-snug text-ink">{card.system}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase leading-tight tracking-wide text-lead-marketplace-field-label">
              Panels
            </dt>
            <dd className="mt-1 text-[14px] leading-snug text-ink">{card.panels}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase leading-tight tracking-wide text-lead-marketplace-field-label">
              Battery
            </dt>
            <dd className="mt-1 text-[14px] leading-snug text-ink">{card.battery}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase leading-tight tracking-wide text-lead-marketplace-field-label">
              Inverter
            </dt>
            <dd className="mt-1 text-[14px] leading-snug text-ink">{card.inverter}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase leading-tight tracking-wide text-lead-marketplace-field-label">
              City
            </dt>
            <dd className="mt-1 text-[14px] leading-snug text-ink">{card.city}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase leading-tight tracking-wide text-lead-marketplace-field-label">
              Type
            </dt>
            <dd className="mt-1 text-[14px] leading-snug text-ink">
              {card.buildingType}
            </dd>
          </div>
        </dl>

        <p className="mt-6 text-center font-source-sans text-[26px] font-bold leading-none tracking-tight text-ink">
          {card.price}
        </p>

        <div className="mt-auto pt-5">
          <Link
            href={signUpHref}
            className="flex min-h-[44px] w-full items-center justify-center rounded-lg bg-lead-marketplace-button px-4 text-center font-source-sans text-[15px] font-semibold text-white transition-opacity hover:opacity-95"
          >
            {signUpLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}
