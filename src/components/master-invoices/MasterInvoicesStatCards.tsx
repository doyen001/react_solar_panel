import Icon from "@/components/ui/Icons";
import { MASTER_INVOICE_STAT_CARDS } from "@/utils/constant";

export function MasterInvoicesStatCards() {
  return (
    <div className="master-inv-stat-grid">
      {MASTER_INVOICE_STAT_CARDS.map((card) => (
        <div key={card.id} className="master-inv-stat-card">
          <div className="master-inv-stat-label-row">
            <Icon name={card.icon} aria-hidden />
            <span className="master-inv-stat-label">{card.label}</span>
          </div>
          <p className="master-inv-stat-value">{card.value}</p>
          {"footnote" in card && card.footnote ? (
            <p className="master-inv-stat-foot">{card.footnote}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
