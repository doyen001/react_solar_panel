"use client";

import { useMemo, useState } from "react";
import {
  MASTER_INVOICE_ROWS,
  type MasterInvoiceRow,
  type MasterInvoiceStatusFilterId,
  type MasterInvoiceTypeTabId,
} from "@/utils/constant";
import { MasterInvoicesHero } from "./MasterInvoicesHero";
import { MasterInvoicesStatCards } from "./MasterInvoicesStatCards";
import { MasterInvoicesTable } from "./MasterInvoicesTable";
import { MasterInvoicesToolbar } from "./MasterInvoicesToolbar";

function filterRows(
  rows: MasterInvoiceRow[],
  typeTab: MasterInvoiceTypeTabId,
  statusFilter: MasterInvoiceStatusFilterId,
  search: string,
) {
  const q = search.trim().toLowerCase();
  return rows.filter((row) => {
    if (typeTab === "customer" && row.kind !== "customer") {
      return false;
    }
    if (typeTab === "internal" && row.kind !== "internal") {
      return false;
    }
    if (statusFilter !== "all" && row.status !== statusFilter) {
      return false;
    }
    if (!q) {
      return true;
    }
    const hay = `${row.invoiceNumber} ${row.fromName} ${row.to.name}`.toLowerCase();
    return hay.includes(q);
  });
}

export function MasterInvoicesContent() {
  const [typeTab, setTypeTab] = useState<MasterInvoiceTypeTabId>("all");
  const [statusFilter, setStatusFilter] =
    useState<MasterInvoiceStatusFilterId>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => filterRows(MASTER_INVOICE_ROWS, typeTab, statusFilter, search),
    [typeTab, statusFilter, search],
  );

  return (
    <main className="mx-auto max-w-[1440px] space-y-6 px-5 py-6">
      <MasterInvoicesHero />
      <MasterInvoicesStatCards />
      <MasterInvoicesToolbar
        typeTab={typeTab}
        onTypeTabChange={setTypeTab}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        search={search}
        onSearchChange={setSearch}
      />
      <MasterInvoicesTable rows={filtered} />
    </main>
  );
}
