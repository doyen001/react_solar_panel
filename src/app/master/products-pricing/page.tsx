import { MasterProductsPricingContent } from "@/components/master-products-pricing/MasterProductsPricingContent";
import { MasterDashboardHeader } from "@/components/master-dashboard/MasterDashboardHeader";

export default function MasterProductsPricingPage() {
  return (
    <div className="min-h-screen master-page-bg">
      <MasterDashboardHeader activeNavId="products" />
      <MasterProductsPricingContent />
    </div>
  );
}
