"use client";

import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/ui/Icons";

const NAV = [
  { href: "/installer/dashboard", label: "Home", key: "home" },
  { href: "/installer/dashboard", label: "Pipeline", key: "pipeline" },
  { href: "/installer/dashboard", label: "Reports", key: "reports" },
  { href: "/installer/dashboard", label: "Settings", key: "settings" },
  { href: "/installer/dashboard", label: "Help", key: "help" },
] as const;

type Props = {
  activeNav?: (typeof NAV)[number]["key"];
  notificationCount?: number;
  userInitials?: string;
  /** When omitted, mobile menu toggle is hidden (pipeline dashboard has no sidebar). */
  onMenuClick?: () => void;
};

export function InstallerHeader({
  activeNav = "pipeline",
  notificationCount = 4,
  userInitials = "ES",
  onMenuClick,
}: Props) {
  return (
    <header className="sticky top-0 z-30 shrink-0 border-b border-warm-border bg-cream-50">
      <div className="flex h-[52px] items-center justify-between gap-3 px-4 md:px-5">
        <div className="flex min-w-0 items-center gap-3 md:gap-8">
          {onMenuClick ? (
            <button
              type="button"
              className="flex shrink-0 md:hidden"
              aria-label="Open menu"
              onClick={onMenuClick}
            >
              <Icon name="Menu" className="size-6 text-warm-ink" />
            </button>
          ) : null}
          <Link href="/installer/dashboard" className="flex shrink-0 items-center gap-8">
            <div className="flex size-9 items-center justify-center rounded-[7.72px] bg-navy-800">
              <Image
                src="/images/solarDesignLogo.png"
                alt="Easylink solar"
                width={28}
                height={28}
              />
            </div>
          </Link>
          <nav
            className="hidden min-w-0 items-center gap-5 md:flex lg:gap-6"
            aria-label="Installer"
          >
            {NAV.map((item) => {
              const active = item.key === activeNav;
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
        </div>

        <div className="flex shrink-0 items-center gap-3 md:gap-4">
          <button
            type="button"
            aria-label="Search"
            className="flex size-8 items-center justify-center rounded-full text-warm-ink hover:bg-black/5"
          >
            <Icon name="Search" className="size-[18px] text-warm-gray" />
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex size-8 items-center justify-center rounded-full hover:bg-black/5"
          >
            <Icon name="Bell" className="size-[18px] text-warm-gray" />
            {notificationCount > 0 ? (
              <span className="absolute right-0 top-0 flex size-3.5 items-center justify-center rounded-full bg-danger font-inter text-[8px] font-bold leading-3 text-white">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            ) : null}
          </button>
          <div className="flex size-8 items-center justify-center rounded-full bg-linear-to-b from-yellow-lemon to-orange-amber font-inter text-[11px] font-semibold leading-4 tracking-[0.06em] text-warm-black">
            {userInitials}
          </div>
        </div>
      </div>
    </header>
  );
}
