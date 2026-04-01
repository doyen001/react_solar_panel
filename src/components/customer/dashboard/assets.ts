import type { StaticImageData } from "next/image";
import dashboardActionHelp from "@/components/ui/Icons/dashboard-action-help.svg";
import dashboardActionMessage from "@/components/ui/Icons/dashboard-action-message.svg";
import dashboardActionPdf from "@/components/ui/Icons/dashboard-action-pdf.svg";
import dashboardActionProducts from "@/components/ui/Icons/dashboard-action-products.svg";
import dashboardActionSchedule from "@/components/ui/Icons/dashboard-action-schedule.svg";
import dashboardBell from "@/components/ui/Icons/dashboard-bell.svg";
import dashboardCheck from "@/components/ui/Icons/dashboard-check.svg";
import dashboardCheckCircle from "@/components/ui/Icons/dashboard-check-circle.svg";
import dashboardKpiOutput from "@/components/ui/Icons/dashboard-kpi-output.svg";
import dashboardKpiPrice from "@/components/ui/Icons/dashboard-kpi-price.svg";
import dashboardKpiSavings from "@/components/ui/Icons/dashboard-kpi-savings.svg";
import dashboardKpiSystem from "@/components/ui/Icons/dashboard-kpi-system.svg";
import dashboardMessageSquare from "@/components/ui/Icons/dashboard-message-square.svg";
import dashboardSearch from "@/components/ui/Icons/dashboard-search.svg";
import dashboardSun from "@/components/ui/Icons/dashboard-sun.svg";

/** Local SVGs under `components/ui/Icons/dashboard-*.svg` (bundled like other Icons). */
export const dashboardAssets = {
  search: dashboardSearch,
  bell: dashboardBell,
  sun: dashboardSun,
  kpiSystem: dashboardKpiSystem,
  kpiOutput: dashboardKpiOutput,
  kpiSavings: dashboardKpiSavings,
  kpiPrice: dashboardKpiPrice,
  checkCircle: dashboardCheckCircle,
  check: dashboardCheck,
  messageSquare: dashboardMessageSquare,
  actionPdf: dashboardActionPdf,
  actionProducts: dashboardActionProducts,
  actionMessage: dashboardActionMessage,
  actionSchedule: dashboardActionSchedule,
  actionHelp: dashboardActionHelp,
} as const satisfies Record<string, StaticImageData>;
