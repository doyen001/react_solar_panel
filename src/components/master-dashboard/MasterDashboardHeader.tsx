"use client";

import Image from "next/image";
import Link from "next/link";
import { DashboardNotificationBell } from "@/components/dashboard/DashboardNotificationBell";
import Icon from "@/components/ui/Icons";
import {
  MASTER_DASHBOARD_NAV,
  MASTER_DASHBOARD_TITLE,
} from "@/utils/constant";

type Props = {
  activeNavId?: (typeof MASTER_DASHBOARD_NAV)[number]["id"];
  userInitials?: string;
};

export function MasterDashboardHeader({
  activeNavId = "overview",
  userInitials = "AD",
}: Props) {
  return (
    <header className="master-header-bg master-header-border sticky top-0 z-30 shrink-0 border-b">
      <div
        className="mx-auto flex h-[52px] max-w-[1440px] items-center justify-between gap-4 px-5"
      >
        <div className="flex min-w-0 items-center gap-4 md:gap-8">
          <div className="flex size-[39px] shrink-0 items-center justify-center rounded-[8.36px] bg-navy-800">
            <Image
              src="/images/solarDesignLogo.png"
              alt=""
              width={28}
              height={28}
              className="size-7 object-contain"
            />
          </div>
          <p className="hidden font-[family-name:var(--font-inter)] text-[13px] font-bold uppercase leading-[19.5px] tracking-[0.3px] text-gray-1 sm:block">
            {MASTER_DASHBOARD_TITLE}
          </p>
          <div
            className="hidden h-6 w-px shrink-0 bg-blue-slate md:block"
            aria-hidden
          />
          <nav
            className="hidden min-w-0 items-center gap-5 overflow-x-auto md:flex"
            aria-label="Master dashboard"
          >
            {MASTER_DASHBOARD_NAV.map((item) => {
              const active = item.id === activeNavId;
              return (
                <div key={item.id} className="relative pb-1.5">
                  <Link
                    href={item.href}
                    className={`font-[family-name:var(--font-inter)] text-[14px] font-medium leading-[21px] ${
                      active ? "master-nav-active" : "master-nav-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                  {active ? (
                    <div
                      className="master-nav-active-underline absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                      aria-hidden
                    />
                  ) : null}
                </div>
              );
            })}
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/installers/dashboard/home"
            className="master-pill-bg master-pill-border hidden items-center gap-2 rounded-md border px-3 py-1.5 sm:inline-flex"
            style={{ borderWidth: "0.636px" }}
          >
            <Icon name="Zap" className="size-3 shrink-0 text-gray-1" />
            <span
              className="master-pill-label font-[family-name:var(--font-dm-sans)] text-[10px] font-semibold uppercase leading-[15px] tracking-[0.3px]"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              Installer Portal
            </span>
          </Link>
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-full text-gray-1 hover:bg-white/10"
            aria-label="Search"
          >
            <Icon name="Search" className="size-[18px]" />
          </button>
          <DashboardNotificationBell
            mode="preview"
            bellButtonClassName="relative flex size-8 items-center justify-center rounded-full text-gray-1 hover:bg-white/10"
            bellIconClassName="size-[18px] text-gray-1"
          />
          <div
            className="master-avatar-gradient flex size-8 items-center justify-center rounded-full font-[family-name:var(--font-inter)] text-[11px] font-semibold leading-[16.5px] tracking-wide text-warm-black"
            aria-hidden
          >
            {userInitials}
          </div>
        </div>
      </div>
    </header>
  );
}
