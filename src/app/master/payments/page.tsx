import { MasterPaymentsContent } from "@/components/master-payments/MasterPaymentsContent";
import { MasterDashboardHeader } from "@/components/master-dashboard/MasterDashboardHeader";

export default function MasterPaymentsPage() {
  return (
    <div className="min-h-screen master-page-bg">
      <MasterDashboardHeader activeNavId="payments" />
      <MasterPaymentsContent />
    </div>
  );
}
