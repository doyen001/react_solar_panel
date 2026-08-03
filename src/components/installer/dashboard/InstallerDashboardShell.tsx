"use client";

import classNames from "classnames";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { InstallerHeader } from "@/components/installer/dashboard/InstallerHeader";
import { useInstallerCustomers } from "@/components/installer/dashboard/InstallerCustomersProvider";
import { InstallerShortcutRail } from "@/components/installer/dashboard/InstallerShortcutRail";
import { InstallerHomePipelinePhaseStrip } from "@/components/installer/home-dashboard/InstallerHomePipelinePhaseStrip";
import Icon from "@/components/ui/Icons";
import { type InstallerCustomerSummary } from "@/lib/installers/customers";
import {
  useInstallerHomePanel,
  type InstallerHomePanelState,
} from "@/hooks/useInstallerHomePanel";
import type { InstallerAppointment } from "@/lib/installers/appointments";
import type { InstallerNote } from "@/lib/installers/notes";
import type { InstallerTask } from "@/lib/installers/tasks";
import type { InstallerTag } from "@/lib/installers/tags";

type HomeCustomer = {
  id: string;
  initials: string;
  name: string;
  email?: string | null;
};

export type InstallerDashboardShellContext = {
  selectedCustomerId: string;
  selectedCustomer: HomeCustomer | null;
  homePanel: InstallerHomePanelState | null;
};

const DEFAULT_CUSTOMERS: HomeCustomer[] = [
  { id: "fallback-1", initials: "NA", name: "No customers yet" },
];

function toInitials(firstName?: string | null, lastName?: string | null) {
  const first = (firstName ?? "").trim();
  const last = (lastName ?? "").trim();
  const fromNames = `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  if (fromNames.trim()) return fromNames;
  return "NA";
}

function toName(customer: InstallerCustomerSummary) {
  const fullName = `${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim();
  if (fullName) return fullName;
  return customer.email?.trim() || "Unnamed Customer";
}

export type InstallerDashboardSubTab = "detail" | "pipeline" | "schedule";

const CUSTOMER_LIST_SCROLL =
  "min-h-0 flex-1 overflow-y-auto overscroll-y-contain [scrollbar-gutter:stable] [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.35)_rgba(255,255,255,0.06)] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/30 hover:[&::-webkit-scrollbar-thumb]:bg-white/45";

export function InstallerDashboardShell({
  activeSubTab,
  homePanelEnabled = false,
  children,
}: {
  activeSubTab: InstallerDashboardSubTab;
  /** When true, loads notes/tasks/tags/appointments via installer-home-panel. */
  homePanelEnabled?: boolean;
  children:
    | React.ReactNode
    | ((context: InstallerDashboardShellContext) => React.ReactNode);
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { customers: customerRows, refetch: refetchCustomers } =
    useInstallerCustomers();
  const [selectedId, setSelectedId] = useState(
    DEFAULT_CUSTOMERS[0]?.id ?? "fallback-1",
  );
  const [customerSearch, setCustomerSearch] = useState("");

  const homePanel = useInstallerHomePanel(
    homePanelEnabled ? selectedId : null,
  );

  const customers = useMemo(() => {
    if (!customerRows.length) return DEFAULT_CUSTOMERS;
    return customerRows.map((row) => ({
      id: row.id,
      name: toName(row),
      initials: toInitials(row.firstName, row.lastName),
      email: row.email,
    }));
  }, [customerRows]);

  useEffect(() => {
    if (!customerRows.length) {
      setSelectedId(DEFAULT_CUSTOMERS[0]?.id ?? "fallback-1");
      return;
    }
    setSelectedId((prev) =>
      customerRows.some((item) => item.id === prev) ? prev : customerRows[0].id,
    );
  }, [customerRows]);

  const filteredCustomers = useMemo(() => {
    const q = customerSearch.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.initials.toLowerCase().includes(q),
    );
  }, [customerSearch, customers]);

  const selectedCustomer = useMemo(
    () => customers.find((customer) => customer.id === selectedId) ?? null,
    [customers, selectedId],
  );

  const handleAppointmentCreated = useCallback(
    (appointment: InstallerAppointment) => {
      if (!homePanelEnabled) return;
      if (
        !appointment.customerId ||
        appointment.customerId !== selectedId ||
        selectedId.startsWith("fallback-")
      ) {
        return;
      }
      homePanel.upsertAppointment(appointment);
    },
    [homePanelEnabled, homePanel.upsertAppointment, selectedId],
  );

  const handleNoteCreated = useCallback(
    (note: InstallerNote) => {
      if (!homePanelEnabled) return;
      if (
        note.customerId !== selectedId ||
        selectedId.startsWith("fallback-")
      ) {
        return;
      }
      homePanel.upsertNote(note);
    },
    [homePanelEnabled, homePanel.upsertNote, selectedId],
  );

  const handleTaskCreated = useCallback(
    (task: InstallerTask) => {
      if (!homePanelEnabled) return;
      if (
        task.customerId !== selectedId ||
        selectedId.startsWith("fallback-")
      ) {
        return;
      }
      homePanel.upsertTask(task);
    },
    [homePanelEnabled, homePanel.upsertTask, selectedId],
  );

  const handleTagCreated = useCallback(
    (tag: InstallerTag) => {
      if (!homePanelEnabled) return;
      if (
        tag.customerId !== selectedId ||
        selectedId.startsWith("fallback-")
      ) {
        return;
      }
      homePanel.upsertTag(tag);
    },
    [homePanelEnabled, homePanel.upsertTag, selectedId],
  );

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-surface-50">
      <InstallerHeader
        userInitials="ES"
        onMenuClick={() => setMobileMenuOpen(true)}
      />

      <div className="relative mx-auto flex min-h-0 w-full flex-1 overflow-hidden">
        {mobileMenuOpen ? (
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        ) : null}

        <aside
          className={classNames(
            "z-50 flex h-full min-h-0 w-[247px] shrink-0 flex-col border-r border-warm-border bg-navy-800",
            "fixed inset-y-0 left-0 md:static md:z-0",
            "transform transition-transform duration-200 md:translate-x-0",
            mobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0",
          )}
        >
          <div className="shrink-0 border-b border-warm-border px-3 py-4">
            <div className="flex items-center justify-between gap-2">
              <p className="font-inter text-[15px] font-semibold text-white">
                Customers
              </p>
              <button
                type="button"
                onClick={() => refetchCustomers()}
                className="shrink-0 rounded-md border border-white/30 bg-navy-900/50 px-2 py-1 font-dm-sans text-[10px] font-semibold text-cream-50 shadow-sm hover:bg-navy-900/70"
                aria-label="Refresh customer list"
              >
                Refresh
              </button>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-warm-border bg-cream-50 px-3 py-2">
              <span
                className="pointer-events-none inline-flex shrink-0 text-warm-gray"
                aria-hidden
              >
                <Icon name="Search" className="size-4" />
              </span>
              <input
                type="search"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                placeholder="Search..."
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent font-inter text-sm text-warm-ink outline-none placeholder:text-warm-gray"
                aria-label="Search customers"
              />
            </div>
          </div>
          <nav
            className={CUSTOMER_LIST_SCROLL}
            aria-label="Customer list"
          >
            {filteredCustomers.map((c) => {
              const selected = c.id === selectedId;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(c.id);
                    setMobileMenuOpen(false);
                  }}
                  className={classNames(
                    "flex w-full min-w-0 items-center gap-3 px-3 py-3 text-left transition-colors text-white hover:text-secondary",
                    selected ? "bg-sky-wash/80" : "hover:bg-cream-50",
                  )}
                >
                  <div className="flex size-[31px] shrink-0 items-center justify-center rounded-full bg-linear-to-b from-yellow-lemon to-orange-amber font-inter text-[11px] font-semibold">
                    {c.initials}
                  </div>
                  <span className="min-w-0 truncate font-inter text-sm font-medium">
                    {c.name}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto px-3 py-4 md:px-5 md:py-6 lg:px-6">
          <div className="mb-5 flex min-w-0 flex-wrap items-center gap-2 sm:gap-2.5 xl:flex-nowrap xl:gap-3">
            <div className="flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-2 lg:gap-3">
              <div
                className="shrink-0"
                style={{
                  borderRadius: "13px",
                  padding: "2px 2px",
                  background:
                    "linear-gradient(90deg, #5474EB 0%, #ED8080 52.97%, #00BCFF 100%)",
                }}
              >
                <div
                  className="grid h-[32px] w-[72px] shrink-0 grid-cols-2 overflow-hidden rounded-[11px] sm:h-[35.881px] sm:w-full sm:max-w-[346.22px] sm:grid-cols-[178.571fr_167.648fr]"
                  data-node-id="31:27831"
                >
                  <Link
                    href="/installers/dashboard/home"
                    title="Customer Detail"
                    className={classNames(
                      "relative flex h-full min-w-0 items-center justify-center gap-1 font-dm-sans text-[10px] font-bold uppercase leading-tight tracking-[0.4417px] no-underline transition-colors px-2 sm:gap-[10px] sm:px-4 sm:text-[12.146px] sm:leading-[18.219px]",
                      activeSubTab === "detail"
                        ? "bg-linear-to-b from-yellow-lemon to-orange-amber text-warm-black"
                        : "bg-cream-50 text-warm-gray hover:text-warm-ink",
                    )}
                    style={{ fontVariationSettings: "'opsz' 14" }}
                  >
                    <Icon
                      name="User"
                      className={classNames(
                        "size-4 shrink-0 sm:size-[17.651px]",
                        activeSubTab === "detail"
                          ? "text-warm-black"
                          : "text-warm-gray",
                      )}
                    />
                    <span className="hidden truncate sm:inline">Customer Detail</span>
                  </Link>
                  <Link
                    href={{
                      pathname: "/installers/dashboard/home",
                      query: { tab: "pipeline" },
                    }}
                    title="Pipeline Status"
                    className={classNames(
                      "relative flex h-full min-w-0 items-center justify-center gap-1 font-dm-sans text-[10px] font-bold uppercase leading-tight tracking-[0.4417px] no-underline transition-colors px-2 sm:gap-[10px] sm:px-4 sm:text-[12.146px] sm:leading-[18.219px]",
                      activeSubTab === "pipeline"
                        ? "bg-linear-to-b from-yellow-lemon to-orange-amber text-warm-black"
                        : "bg-cream-50 text-warm-gray hover:text-warm-ink",
                    )}
                    style={{ fontVariationSettings: "'opsz' 14" }}
                  >
                    <Icon
                      name="LayoutGrid"
                      className={classNames(
                        "size-4 shrink-0 sm:size-[17.651px]",
                        activeSubTab === "pipeline"
                          ? "text-warm-black"
                          : "text-warm-gray",
                      )}
                    />
                    <span className="hidden truncate sm:inline">Pipeline Status</span>
                  </Link>
                </div>
              </div>
              <Link
                href="/installers/dashboard/schedule"
                title="Project Schedule"
                className={classNames(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2 py-1.5 font-inter text-[11px] font-medium shadow-sm sm:gap-2 sm:px-4 sm:py-2 sm:text-[13px]",
                  activeSubTab === "schedule"
                    ? "border-transparent bg-linear-to-b from-yellow-lemon to-orange-amber text-warm-black"
                    : "border-warm-border bg-white text-warm-ink hover:bg-cream-50",
                )}
              >
                <Icon name="Calendar" className="size-4 sm:size-[18px]" />
                <span className="hidden md:inline">Project Schedule</span>
              </Link>
            </div>

            {activeSubTab !== "schedule" ? (
              <InstallerHomePipelinePhaseStrip className="order-3 w-full min-w-0 xl:order-none xl:min-w-[280px] xl:flex-1" />
            ) : (
              <div
                className="order-3 hidden min-w-0 flex-1 xl:order-none xl:block"
                aria-hidden
              />
            )}

            <div
              className="order-2 ml-auto shrink-0 xl:order-none xl:ml-0"
              style={{
                borderRadius: "8px",
                padding: "2px 2px",
                background:
                  "linear-gradient(90deg, #5474EB 0%, #ED8080 52.97%, #00BCFF 100%)",
              }}
            >
              <button
                type="button"
                title="Register new customer"
                className="inline-flex items-center justify-center gap-1.5 overflow-hidden rounded-[6px] bg-linear-to-r from-yellow-lemon to-orange-amber px-2 py-1.5 font-dm-sans text-[10px] font-bold uppercase tracking-[0.4417px] text-warm-black transition-opacity hover:opacity-95 sm:gap-[10px] sm:px-4 sm:py-[9px] sm:text-[12.146px]"
                style={{ fontVariationSettings: "'opsz' 14" }}
                data-node-id="3:5380"
                onClick={() => {
                  window.location.href = "/designs";
                }}
              >
                <Icon
                  name="UserPlus"
                  className="size-4 shrink-0 text-warm-black sm:size-[18px]"
                />
                <span className="hidden sm:inline lg:hidden">Register</span>
                <span className="hidden lg:inline">Register new customer</span>
              </button>
            </div>
          </div>

          {typeof children === "function"
            ? children({
                selectedCustomerId: selectedId,
                selectedCustomer,
                homePanel: homePanelEnabled ? homePanel : null,
              })
            : children}
        </main>

        <InstallerShortcutRail
          onCustomersImported={refetchCustomers}
          selectedCustomerId={selectedId}
          customers={customerRows}
          onAppointmentCreated={handleAppointmentCreated}
          onNoteCreated={handleNoteCreated}
          onTaskCreated={handleTaskCreated}
          onTagCreated={handleTagCreated}
        />
      </div>
    </div>
  );
}
