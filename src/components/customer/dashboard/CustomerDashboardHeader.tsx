"use client";

import Image from "next/image";
import Link from "next/link";
import { dashboardAssets } from "./assets";

const NAV = [
  { href: "/customers/dashboard", label: "Dashboard", key: "dashboard" },
  {
    href: "/customers/dashboard#your-designs",
    label: "My Design",
    key: "designs",
  },
  { href: "#", label: "Messages", key: "messages" },
  { href: "#", label: "Products", key: "products" },
  { href: "#", label: "Profile", key: "profile" },
] as const;

type Props = {
  userInitials: string;
  notificationCount?: number;
  /** Which primary nav item is active (matches Figma underline). */
  activeNav?: "dashboard" | "designs";
};

export function CustomerDashboardHeader({
  userInitials,
  notificationCount = 2,
  activeNav = "dashboard",
}: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#dfd5c3] bg-[#fcfbf8]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4 lg:px-5">
        <div className="flex min-w-0 items-center gap-4 sm:gap-5">
          <Link
            href="/customers/dashboard"
            className="flex shrink-0 items-center gap-4 sm:gap-5"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-[7.72px] bg-[#09234a]">
              <Image
                src={dashboardAssets.logoMark}
                alt=""
                width={12}
                height={12}
                className="size-3 object-cover"
                unoptimized
              />
            </div>
            <span
              className="font-[family-name:var(--font-inter)] text-[13px] font-bold leading-[19.5px] tracking-[0.3px] text-[#2a2622]"
              style={{ fontFeatureSettings: '"liga" 1' }}
            >
              My Solar Portal
            </span>
          </Link>
          <div
            className="hidden h-6 w-px shrink-0 bg-[#dfd5c3] sm:block"
            aria-hidden
          />
        </div>

        <nav
          className="flex flex-wrap items-center gap-x-5 gap-y-2 sm:justify-center md:gap-x-5"
          aria-label="Primary"
        >
          {NAV.map((item) => {
            const active =
              (item.key === "dashboard" && activeNav === "dashboard") ||
              (item.key === "designs" && activeNav === "designs");
            return (
              <Link
                key={item.key}
                href={item.href}
                className="relative pb-1 font-[family-name:var(--font-inter)] text-[14px] font-medium leading-[21px]"
              >
                <span
                  className={
                    active ? "text-[#2a2622]" : "text-[#7c736a] hover:text-[#2a2622]"
                  }
                >
                  {item.label}
                </span>
                {active ? (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-gradient-to-b from-[#ffef62] to-[#f78d00]"
                    aria-hidden
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-end gap-3 sm:gap-4">
          <button
            type="button"
            aria-label="Search"
            className="flex size-8 items-center justify-center rounded-full hover:bg-black/5"
          >
            <Image
              src={dashboardAssets.search}
              alt=""
              width={18}
              height={18}
              unoptimized
            />
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex size-8 items-center justify-center rounded-full hover:bg-black/5"
          >
            <Image
              src={dashboardAssets.bell}
              alt=""
              width={18}
              height={18}
              unoptimized
            />
            {notificationCount > 0 ? (
              <span className="absolute right-0.5 top-0.5 flex size-3.5 items-center justify-center rounded-full bg-[#ef4444] font-[family-name:var(--font-inter)] text-[8px] font-bold leading-3 text-white">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            ) : null}
          </button>
          <div
            className="flex size-8 items-center justify-center rounded-full bg-gradient-to-b from-[#09234a] to-[#304566] font-[family-name:var(--font-inter)] text-[11px] font-semibold leading-4 tracking-wide text-white"
            aria-hidden
          >
            {userInitials.slice(0, 2).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
