"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  downloadDesignProposalPdf,
  viewDesignProposalPdf,
} from "@/lib/customers/design-pdf";
import { CustomerDashboardHeader } from "@/components/customer/dashboard/CustomerDashboardHeader";
import { DesignComparisonTable } from "@/components/customer/design/DesignComparisonTable";
import { DesignPageToolbar } from "@/components/customer/design/DesignPageToolbar";
import { ReferralProgramCard } from "@/components/customer/design/ReferralProgramCard";
import { SelectedDesignPanel } from "@/components/customer/design/SelectedDesignPanel";
import { ShareJourneyCard } from "@/components/customer/design/ShareJourneyCard";
import { YourEquipmentSection } from "@/components/customer/design/YourEquipmentSection";
import { initialsFromPersonName } from "@/lib/customer/initialsFromName";
import {
  buildComparisonTable,
  buildDesignSpecs,
  buildEquipmentCards,
  buildPerformanceEstimates,
  designStatusLabel,
  formatDesignUpdatedAt,
  formatSavingsLabel,
  pickPrimaryDesign,
} from "@/lib/customers/customer-design-view";
import {
  fetchCustomerDesigns,
  isCustomerEditableDesign,
  type CustomerDesign,
} from "@/lib/customers/designs";
import { useAppSelector } from "@/lib/store/hooks";
import Icon from "@/components/ui/Icons";

export default function CustomerDesignPage() {
  const user = useAppSelector((s) => s.customerAuth.user);
  const [designs, setDesigns] = useState<CustomerDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCustomerDesigns({ limit: 20 });
        if (!cancelled) setDesigns(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load designs");
          setDesigns([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const primaryDesign = useMemo(() => pickPrimaryDesign(designs), [designs]);

  const canEdit = primaryDesign ? isCustomerEditableDesign(primaryDesign) : false;

  const [pdfBusy, setPdfBusy] = useState(false);

  /**
   * Rebuilds the same proposal PDF the design builder produces, from the stored
   * design — one generator, so the two documents cannot drift.
   */
  async function handleDownloadPdf() {
    if (!primaryDesign || pdfBusy) return;
    setPdfBusy(true);
    try {
      await downloadDesignProposalPdf(primaryDesign);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not generate your PDF",
      );
    } finally {
      setPdfBusy(false);
    }
  }

  async function handleViewPdf() {
    if (!primaryDesign || pdfBusy) return;
    // Opened before the await so the click gesture is still active; a popup
    // opened afterwards gets blocked.
    const viewer = window.open("", "_blank", "noopener,noreferrer");
    setPdfBusy(true);
    try {
      await viewDesignProposalPdf(primaryDesign, viewer);
    } catch (err) {
      viewer?.close();
      toast.error(
        err instanceof Error ? err.message : "Could not open your PDF",
      );
    } finally {
      setPdfBusy(false);
    }
  }

  const comparison = useMemo(
    () =>
      designs.length
        ? buildComparisonTable(
            [...designs].sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
            ),
            primaryDesign?.id ?? null,
          )
        : { columns: [], rows: [] },
    [designs, primaryDesign?.id],
  );

  const shareUrl = useMemo(() => {
    const raw = initialsFromPersonName(user?.firstName, user?.lastName)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    const slug = raw || "guest";
    const kw = primaryDesign?.title.match(/[\d.]+kW/i)?.[0] ?? "design";
    return `https://easylink.solar/share/${slug}-${kw.toLowerCase()}`;
  }, [user?.firstName, user?.lastName, primaryDesign?.title]);

  return (
    <div className="customer-page-bg flex min-h-screen flex-col">
      <CustomerDashboardHeader
        firstName={user?.firstName}
        lastName={user?.lastName}
        activeNav="designs"
        headerAccessory={<DesignPageToolbar />}
      />

      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-4 px-4 py-5 md:gap-5 md:px-5">
        {loading ? (
          <div className="customer-card-bg customer-cream-card-border rounded-[10px] border p-8 text-center font-dm-sans text-sm text-warm-gray">
            Loading your designs…
          </div>
        ) : error ? (
          <div className="customer-card-bg customer-cream-card-border rounded-[10px] border p-8 text-center font-dm-sans text-sm text-red-600">
            {error}
          </div>
        ) : !primaryDesign ? (
          <div className="customer-card-bg customer-cream-card-border rounded-[10px] border p-8 text-center font-dm-sans text-sm text-warm-gray">
            No solar designs yet. Your installer will add designs here once they are
            ready.
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-dm-sans text-xs text-warm-gray">
                {canEdit
                  ? "Open the design builder to change this design."
                  : "This design has been approved, so it is now read-only. Contact your installer to request a change."}
              </p>
              {canEdit ? (
                <Link
                  href={`/designs?designId=${encodeURIComponent(primaryDesign.id)}`}
                  className="flex items-center gap-1.5 rounded-lg border border-warm-border bg-white px-3 py-1.5 font-dm-sans text-xs font-semibold text-warm-ink hover:bg-cream-50"
                >
                  <Icon name="Pencil" className="size-3.5" />
                  Edit design
                </Link>
              ) : null}
            </div>

            <SelectedDesignPanel
              title={primaryDesign.title}
              lastUpdated={formatDesignUpdatedAt(primaryDesign.updatedAt)}
              savingsLabel={formatSavingsLabel(primaryDesign)}
              statusLabel={designStatusLabel(primaryDesign)}
              statusApproved={primaryDesign.status === "COMPLETED"}
              designSpecs={buildDesignSpecs(primaryDesign)}
              performanceEstimates={buildPerformanceEstimates(primaryDesign)}
              onViewPdf={() => void handleViewPdf()}
              onDownloadPdf={() => void handleDownloadPdf()}
              pdfBusy={pdfBusy}
            />

            {primaryDesign.customerNotes ? (
              <section className="customer-card-bg customer-cream-card-border rounded-[10px] border p-4">
                <p className="font-dm-sans text-[10px] font-semibold uppercase tracking-wide text-warm-gray">
                  Your notes for the installer
                </p>
                <p className="mt-1.5 whitespace-pre-wrap font-dm-sans text-sm text-warm-ink">
                  {primaryDesign.customerNotes}
                </p>
              </section>
            ) : null}

            <YourEquipmentSection cards={buildEquipmentCards(primaryDesign)} />
          </>
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
          <ShareJourneyCard shareUrl={shareUrl} />
          <ReferralProgramCard />
        </div>

        {designs.length > 1 ? (
          <DesignComparisonTable
            designs={comparison.columns}
            rows={comparison.rows}
          />
        ) : null}
      </main>
    </div>
  );
}
