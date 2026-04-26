import { MasterInvoicesContent } from "@/components/master-invoices/MasterInvoicesContent";
import { MasterDashboardHeader } from "@/components/master-dashboard/MasterDashboardHeader";

export default function MasterInvoicesPage() {
  return (
    <div className="min-h-screen master-page-bg">
      <MasterDashboardHeader activeNavId="invoices" />
      <MasterInvoicesContent />
    </div>
  );
}
