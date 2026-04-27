"use client";

import Icon from "@/components/ui/Icons";
import {
  MASTER_INSTALLERS_FILTERS,
  MASTER_INSTALLERS_PAGE,
  type MasterInstallersFilterId,
} from "@/utils/constant";

type Props = {
  filterId: MasterInstallersFilterId;
  onFilterChange: (id: MasterInstallersFilterId) => void;
  search: string;
  onSearchChange: (value: string) => void;
};

export function MasterInstallersToolbar({
  filterId,
  onFilterChange,
  search,
  onSearchChange,
}: Props) {
  return (
    <div className="master-ins-toolbar">
      <div className="master-ins-filter-shell" aria-label="Installer status filters">
        {MASTER_INSTALLERS_FILTERS.map((filter) => {
          const active = filter.id === filterId;
          return (
            <button
              key={filter.id}
              type="button"
              className={`master-ins-filter-chip ${active ? "master-ins-filter-chip-active" : ""}`}
              onClick={() => onFilterChange(filter.id)}
            >
              <span>{filter.label}</span>
              <span className="master-ins-filter-count">({filter.count})</span>
            </button>
          );
        })}
      </div>
      <div className="master-ins-search-wrap">
        <Icon name="Search" className="master-ins-search-icon" aria-hidden />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search installers..."
          className="master-ins-search-field"
          aria-label={`Search ${MASTER_INSTALLERS_PAGE.title}`}
        />
      </div>
    </div>
  );
}
