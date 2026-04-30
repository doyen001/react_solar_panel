"use client";

import type { ReactNode } from "react";
import Icon from "@/components/ui/Icons";
import { INSTALLER_LEAD_MARKETPLACE_SECTION } from "@/utils/constant";

const ALL = "";

type Props = {
  buildingType: string;
  systemType: string;
  city: string;
  postcode: string;
  buildingTypes: string[];
  systemTypes: string[];
  cities: string[];
  onBuildingType: (v: string) => void;
  onSystemType: (v: string) => void;
  onCity: (v: string) => void;
  onPostcode: (v: string) => void;
};

export function LeadMarketplaceFilterBar({
  buildingType,
  systemType,
  city,
  postcode,
  buildingTypes,
  systemTypes,
  cities,
  onBuildingType,
  onSystemType,
  onCity,
  onPostcode,
}: Props) {
  const { filters, filterAllLabel, filterByLabel } =
    INSTALLER_LEAD_MARKETPLACE_SECTION;

  const selectClass =
    "w-full min-h-[44px] appearance-none rounded-lg border border-lead-marketplace-card-border bg-white py-2.5 pl-3 pr-10 font-source-sans text-[14px] leading-snug text-ink outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/35";

  const wrapSelect = (child: ReactNode) => (
    <div className="relative min-w-[min(100%,168px)] sm:min-w-[168px]">
      {child}
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-lead-marketplace-field-label">
        <Icon name="ChevronDown" className="size-4" />
      </span>
    </div>
  );

  return (
    <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-2">
        <div className="flex shrink-0 items-center gap-2 text-lead-marketplace-filter-label">
          <Icon
            name="Funnel"
            className="size-[18px] shrink-0 text-lead-marketplace-filter-label"
          />
          <span className="font-source-sans text-[14px] font-medium leading-none">
            {filterByLabel}
          </span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
          <label className="flex min-w-0 flex-col gap-1 sm:max-w-[200px] sm:flex-1">
            <span className="font-source-sans text-[13px] font-medium leading-tight text-lead-marketplace-filter-label">
              {filters.buildingType}
            </span>
            {wrapSelect(
              <select
                aria-label={filters.buildingType}
                value={buildingType}
                onChange={(e) => onBuildingType(e.target.value)}
                className={selectClass}
              >
                <option value={ALL}>{filterAllLabel}</option>
                {buildingTypes.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>,
            )}
          </label>

          <label className="flex min-w-0 flex-col gap-1 sm:max-w-[200px] sm:flex-1">
            <span className="font-source-sans text-[13px] font-medium leading-tight text-lead-marketplace-filter-label">
              {filters.systemType}
            </span>
            {wrapSelect(
              <select
                aria-label={filters.systemType}
                value={systemType}
                onChange={(e) => onSystemType(e.target.value)}
                className={selectClass}
              >
                <option value={ALL}>{filterAllLabel}</option>
                {systemTypes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>,
            )}
          </label>

          <label className="flex min-w-0 flex-col gap-1 sm:max-w-[200px] sm:flex-1">
            <span className="font-source-sans text-[13px] font-medium leading-tight text-lead-marketplace-filter-label">
              {filters.city}
            </span>
            {wrapSelect(
              <select
                aria-label={filters.city}
                value={city}
                onChange={(e) => onCity(e.target.value)}
                className={selectClass}
              >
                <option value={ALL}>{filterAllLabel}</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>,
            )}
          </label>
        </div>
      </div>

      <div className="flex w-full flex-col gap-1 lg:w-auto lg:min-w-[180px] lg:max-w-[220px]">
        <label
          htmlFor="lead-marketplace-postcode"
          className="font-source-sans text-[13px] font-medium leading-tight text-lead-marketplace-filter-label"
        >
          {filters.postcode}
        </label>
        <input
          id="lead-marketplace-postcode"
          type="text"
          inputMode="numeric"
          autoComplete="postal-code"
          placeholder=""
          value={postcode}
          onChange={(e) => onPostcode(e.target.value.replace(/\D/g, "").slice(0, 4))}
          className="min-h-[44px] w-full rounded-lg border border-lead-marketplace-card-border bg-white px-3 font-source-sans text-[14px] text-ink outline-none placeholder:text-lead-marketplace-field-label focus-visible:ring-2 focus-visible:ring-brand-cyan/35"
        />
      </div>
    </div>
  );
}
