"use client";

import { CustomerSectionHeader } from "@/components/customer/CustomerSectionHeader";
import { DesignOptionCard } from "./DesignOptionCard";
import type { DesignOption } from "./types";

type Props = {
  options: readonly DesignOption[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function YourDesignsSection({ options, selectedId, onSelect }: Props) {
  const selectedCount = selectedId ? 1 : 0;

  return (
    <section
      id="your-designs"
      className="customer-panel-bg customer-panel-border-accent overflow-hidden rounded-[14px] border"
    >
      <CustomerSectionHeader
        variant="dark"
        title="Your System Designs"
        meta={`${options.length} options · ${selectedCount} selected`}
      />

      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
        {options.map((opt) => (
          <DesignOptionCard
            key={opt.id}
            option={opt}
            selected={opt.id === selectedId}
            onSelect={() => onSelect(opt.id)}
          />
        ))}
      </div>
    </section>
  );
}
