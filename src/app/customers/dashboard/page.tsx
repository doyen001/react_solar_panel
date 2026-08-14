"use client";

import { useEffect, useState } from "react";
import { CustomerDashboardColumns } from "@/components/customer/dashboard/CustomerDashboardColumns";
import { CustomerDashboardHeader } from "@/components/customer/dashboard/CustomerDashboardHeader";
import { DashboardKpiCard } from "@/components/customer/dashboard/DashboardKpiCard";
import { DashboardWelcomeBanner } from "@/components/customer/dashboard/DashboardWelcomeBanner";
import { ProjectTimeline } from "@/components/customer/dashboard/ProjectTimeline";
import { TimelineInstallerCard } from "@/components/customer/dashboard/TimelineInstallerCard";
import { YourDesignsSection } from "@/components/customer/dashboard/YourDesignsSection";
import { toast } from "react-toastify";
import { useCustomerProjectJourney } from "@/components/customer/dashboard/useCustomerProjectJourney";
import {
  fetchDesignOptions,
  selectDesignOption,
  type DesignOptions,
} from "@/lib/customers/design-options";
import { useAppSelector } from "@/lib/store/hooks";
import { currentStepIndex, formatMilestoneDate } from "@/lib/project-journey";
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

  // The four design cards come from the server: three static packages plus the
  // customer's own custom design, with the stored selection flagged.
  const [designOptions, setDesignOptions] = useState<DesignOptions | null>(null);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchDesignOptions()
      .then((data) => {
        if (!cancelled) setDesignOptions(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          toast.error(
            err instanceof Error
              ? err.message
              : "Could not load your design options",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setOptionsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSelectDesign(key: string) {
    if (savingKey) return;
    setSavingKey(key);
    try {
      const next = await selectDesignOption(key);
      setDesignOptions(next);
      toast.success("Design selection saved.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not save your selection",
      );
    } finally {
      setSavingKey(null);
    }
  }

  // Real journey, shared with the installer pipeline bar. The backend serves
  // only customer-visible milestones, so internal stages (permits, equipment
  // orders, invoicing) never reach this view.
  const { journey, loading: journeyLoading } = useCustomerProjectJourney();

  const timelineSteps = journey
    ? journey.milestones.map((m) => ({
        id: m.key,
        title: m.label,
        dateLabel: formatMilestoneDate(m.completedAt),
      }))
    : [];

  const timelineActiveIndex = journey ? currentStepIndex(journey) : 0;

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

        <CustomerDashboardColumns
          main={
            <YourDesignsSection
              options={designOptions?.options ?? []}
              selectedKey={designOptions?.selectedKey ?? null}
              locked={designOptions?.locked ?? false}
              loading={optionsLoading}
              savingKey={savingKey}
              onSelect={(key) => void handleSelectDesign(key)}
            />
          }
          aside={
            <ProjectTimeline
              activeStepIndex={timelineActiveIndex}
              steps={timelineSteps}
              loading={journeyLoading}
              meta={
                journey
                  ? `${journey.completedCount} of ${journey.totalCount} done`
                  : undefined
              }
              footer={
                <TimelineInstallerCard
                  initials={dashboard.installer.initials}
                  companyName={dashboard.installer.companyName}
                  subtitle={dashboard.installer.subtitle}
                />
              }
            />
          }
        />
      </main>
    </div>
  );
}
