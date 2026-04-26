import Icon from "@/components/ui/Icons";
import {
  MASTER_INVOICES_CREATE_LABEL,
  MASTER_INVOICES_PAGE,
} from "@/utils/constant";

export function MasterInvoicesHero() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:gap-3">
        <div className="master-inv-hero-icon" aria-hidden>
          <Icon name="FileText" className="size-5" />
        </div>
        <div className="min-w-0 space-y-1">
          <h1 className="master-inv-title">{MASTER_INVOICES_PAGE.title}</h1>
          <p className="master-inv-subtitle max-w-[560px]">
            {MASTER_INVOICES_PAGE.subtitle}
          </p>
        </div>
      </div>
      <button type="button" className="master-inv-create-btn self-start sm:self-auto">
        <Icon name="Plus" className="size-4 shrink-0" aria-hidden />
        <span>{MASTER_INVOICES_CREATE_LABEL}</span>
      </button>
    </div>
  );
}
