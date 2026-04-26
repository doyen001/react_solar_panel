"use client";

import Icon from "@/components/ui/Icons";
import {
  MASTER_INVOICE_STATUS_FILTERS,
  MASTER_INVOICE_TYPE_TABS,
  MASTER_INVOICES_SEARCH_PLACEHOLDER,
} from "@/utils/constant";
import type {
  MasterInvoiceStatusFilterId,
  MasterInvoiceTypeTabId,
} from "@/utils/constant";

type Props = {
  typeTab: MasterInvoiceTypeTabId;
  onTypeTabChange: (id: MasterInvoiceTypeTabId) => void;
  statusFilter: MasterInvoiceStatusFilterId;
  onStatusFilterChange: (id: MasterInvoiceStatusFilterId) => void;
  search: string;
  onSearchChange: (value: string) => void;
};

export function MasterInvoicesToolbar({
  typeTab,
  onTypeTabChange,
  statusFilter,
  onStatusFilterChange,
  search,
  onSearchChange,
}: Props) {
  return (
    <div className="master-inv-toolbar">
      <div className="master-inv-toolbar-left">
        <div className="master-inv-type-shell" role="tablist" aria-label="Invoice type">
          {MASTER_INVOICE_TYPE_TABS.map((tab) => {
            const active = tab.id === typeTab;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                className={`master-inv-type-tab ${active ? "master-inv-type-tab-active" : ""}`}
                onClick={() => onTypeTabChange(tab.id)}
              >
                <Icon name={tab.icon} aria-hidden />
                {tab.label}
              </button>
            );
          })}
        </div>
        <div className="master-inv-status-filters" aria-label="Invoice status">
          {MASTER_INVOICE_STATUS_FILTERS.map((chip) => {
            const active = chip.id === statusFilter;
            return (
              <button
                key={chip.id}
                type="button"
                className={`master-inv-status-chip ${active ? "master-inv-status-chip-active" : ""}`}
                onClick={() => onStatusFilterChange(chip.id)}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="master-inv-search-wrap shrink-0 lg:ml-auto">
        <Icon name="Search" className="master-inv-search-icon" aria-hidden />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={MASTER_INVOICES_SEARCH_PLACEHOLDER}
          className="master-inv-search-field"
          aria-label={MASTER_INVOICES_SEARCH_PLACEHOLDER}
        />
      </div>
    </div>
  );
}
