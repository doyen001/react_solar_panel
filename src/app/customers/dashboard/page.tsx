"use client";

import { useEffect, useState } from "react";
import { CustomerDashboardHeader } from "@/components/customer/dashboard/CustomerDashboardHeader";
import { DashboardKpiCard } from "@/components/customer/dashboard/DashboardKpiCard";
import { DashboardWelcomeBanner } from "@/components/customer/dashboard/DashboardWelcomeBanner";
import { ProjectTimeline } from "@/components/customer/dashboard/ProjectTimeline";
import { TimelineInstallerCard } from "@/components/customer/dashboard/TimelineInstallerCard";
import { YourDesignsSection } from "@/components/customer/dashboard/YourDesignsSection";
import { useAppSelector } from "@/lib/store/hooks";
import { CUSTOMER_PORTAL } from "@/utils/constant";

export default function CustomerDashboardPage() {
  const user = useAppSelector((s) => s.customerAuth.user);
  const { dashboard } = CUSTOMER_PORTAL;

  const [activeNav, setActiveNav] = useState<"dashboard" | "designs">(
    "dashboard",
  );
  useEffect(() => {
    const sync = () => {
      if (typeof window === "undefined") return;
      setActiveNav(
        window.location.hash === "#your-designs" ? "designs" : "dashboard",
      );
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const [selectedDesignId, setSelectedDesignId] = useState("a");
  const [timelineActiveIndex] = useState(dashboard.defaultTimelineActiveIndex);

  return (
    <div className="customer-page-bg flex min-h-screen flex-col">
      <CustomerDashboardHeader
        firstName={user?.firstName}
        lastName={user?.lastName}
        activeNav={activeNav}
      />

      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-4 px-4 py-5 md:px-5">
        <DashboardWelcomeBanner
          firstName={user?.firstName?.trim() || "James"}
          journeyPercent={dashboard.welcome.journeyPercent}
          systemKw={dashboard.welcome.systemKw}
          savingsYr={dashboard.welcome.savingsYr}
          nextStep={dashboard.welcome.nextStep}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dashboard.kpis.map((kpi) => (
            <DashboardKpiCard
              key={kpi.id}
              label={kpi.label}
              value={kpi.value}
              sublabel={kpi.sublabel}
              icon={kpi.icon}
              iconTintClass={kpi.iconTintClass}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.48fr)] xl:items-start">
          <YourDesignsSection
            options={dashboard.designOptions}
            selectedId={selectedDesignId}
            onSelect={setSelectedDesignId}
          />

          <ProjectTimeline
            activeStepIndex={timelineActiveIndex}
            steps={dashboard.timelineSteps}
            footer={
              <TimelineInstallerCard
                initials={dashboard.installer.initials}
                companyName={dashboard.installer.companyName}
                subtitle={dashboard.installer.subtitle}
              />
            }
          />
        </div>
      </main>
    </div>
  );
}
