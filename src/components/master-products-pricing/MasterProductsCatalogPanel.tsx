"use client";

import { useMemo } from "react";
import Icon, { type IconType } from "@/components/ui/Icons";
import {
  MASTER_PRODUCT_ADD_LABEL,
  MASTER_PRODUCT_CATALOG_ROWS,
  MASTER_PRODUCT_CATEGORIES,
  MASTER_PRODUCT_SEARCH_PLACEHOLDER,
  MASTER_PRODUCT_TABLE_COLUMNS,
  type MasterProductCatalogRow,
  type MasterProductCategoryId,
} from "@/utils/constant";

type Props = {
  categoryId: MasterProductCategoryId;
  onCategoryChange: (id: MasterProductCategoryId) => void;
  search: string;
  onSearchChange: (value: string) => void;
};

function filterRows(
  rows: MasterProductCatalogRow[],
  categoryId: MasterProductCategoryId,
  search: string,
) {
  const q = search.trim().toLowerCase();
  return rows.filter((row) => {
    if (categoryId !== "all" && row.category !== categoryId) {
      return false;
    }
    if (!q) {
      return true;
    }
    const hay = `${row.name} ${row.subtitle} ${row.sku} ${row.brand}`.toLowerCase();
    return hay.includes(q);
  });
}

export function MasterProductsCatalogPanel({
  categoryId,
  onCategoryChange,
  search,
  onSearchChange,
}: Props) {
  const filtered = useMemo(
    () => filterRows(MASTER_PRODUCT_CATALOG_ROWS, categoryId, search),
    [categoryId, search],
  );

  return (
    <div className="master-pp-card">
      <div className="master-pp-catalog-toolbar">
        <div className="master-pp-chip-row">
          {MASTER_PRODUCT_CATEGORIES.map((cat) => {
            const active = cat.id === categoryId;
            return (
              <button
                key={cat.id}
                type="button"
                className={
                  active ? "master-pp-chip-active" : "master-pp-chip-inactive"
                }
                onClick={() => onCategoryChange(cat.id)}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
        <div className="master-pp-catalog-actions w-full lg:w-auto">
          <div className="master-pp-search-wrap w-full lg:max-w-[320px]">
            <input
              type="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={MASTER_PRODUCT_SEARCH_PLACEHOLDER}
              className="master-pp-search-field"
              aria-label={MASTER_PRODUCT_SEARCH_PLACEHOLDER}
            />
            <span className="master-pp-search-icon" aria-hidden>
              <Icon name="Search" className="size-[18px]" />
            </span>
          </div>
          <button type="button" className="master-pp-add-button shrink-0">
            <Icon name="Plus" className="size-3.5 shrink-0" />
            {MASTER_PRODUCT_ADD_LABEL}
          </button>
        </div>
      </div>

      <div className="master-pp-table-scroll">
        <div className="min-w-0">
          <div className="master-pp-table-grid master-pp-table-head">
            <span aria-hidden className="block" />
            {MASTER_PRODUCT_TABLE_COLUMNS.map((col) => (
              <span
                key={col.id}
                className={col.align === "right" ? "text-right" : "text-left"}
              >
                {col.label}
              </span>
            ))}
          </div>
          {filtered.map((row) => (
            <div
              key={row.id}
              className="master-pp-table-grid master-pp-table-row"
            >
              <div className="master-pp-row-icon-well" aria-hidden>
                <Icon
                  name={row.rowIcon as IconType}
                  className="size-4 shrink-0"
                />
              </div>
              <div className="min-w-0">
                <p className="master-pp-product-name truncate">{row.name}</p>
                <p className="master-pp-product-sub truncate">{row.subtitle}</p>
              </div>
              <span className="master-pp-table-cell-muted truncate">
                {row.sku}
              </span>
              <span className="master-pp-table-cell-muted truncate">
                {row.brand}
              </span>
              <span className="master-pp-price-retail text-right tabular-nums">
                {row.retail}
              </span>
              <span className="master-pp-price-wholesale text-right tabular-nums">
                {row.wholesale}
              </span>
              <span className="master-pp-margin text-right tabular-nums">
                {row.margin}
              </span>
              <div className="master-pp-actions-cell">
                <button
                  type="button"
                  className="master-pp-action-btn"
                  aria-label={`Edit ${row.name}`}
                >
                  <Icon name="Pencil" className="size-4" />
                </button>
                <button
                  type="button"
                  className="master-pp-action-btn"
                  aria-label={`Delete ${row.name}`}
                >
                  <Icon name="Trash2" className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
