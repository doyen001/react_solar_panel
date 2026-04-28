"use client";

import classNames from "classnames";
import { useEffect, useMemo, useState } from "react";
import {
  INSTALLER_LEAD_MARKETPLACE_CARDS,
  type InstallerLeadCardData,
} from "@/components/pages/installer/installerLeadMarketplaceMock";

type LeadListItem = {
  id: string;
  customerName?: string;
  address?: string;
  estimatedValue?: number;
  status?: string;
};

type PaginatedApiResponse<T> = {
  success?: boolean;
  data?: T[];
};

const STATUS_TO_BADGE: Record<string, string> = {
  NEW: "NEW",
  CONTACTED: "CONTACTED",
  QUALIFIED: "QUALIFIED",
  PROPOSAL_SENT: "PROPOSAL",
  NEGOTIATION: "NEGOTIATION",
  WON: "WON",
  LOST: "LOST",
};

function toCard(lead: LeadListItem): InstallerLeadCardData {
  const city =
    lead.address
      ?.split(",")
      .map((part) => part.trim())
      .filter(Boolean)[0] ?? "N/A";
  const estimatedValue =
    typeof lead.estimatedValue === "number"
      ? lead.estimatedValue.toLocaleString(undefined, {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        })
      : "TBD";
  const status = lead.status ?? "NEW";
  const badge = STATUS_TO_BADGE[status] ?? "LEAD";

  return {
    badge,
    badgeVariant: status === "QUALIFIED" || status === "WON" ? "yellow" : "cyan",
    title: lead.customerName ? `Lead for ${lead.customerName}` : "Lead",
    system: "TBD",
    panels: "TBD",
    battery: "TBD",
    inverter: "TBD",
    city,
    buildingType: "N/A",
    price: estimatedValue,
  };
}

function FilterFunnelIcon({ className }: { className?: string }) {
  return (
    <svg
      width={17}
      height={17}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      width={17}
      height={17}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M4 6.5L8 10L12 6.5"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LeadFilterSelect({
  label,
  defaultValue,
}: {
  label: string;
  defaultValue: string;
}) {
  return (
    <div className="relative h-[41px] w-full min-w-0 sm:w-[165px]">
      <select
        defaultValue={defaultValue}
        aria-label={label}
        className="h-full w-full appearance-none rounded-[10px] border border-border-soft bg-white pl-3 pr-9 font-source-sans text-[14.5px] text-ink outline-none"
      >
        <option value={defaultValue}>{defaultValue}</option>
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-muted">
        <ChevronDownIcon />
      </span>
    </div>
  );
}

function DetailPair({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-source-sans text-[12.5px] font-medium leading-tight text-ink">
        {label}
      </span>
      <span className="font-source-sans text-[12.5px] font-normal leading-tight text-muted">
        {value}
      </span>
    </div>
  );
}

function LeadCard({ card }: { card: InstallerLeadCardData }) {
  const stripClass =
    card.badgeVariant === "yellow"
      ? "bg-gold-2"
      : "bg-brand-cyan";

  return (
    <article className="flex flex-col overflow-hidden rounded-[12px] border border-border-soft bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
      <div className={classNames("h-[25px] px-3 pt-2", stripClass)}>
        <p className="font-source-sans text-[12.5px] font-semibold uppercase leading-none text-white">
          {card.badge}
        </p>
      </div>
      <div className="flex flex-col gap-4 px-4 pb-4 pt-4">
        <h3 className="font-source-sans text-[17px] font-bold tracking-[-0.41px] text-ink">
          {card.title}
        </h3>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <DetailPair label="System" value={card.system} />
          <DetailPair label="Panels" value={card.panels} />
          <DetailPair label="Battery" value={card.battery} />
          <DetailPair label="Inverter" value={card.inverter} />
          <DetailPair label="City" value={card.city} />
          <DetailPair label="Type" value={card.buildingType} />
        </div>
        <p className="text-center font-source-sans text-[25px] font-bold leading-tight text-ink">
          {card.price}
        </p>
        <button
          type="button"
          className="w-full rounded-[10px] bg-brand-cyan py-2.5 text-center font-source-sans text-[12.5px] font-semibold text-white shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] transition-opacity hover:opacity-95"
        >
          Sign Up to Buy
        </button>
      </div>
    </article>
  );
}

/** Figma 3:2206 — installer lead filters + four lead cards */
export function InstallerLeadMarketplaceSection() {
  const [liveLeads, setLiveLeads] = useState<LeadListItem[] | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadLeads = async () => {
      try {
        const response = await fetch("/api/installers/leads?limit=8", {
          cache: "no-store",
        });
        if (!response.ok) return;
        const json = (await response.json()) as PaginatedApiResponse<LeadListItem>;
        const rows = Array.isArray(json.data) ? json.data : [];
        if (mounted) {
          setLiveLeads(rows);
        }
      } catch {
        if (mounted) {
          setLiveLeads(null);
        }
      }
    };

    void loadLeads();
    return () => {
      mounted = false;
    };
  }, []);

  const cards = useMemo(() => {
    if (!liveLeads || liveLeads.length === 0) {
      return INSTALLER_LEAD_MARKETPLACE_CARDS;
    }
    return liveLeads.slice(0, 8).map(toCard);
  }, [liveLeads]);

  return (
    <section
      className="mx-auto flex max-w-[1260px] flex-col gap-8 px-4 py-10 sm:px-6 lg:px-[90px]"
      data-node-id="3:2206"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3 lg:gap-4">
          <div className="flex items-center gap-2">
            <FilterFunnelIcon className="shrink-0 text-ink" />
            <span className="font-source-sans text-[16.5px] font-medium leading-none text-ink">
              Filter by:
            </span>
          </div>
          <LeadFilterSelect label="Building Type" defaultValue="Building Type" />
          <LeadFilterSelect label="System Type" defaultValue="System Type" />
          <LeadFilterSelect label="City" defaultValue="City" />
        </div>
        <div className="flex flex-wrap items-center gap-2 lg:gap-2">
          <span className="font-source-sans text-[14.5px] text-muted">
            Lead Postcode
          </span>
          <input
            type="text"
            inputMode="numeric"
            placeholder=""
            aria-label="Lead postcode"
            className="h-[41px] w-full min-w-[140px] rounded-[10px] border border-border-soft bg-white px-3 font-source-sans text-[14.5px] text-ink outline-none sm:w-[165px]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 xl:gap-[19px]">
        {cards.map((card, index) => (
          <LeadCard key={`${card.title}-${index}`} card={card} />
        ))}
      </div>
    </section>
  );
}
