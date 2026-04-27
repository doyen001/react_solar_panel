"use client";

import { useMemo, useState } from "react";
import {
  MASTER_INSTALLERS_ROWS,
  type MasterInstallerEntry,
  type MasterInstallersFilterId,
} from "@/utils/constant";
import { MasterInstallersHero } from "./MasterInstallersHero";
import { MasterInstallersToolbar } from "./MasterInstallersToolbar";
import { MasterInstallersTable } from "./MasterInstallersTable";

function filterRows(
  rows: MasterInstallerEntry[],
  filterId: MasterInstallersFilterId,
  search: string,
) {
  const q = search.trim().toLowerCase();
  return rows.filter((row) => {
    if (filterId !== "all" && row.status !== filterId) {
      return false;
    }
    if (!q) {
      return true;
    }
    const hay = `${row.name} ${row.location.city} ${row.location.state}`.toLowerCase();
    return hay.includes(q);
  });
}

export function MasterInstallersContent() {
  const [filterId, setFilterId] = useState<MasterInstallersFilterId>("all");
  const [search, setSearch] = useState("");

  const rows = useMemo(
    () => filterRows(MASTER_INSTALLERS_ROWS, filterId, search),
    [filterId, search],
  );

  return (
    <main className="mx-auto max-w-[1440px] space-y-4 px-5 py-5 md:space-y-5 md:py-5">\
      <div className="flex flex-row justify-between">
        <MasterInstallersHero />
        <MasterInstallersToolbar
          filterId={filterId}
          onFilterChange={setFilterId}
          search={search}
          onSearchChange={setSearch}
        />
      </div>
      <MasterInstallersTable rows={rows} />
    </main>
  );
}
