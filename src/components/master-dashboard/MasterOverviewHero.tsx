import Icon from "@/components/ui/Icons";
import { MASTER_OVERVIEW_SECTIONS } from "@/utils/constant";

export function MasterOverviewHero() {
  return (
    <div className="master-section-banner flex items-center justify-between rounded-[10px] px-4 py-3">
      <div className="space-y-1">
        <h2 className="master-overview-title">{MASTER_OVERVIEW_SECTIONS.pageTitle}</h2>
        <p className="master-overview-subtitle">
          {MASTER_OVERVIEW_SECTIONS.pageSubtitle}
        </p>
      </div>
      <div className="master-pill-bg master-pill-border hidden items-center gap-2 rounded-[8px] border px-3 py-2 md:flex">
        <Icon name="Calendar" className="size-4 text-gray-1" aria-hidden />
        <span className="master-pill-label master-overview-pill">
          {MASTER_OVERVIEW_SECTIONS.dateRangeLabel}
        </span>
      </div>
    </div>
  );
}
