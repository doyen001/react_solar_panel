import Icon from "@/components/ui/Icons";
import {
  MASTER_SPECIAL_PRICING_ROWS,
  MASTER_SPECIAL_PRICING_TABLE_COLUMNS,
} from "@/utils/constant";

function cellAlignClass(align: "left" | "right" | "center") {
  if (align === "right") {
    return "text-right";
  }
  if (align === "center") {
    return "text-center";
  }
  return "text-left";
}

export function MasterSpecialPricingTable() {
  return (
    <div className="master-sp-table-scroll">
      <div className="master-sp-table-grid master-sp-table-head">
        {MASTER_SPECIAL_PRICING_TABLE_COLUMNS.map((col) => (
          <span key={col.id} className={cellAlignClass(col.align)}>
            {col.label}
          </span>
        ))}
      </div>
      {MASTER_SPECIAL_PRICING_ROWS.map((row) => (
        <div key={row.id} className="master-sp-table-grid master-sp-table-row">
          <div className="master-sp-installer-cell">
            <span className="master-sp-avatar" aria-hidden>
              {row.installerInitials}
            </span>
            <span className="master-sp-installer-name">
              {row.installerName}
            </span>
          </div>
          <span className="master-sp-product-name">{row.productName}</span>
          <span className="master-sp-price-wholesale text-right tabular-nums">
            {row.wholesale}
          </span>
          <span className="master-sp-price-special text-right tabular-nums">
            {row.specialPrice}
          </span>
          <span className="master-sp-discount text-right tabular-nums">
            {row.discount}
          </span>
          <span className="master-sp-valid-date">{row.validUntil}</span>
          <div className="master-sp-actions-cell">
            <button
              type="button"
              className="master-sp-action-btn"
              aria-label={`Edit special price for ${row.productName}`}
            >
              <Icon name="Pencil" className="size-3" />
            </button>
            <button
              type="button"
              className="master-sp-action-btn"
              aria-label={`Remove special price for ${row.productName}`}
            >
              <Icon name="Trash2" className="size-3" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
