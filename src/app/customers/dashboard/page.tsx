"use client";

import { useEffect, useState } from "react";
import { CustomerDashboardHeader } from "@/components/customer/dashboard/CustomerDashboardHeader";
import {
  DASHBOARD_DESIGN_OPTIONS,
  DASHBOARD_TIMELINE_STEPS,
  DEFAULT_TIMELINE_ACTIVE_INDEX,
} from "@/components/customer/dashboard/dashboardConstants";
import { DashboardKpiCard } from "@/components/customer/dashboard/DashboardKpiCard";
import { DashboardWelcomeBanner } from "@/components/customer/dashboard/DashboardWelcomeBanner";
import { ProjectTimeline } from "@/components/customer/dashboard/ProjectTimeline";
import { TimelineInstallerCard } from "@/components/customer/dashboard/TimelineInstallerCard";
import { YourDesignsSection } from "@/components/customer/dashboard/YourDesignsSection";
import { useAppSelector } from "@/lib/store/hooks";

export default function CustomerDashboardPage() {
  const user = useAppSelector((s) => s.customerAuth.user);

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
  /**
   * 0-based index of the active timeline step (matches Figma: “Installation Scheduled”).
   * To drive from API: `const [i, setI] = useState(...);` and call `setI` when status changes.
   */
  const [timelineActiveIndex] = useState(DEFAULT_TIMELINE_ACTIVE_INDEX);

  return (
    <div className="flex min-h-screen flex-col">
      <CustomerDashboardHeader
        firstName={user?.firstName}
        lastName={user?.lastName}
        activeNav={activeNav}
      />

      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-4 px-4 py-5 md:px-5">
        <DashboardWelcomeBanner
          firstName={user?.firstName?.trim() || "James"}
          journeyPercent={67}
          systemKw="6.6 kW"
          savingsYr="$1,840/yr"
          nextStep="Installation"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardKpiCard
            label="System Size"
            value="6.6 kW"
            sublabel="16 panels"
            icon="Light"
            iconBgClass="bg-navy-800/7"
          />
          <DashboardKpiCard
            label="Annual Output"
            value="9,636 kWh"
            sublabel="projected"
            icon="LightCheck"
            iconBgClass="bg-orange-amber/7"
          />
          <DashboardKpiCard
            label="Est. Savings"
            value="$1,840/yr"
            sublabel="per year"
            icon="Dollar"
            iconBgClass="bg-success/7"
          />
          <DashboardKpiCard
            label="Total Price"
            value="$8,500"
            sublabel="inc. installation"
            icon="Shop"
            iconBgClass="bg-navy-800/7"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.48fr)] xl:items-start">
          <YourDesignsSection
            options={DASHBOARD_DESIGN_OPTIONS}
            selectedId={selectedDesignId}
            onSelect={setSelectedDesignId}
          />

          <ProjectTimeline
            activeStepIndex={timelineActiveIndex}
            steps={DASHBOARD_TIMELINE_STEPS}
            footer={
              <TimelineInstallerCard
                initials="SM"
                companyName="SolarMax Pro"
                subtitle="Verified Partner"
              />
            }
          />
        </div>
      </main>
    </div>
  );
}
