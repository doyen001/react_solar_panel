import Icon from "@/components/ui/Icons";
import type { IconType } from "@/components/ui/Icons";
import {
  MASTER_INVOICE_TABLE_COLUMNS,
  type MasterInvoiceActionId,
  type MasterInvoiceRow,
  type MasterInvoiceRowStatus,
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

function statusPill(row: MasterInvoiceRow) {
  const map: Record<
    MasterInvoiceRowStatus,
    { className: string; label: string; icon: IconType }
  > = {
    sent: {
      className: "master-inv-status-pill master-inv-status-pill-sent",
      label: "Sent",
      icon: "Send",
    },
    paid: {
      className: "master-inv-status-pill master-inv-status-pill-paid",
      label: "Paid",
      icon: "CheckCircle",
    },
    overdue: {
      className: "master-inv-status-pill master-inv-status-pill-overdue",
      label: "Overdue",
      icon: "AlertTriangle",
    },
    draft: {
      className: "master-inv-status-pill master-inv-status-pill-draft",
      label: "Draft",
      icon: "FileText",
    },
  };
  const cfg = map[row.status];
  return (
    <span className={cfg.className}>
      <Icon name={cfg.icon} aria-hidden />
      {cfg.label}
    </span>
  );
}

const actionIcon: Record<MasterInvoiceActionId, IconType> = {
  check: "Check",
  send: "Send",
  eye: "Eye",
  trash: "Trash2",
};

function actionLabel(row: MasterInvoiceRow, action: MasterInvoiceActionId) {
  const n = row.invoiceNumber;
  switch (action) {
    case "check":
      return `Mark invoice ${n} as paid`;
    case "send":
      return `Send invoice ${n}`;
    case "eye":
      return `View invoice ${n}`;
    case "trash":
      return `Delete invoice ${n}`;
  }
}

type Props = {
  rows: MasterInvoiceRow[];
};

export function MasterInvoicesTable({ rows }: Props) {
  return (
    <div className="master-inv-table-shell">
      <div className="master-inv-table-scroll">
        <div className="master-inv-table-grid master-inv-table-head">
          {MASTER_INVOICE_TABLE_COLUMNS.map((col) => (
            <span key={col.id} className={cellAlignClass(col.align)}>
              {col.label}
            </span>
          ))}
        </div>
        {rows.map((row) => (
          <div
            key={row.id}
            className="master-inv-table-grid master-inv-table-row"
          >
            <span className={cellAlignClass("left")}>
              <span className="master-inv-invoice-num">{row.invoiceNumber}</span>
            </span>
            <span className={cellAlignClass("left")}>
              {row.kind === "internal" ? (
                <span className="master-inv-type-pill master-inv-type-pill-int">
                  <Icon name="Building2" aria-hidden />
                  INT
                </span>
              ) : (
                <span className="master-inv-type-pill master-inv-type-pill-cust">
                  <Icon name="User" aria-hidden />
                  CUST
                </span>
              )}
            </span>
            <span className={`${cellAlignClass("left")} master-inv-from-cell`}>
              {row.fromName}
            </span>
            <span className={cellAlignClass("left")}>
              <span className="master-inv-to-cell">
                <span
                  className={`master-inv-to-avatar ${row.to.avatarTone === "navy" ? "master-inv-to-avatar-navy" : "master-inv-to-avatar-warm"}`}
                  aria-hidden
                >
                  {row.to.initials}
                </span>
                <span className="master-inv-to-name">{row.to.name}</span>
              </span>
            </span>
            <span className={`${cellAlignClass("left")} master-inv-date-cell`}>
              {row.issueDate}
            </span>
            <span className={`${cellAlignClass("left")} master-inv-date-cell`}>
              {row.dueDate}
            </span>
            <span className={`${cellAlignClass("right")} master-inv-total-cell tabular-nums`}>
              {row.total}
            </span>
            <span className={cellAlignClass("center")}>
              <span className="master-inv-status-cell">{statusPill(row)}</span>
            </span>
            <span className={cellAlignClass("center")}>
              <span className="master-inv-actions-cell">
                {row.actions.map((action) => (
                  <button
                    key={action}
                    type="button"
                    className="master-inv-action-btn"
                    aria-label={actionLabel(row, action)}
                  >
                    <Icon name={actionIcon[action]} className="size-3" />
                  </button>
                ))}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
