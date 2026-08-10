import { Suspense } from "react";
import { InstallerHomeDashboard } from "@/components/installer/home-dashboard/InstallerHomeDashboard";
import { InstallerPaymentReturnNotice } from "@/components/installer/payments/InstallerPaymentReturnNotice";

type Props = {
  searchParams?: Promise<{ tab?: string | string[] }>;
};

export default async function InstallerDashboardHomePage({
  searchParams,
}: Props) {
  const sp = searchParams ? await searchParams : {};
  const raw = sp.tab;
  const tab = Array.isArray(raw) ? raw[0] : raw;
  const activeSubTab = tab === "pipeline" ? "pipeline" : "detail";

  return (
    <>
      <Suspense fallback={null}>
        <InstallerPaymentReturnNotice />
      </Suspense>
      <InstallerHomeDashboard activeSubTab={activeSubTab} />
    </>
  );
}
