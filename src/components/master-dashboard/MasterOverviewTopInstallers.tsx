import { MASTER_OVERVIEW_SECTIONS, MASTER_TOP_INSTALLERS } from "@/utils/constant";

export function MasterOverviewTopInstallers() {
  return (
    <article className="master-section-shell">
      <div className="master-overview-card-head">
        <h3 className="master-section-title">{MASTER_OVERVIEW_SECTIONS.topInstallersTitle}</h3>
      </div>

      <div className="space-y-2 px-4 pb-4">
        {MASTER_TOP_INSTALLERS.slice(0, 6).map((installer) => (
          <div key={installer.rank} className="master-overview-installer-row">
            <div className="flex min-w-0 items-center gap-2">
              <div className={`master-overview-avatar ${installer.avatarClass}`}>
                {installer.initials}
              </div>
              <div className="min-w-0">
                <p className="master-overview-installer-name">{installer.name}</p>
                <p className="master-footnote text-[10px]">{installer.clientsLabel}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="master-overview-installer-track">
                <span
                  className="master-installer-bar block h-full rounded-full"
                  style={{ width: `${installer.volumeRatio * 100}%` }}
                />
              </div>
              <p className="master-overview-installer-revenue">{installer.revenue}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
