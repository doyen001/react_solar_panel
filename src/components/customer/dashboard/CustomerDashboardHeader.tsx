"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { CustomerAvatar } from "@/components/customer/CustomerAvatar";
import { DashboardNotificationBell } from "@/components/dashboard/DashboardNotificationBell";
import Icon from "../../ui/Icons";

const NAV = [
  { href: "/customers/dashboard", label: "Dashboard", key: "dashboard" },
  { href: "/customers/design", label: "My Design", key: "designs" },
  { href: "/customers/messages", label: "Messages", key: "messages" },
  { href: "/customers/products", label: "Products", key: "products" },
  { href: "/customers/profile", label: "Profile", key: "profile" },
] as const;

type Props = {
  firstName?: string | null;
  lastName?: string | null;
  activeNav?: "dashboard" | "designs" | "profile" | "products" | "messages";
  /** Extra controls (e.g. My Design toolbar) shown before search / notifications. */
  headerAccessory?: ReactNode;
};

export function CustomerDashboardHeader({
  firstName,
  lastName,
  activeNav = "dashboard",
  headerAccessory,
}: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-warm-border bg-cream-50">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4 lg:px-5">
        <div className="flex min-w-0 items-center gap-4 sm:gap-5">
          <Link href="/" className="flex shrink-0 items-center gap-4 sm:gap-5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-[7.72px] bg-navy-800">
              <Image
                src="/images/solarDesignLogo.png"
                alt="Solar Design Logo"
                width={30}
                height={30}
              />
            </div>
            <span
              className="font-inter text-[13px] font-bold leading-[19.5px] tracking-[0.3px] text-warm-ink"
              style={{ fontFeatureSettings: '"liga" 1' }}
            >
              My Solar Portal
            </span>
          </Link>
          <div
            className="hidden h-6 w-px shrink-0 bg-warm-border sm:block"
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
              (item.key === "designs" && activeNav === "designs") ||
              (item.key === "profile" && activeNav === "profile") ||
              (item.key === "products" && activeNav === "products") ||
              (item.key === "messages" && activeNav === "messages");
            return (
              <Link
                key={item.key}
                href={item.href}
                className="relative pb-1 font-inter text-[14px] font-medium leading-[21px]"
              >
                <span
                  className={
                    active
                      ? "text-warm-ink"
                      : "text-warm-gray hover:text-warm-ink"
                  }
                >
                  {item.label}
                </span>
                {active ? (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-linear-to-b from-yellow-lemon to-orange-amber"
                    aria-hidden
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3 md:gap-4">
          {headerAccessory}
          <button
            type="button"
            aria-label="Search"
            className="flex size-8 items-center justify-center rounded-full text-warm-ink hover:bg-black/5"
          >
            <Icon name="Search" className="size-[18px] text-warm-gray" />
          </button>
          <DashboardNotificationBell mode="customer" />
          <CustomerAvatar firstName={firstName} lastName={lastName} size="md" />
        </div>
      </div>
    </header>
  );
}
