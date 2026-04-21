import { InstallerDashboardShell } from "@/components/installer/dashboard/InstallerDashboardShell";
import { InstallerScheduleCalendar } from "@/components/installer/home-dashboard/InstallerScheduleCalendar";

export default function InstallerDashboardSchedulePage() {
  return (
    <InstallerDashboardShell activeSubTab="schedule">
      <InstallerScheduleCalendar />
    </InstallerDashboardShell>
  );
}
