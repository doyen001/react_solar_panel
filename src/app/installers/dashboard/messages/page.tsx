"use client";

import { InstallerHeader } from "@/components/installer/dashboard/InstallerHeader";
import { PortalRealtimeMessagesPanel } from "@/components/messages/PortalRealtimeMessagesPanel";
import { fetchWithInstallerSession } from "@/lib/installers/installer-fetch-client";
import { useAppSelector } from "@/lib/store/hooks";
import { useMemo } from "react";

export default function InstallerMessagesPage() {
  const user = useAppSelector((s) => s.installerAuth.user);

  const initials = useMemo(() => {
    const f = user?.firstName?.trim().charAt(0) ?? "";
    const l = user?.lastName?.trim().charAt(0) ?? "";
    return (f + l || "IN").toUpperCase().slice(0, 2);
  }, [user?.firstName, user?.lastName]);

  return (
    <div className="min-h-screen bg-surface-50">
      <InstallerHeader activeNav="messages" userInitials={initials} />

      <div className="mx-auto flex overflow-hidden max-w-[1440px] flex-col gap-4 px-4 py-5 md:gap-5 md:px-5 lg:py-8">
        <PortalRealtimeMessagesPanel
          portal="installer"
          sessionFetch={fetchWithInstallerSession}
          user={user}
        />
      </div>
    </div>
  );
}
