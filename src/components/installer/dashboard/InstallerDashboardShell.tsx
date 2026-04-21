"use client";

import classNames from "classnames";
import Link from "next/link";
import { useMemo, useState } from "react";
import { InstallerHeader } from "@/components/installer/dashboard/InstallerHeader";
import { InstallerShortcutRail } from "@/components/installer/dashboard/InstallerShortcutRail";
import Icon from "@/components/ui/Icons";
import { INSTALLER_HOME_CUSTOMERS } from "@/components/installer/home-dashboard/installerHomeMock";

export type InstallerDashboardSubTab = "detail" | "pipeline" | "schedule";

export function InstallerDashboardShell({
  activeSubTab,
  children,
}: {
  activeSubTab: InstallerDashboardSubTab;
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(
    INSTALLER_HOME_CUSTOMERS[0]?.id ?? "1",
  );
  const [customerSearch, setCustomerSearch] = useState("");

  const filteredCustomers = useMemo(() => {
    const q = customerSearch.trim().toLowerCase();
    if (!q) return INSTALLER_HOME_CUSTOMERS;
    return INSTALLER_HOME_CUSTOMERS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.initials.toLowerCase().includes(q),
    );
  }, [customerSearch]);

  return (
    <div className="flex min-h-screen flex-col bg-surface-50">
      <InstallerHeader
        userInitials="ES"
        onMenuClick={() => setMobileMenuOpen(true)}
      />

      <div className="relative mx-auto flex w-full flex-1">
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
            "z-50 flex w-[247px] shrink-0 flex-col border-r border-warm-border bg-navy-800",
            "fixed inset-y-0 left-0 md:static md:z-0",
            "transform transition-transform duration-200 md:translate-x-0",
            mobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0",
          )}
        >
          <div className="border-b border-warm-border px-3 py-4">
            <p className="font-inter text-[15px] font-semibold text-white">
              Customers
            </p>
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
          <div className="flex-1 overflow-y-auto">
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
                    "flex w-full items-center gap-3 border-b border-warm-border/70 px-3 py-3 text-left transition-colors",
                    selected ? "bg-sky-wash/80" : "hover:bg-cream-50",
                  )}
                >
                  <div className="flex size-[31px] shrink-0 items-center justify-center rounded-full bg-linear-to-b from-yellow-lemon to-orange-amber font-inter text-[11px] font-semibold text-warm-black">
                    {c.initials}
                  </div>
                  <span className="truncate font-inter text-sm font-medium text-white">
                    {c.name}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-3 py-4 md:px-5 md:py-6 lg:px-6">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2 lg:gap-3">
              <div
                style={{
                  borderRadius: "13px",
                  padding: "2px 2px",
                  background:
                    "linear-gradient(90deg, #5474EB 0%, #ED8080 52.97%, #00BCFF 100%)",
                }}
              >
                <div
                  className="grid h-[35.881px] w-full max-w-[346.22px] shrink-0 grid-cols-[178.571fr_167.648fr] overflow-hidden rounded-[11px] "
                  data-node-id="31:27831"
                >
                  <Link
                    href="/installers/dashboard/home"
                    className={classNames(
                      "relative flex h-full min-w-0 items-center justify-center gap-[10px] font-dm-sans text-[12.146px] font-bold uppercase leading-[18.219px] tracking-[0.4417px] no-underline transition-colors px-4",
                      activeSubTab === "detail"
                        ? "bg-linear-to-b from-yellow-lemon to-orange-amber text-warm-black"
                        : "bg-cream-50 text-warm-gray hover:text-warm-ink",
                    )}
                    style={{ fontVariationSettings: "'opsz' 14" }}
                  >
                    <Icon
                      name="User"
                      className={classNames(
                        "size-[17.651px] shrink-0",
                        activeSubTab === "detail"
                          ? "text-warm-black"
                          : "text-warm-gray",
                      )}
                    />
                    <span className="truncate">Customer Detail</span>
                  </Link>
                  <Link
                    href={{
                      pathname: "/installers/dashboard/home",
                      query: { tab: "pipeline" },
                    }}
                    className={classNames(
                      "relative flex h-full min-w-0 items-center justify-center gap-[10px] font-dm-sans text-[12.146px] font-bold uppercase leading-[18.219px] tracking-[0.4417px] no-underline transition-colors",
                      activeSubTab === "pipeline"
                        ? "bg-linear-to-b from-yellow-lemon to-orange-amber text-warm-black"
                        : "bg-cream-50 text-warm-gray hover:text-warm-ink",
                    )}
                    style={{ fontVariationSettings: "'opsz' 14" }}
                  >
                    <Icon
                      name="LayoutGrid"
                      className={classNames(
                        "size-[17.651px] shrink-0",
                        activeSubTab === "pipeline"
                          ? "text-warm-black"
                          : "text-warm-gray",
                      )}
                    />
                    <span className="truncate">Pipeline Status</span>
                  </Link>
                </div>
              </div>
              <Link
                href="/installers/dashboard/schedule"
                className={classNames(
                  "inline-flex items-center gap-2 rounded-lg border px-4 py-2 font-inter text-[13px] font-medium shadow-sm",
                  activeSubTab === "schedule"
                    ? "border-transparent bg-linear-to-b from-yellow-lemon to-orange-amber text-warm-black"
                    : "border-warm-border bg-white text-warm-ink hover:bg-cream-50",
                )}
              >
                <Icon name="Calendar" className="size-[18px]" />
                Project Schedule
              </Link>
            </div>
            <div
              style={{
                borderRadius: "8px",
                padding: "2px 2px",
                background:
                  "linear-gradient(90deg, #5474EB 0%, #ED8080 52.97%, #00BCFF 100%)",
              }}
            >
              <button
                type="button"
                className="inline-flex items-center justify-center gap-[10px] self-start overflow-hidden rounded-[6px] bg-linear-to-r from-yellow-lemon to-orange-amber px-4 py-[9px] font-dm-sans text-[12.146px] font-bold uppercase tracking-[0.4417px] text-warm-black transition-opacity hover:opacity-95 lg:self-auto"
                style={{ fontVariationSettings: "'opsz' 14" }}
                data-node-id="3:5380"
              >
                <Icon
                  name="UserPlus"
                  className="size-[18px] shrink-0 text-warm-black"
                />
                Register new customer
              </button>
            </div>
          </div>

          {children}
        </main>

        <InstallerShortcutRail />
      </div>
    </div>
  );
}
