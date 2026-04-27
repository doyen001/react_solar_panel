import { MasterDashboardHeader } from "@/components/master-dashboard/MasterDashboardHeader";
import { MasterInstallersContent } from "@/components/master-installers/MasterInstallersContent";

export default function MasterInstallersPage() {
  return (
    <div className="min-h-screen master-page-bg">
      <MasterDashboardHeader activeNavId="installers" />
      <MasterInstallersContent />
    </div>
  );
}
