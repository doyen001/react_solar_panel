"use client";

import { MasterDashboardContent } from "@/components/master-dashboard/MasterDashboardContent";
import { MasterDashboardHeader } from "@/components/master-dashboard/MasterDashboardHeader";

export default function MasterDashboardPage() {
  return (
    <div className="min-h-screen master-page-bg">
      <MasterDashboardHeader activeNavId="overview" />
      <MasterDashboardContent />
    </div>
  );
}
