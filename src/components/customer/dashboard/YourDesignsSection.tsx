"use client";

import { CustomerSectionHeader } from "@/components/customer/CustomerSectionHeader";
import { CustomDesignImageAction } from "./CustomDesignImageAction";
import { DesignOptionCard } from "./DesignOptionCard";
import {
  formatOptionPrice,
  type DesignOptionCard as DesignOptionCardData,
} from "@/lib/customers/design-options";

type Props = {
  options: readonly DesignOptionCardData[];
  selectedKey: string | null;
  /** True once the chosen design is approved; selection is then read-only. */
  locked?: boolean;
  loading?: boolean;
  savingKey?: string | null;
  onSelect: (key: string) => void;
};

function formatKw(kw: number): string {
  return kw > 0 ? `${kw.toFixed(1)} kW` : "—";
}

function formatOutput(kwh: number): string {
  return kwh > 0 ? `${new Intl.NumberFormat("en-AU").format(kwh)} kWh` : "—";
}

function formatSavings(value: number): string {
  return value > 0 ? `${formatOptionPrice(value)}/yr` : "—";
}

export function YourDesignsSection({
  options,
  selectedKey,
  locked = false,
  loading = false,
  savingKey = null,
  onSelect,
}: Props) {
  const selectedCount = selectedKey ? 1 : 0;

  return (
    <section
      id="your-designs"
      className="customer-panel-bg customer-panel-border-accent overflow-hidden rounded-[14px] border"
    >
      <CustomerSectionHeader
        variant="dark"
        title="Your System Designs"
        meta={
          loading
            ? "Loading…"
            : `${options.length} options · ${selectedCount} selected`
        }
      />

      {locked ? (
        <p className="border-b customer-card-border px-4 py-2 font-dm-sans text-xs customer-text-muted">
          Your design has been approved, so your choice is locked. Contact your
          installer to change it.
        </p>
      ) : null}

      {loading ? (
        <p className="p-4 font-dm-sans text-sm customer-text-muted">
          Loading your design options…
        </p>
      ) : options.length === 0 ? (
        <p className="p-4 font-dm-sans text-sm customer-text-muted">
          No design options are available yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 items-stretch gap-4 p-4 sm:grid-cols-2">
          {options.map((opt) => (
            <DesignOptionCard
              key={opt.key}
              selected={opt.key === selectedKey}
              disabled={locked || savingKey != null}
              onSelect={() => onSelect(opt.key)}
              option={{
                id: opt.key,
                title:
                  savingKey === opt.key ? `${opt.title} — saving…` : opt.title,
                badge: opt.status === "COMPLETED" ? "approved" : "draft",
                kw: formatKw(opt.kw),
                panels: opt.panelCount > 0 ? `${opt.panelCount} panels` : "—",
                price: formatOptionPrice(opt.price),
                savingsPerYr: formatSavings(opt.estimatedSavings),
                outputKwh: formatOutput(opt.annualOutputKwh),
                imageSrc: opt.imageSrc,
              }}
              imageAction={<CustomDesignImageAction option={opt} />}
            />
          ))}
        </div>
      )}
    </section>
  );
}
