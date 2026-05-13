"use client";

import { SolarMaintenanceWizard } from "@/components/customer/solar-maintenance/SolarMaintenanceWizard";
import { DesignTopBar } from "@/components/modules/DesignTopBar";

export function SolarMaintenancePageView() {
  return (
    <div className="solar-maint-hero-root font-inter">
      <div className="solar-maint-hero-photo" aria-hidden />
      <div className="solar-maint-hero-vignette" aria-hidden />
      <div className="relative z-10">
        <DesignTopBar />
      </div>
      <div className="relative z-10 flex flex-1 flex-col px-4 pb-12 pt-4 sm:px-8">
        <div className="flex flex-1 justify-center sm:mt-8">
          <SolarMaintenanceWizard />
        </div>
      </div>
    </div>
  );
}
