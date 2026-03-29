"use client";

import { useMemo } from "react";
import { CustomerDashboardHeader } from "@/components/customer/dashboard/CustomerDashboardHeader";
import { DesignComparisonTable } from "@/components/customer/design/DesignComparisonTable";
import { DesignPageToolbar } from "@/components/customer/design/DesignPageToolbar";
import { ReferralProgramCard } from "@/components/customer/design/ReferralProgramCard";
import { SelectedDesignPanel } from "@/components/customer/design/SelectedDesignPanel";
import { ShareJourneyCard } from "@/components/customer/design/ShareJourneyCard";
import { YourEquipmentSection } from "@/components/customer/design/YourEquipmentSection";
import { initialsFromPersonName } from "@/lib/customer/initialsFromName";
import { useAppSelector } from "@/lib/store/hooks";

export default function CustomerDesignPage() {
  const user = useAppSelector((s) => s.customerAuth.user);

  const shareUrl = useMemo(() => {
    const raw = initialsFromPersonName(user?.firstName, user?.lastName)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    const slug = raw || "guest";
    return `https://easylink.solar/share/${slug}-6.6kw-design`;
  }, [user?.firstName, user?.lastName]);

  return (
    <div className="flex min-h-screen flex-col">
      <CustomerDashboardHeader
        firstName={user?.firstName}
        lastName={user?.lastName}
        activeNav="designs"
        headerAccessory={<DesignPageToolbar />}
      />

      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-4 px-4 py-5 md:gap-5 md:px-5">
        <SelectedDesignPanel
          title="Selected Design – Design A – Standard"
          lastUpdated="28 Jan 2026"
          savingsLabel="Estimated savings: $1,840/yr"
        />

        <YourEquipmentSection />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
          <ShareJourneyCard shareUrl={shareUrl} />
          <ReferralProgramCard />
        </div>

        <DesignComparisonTable />
      </main>
    </div>
  );
}
