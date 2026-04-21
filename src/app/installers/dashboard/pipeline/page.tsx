"use client";

import { InstallerHeader } from "@/components/installer/dashboard/InstallerHeader";
import { MonthlyPerformanceSection } from "@/components/installer/pipeline-dashboard/MonthlyPerformanceSection";
import { PRIMARY_KPIS } from "@/components/installer/pipeline-dashboard/pipelineDashboardMock";
import { PipelineDashboardTitleBar } from "@/components/installer/pipeline-dashboard/PipelineDashboardTitleBar";
import { PipelineKpiSparklineGrid } from "@/components/installer/pipeline-dashboard/PipelineKpiSparklineGrid";
import { PipelineOperationalHealth } from "@/components/installer/pipeline-dashboard/PipelineOperationalHealth";
import { PipelineOverviewBanner } from "@/components/installer/pipeline-dashboard/PipelineOverviewBanner";
import { PipelineRegionalAndLead } from "@/components/installer/pipeline-dashboard/PipelineRegionalAndLead";
import { PipelineSecondaryKpiRow } from "@/components/installer/pipeline-dashboard/PipelineSecondaryKpiRow";
import { PipelineStatStrip } from "@/components/installer/pipeline-dashboard/PipelineStatStrip";
import { PipelineStcAndFunnel } from "@/components/installer/pipeline-dashboard/PipelineStcAndFunnel";
import { PipelineTeamAndActivity } from "@/components/installer/pipeline-dashboard/PipelineTeamAndActivity";

export default function InstallerPipelinePage() {
  return (
    <div className="min-h-screen bg-surface-50">
      <InstallerHeader userInitials="ES" />

      <div className="mx-auto max-w-[1440px] px-4 py-6 md:px-4 lg:py-8">
        <PipelineDashboardTitleBar />

        <div className="mt-4 flex flex-col gap-2">
          <PipelineOverviewBanner />
          <PipelineStatStrip />
          <PipelineKpiSparklineGrid kpis={PRIMARY_KPIS} />
          <PipelineSecondaryKpiRow />
          <MonthlyPerformanceSection />
          <PipelineStcAndFunnel />
          <PipelineTeamAndActivity />
          <PipelineRegionalAndLead />
          <PipelineOperationalHealth />
        </div>
      </div>
    </div>
  );
}
