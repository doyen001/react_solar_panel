import Icon from "@/components/ui/Icons";
import { MASTER_INSTALLERS_PAGE } from "@/utils/constant";

export function MasterInstallersHero() {
  return (
    <div className="flex items-start gap-3">
      <div className="master-ins-hero-icon" aria-hidden>
        <Icon name="Building2" className="size-5" />
      </div>
      <div className="space-y-0.5">
        <h1 className="master-ins-title">{MASTER_INSTALLERS_PAGE.title}</h1>
        <p className="master-ins-subtitle">{MASTER_INSTALLERS_PAGE.subtitle}</p>
      </div>
    </div>
  );
}
