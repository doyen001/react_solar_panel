"use client";

import classNames from "classnames";
import Link from "next/link";
import Icon from "@/components/ui/Icons";
import {
  IconCheckSquare,
  IconPanelTag,
} from "@/components/installer/dashboard/installerDashboardIcons";
import Image from "next/image";

/** --- Figma 3:9234 shortcut rail --- */
function ShortcutRailGradientChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex size-[35.32px] shrink-0 items-center justify-center rounded-[8.833px] bg-linear-to-b from-yellow-lemon to-orange-amber text-warm-black [&_svg]:size-[17.651px]">
      {children}
    </span>
  );
}

function ShortcutRailBrandChip({
  bgClassName,
  children,
}: {
  bgClassName: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={classNames(
        "flex size-[35.32px] shrink-0 items-center justify-center rounded-[8.833px] text-white [&_svg]:size-[17.651px]",
        bgClassName,
      )}
    >
      {children}
    </span>
  );
}

function ShortcutRailLabel({
  tall,
  children,
}: {
  tall?: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={classNames(
        "text-center font-dm-sans text-[9.938px] font-semibold leading-[12.422px] text-warm-gray",
        tall &&
          "flex min-h-[24.849px] flex-col justify-center [&_span]:leading-[12.422px]",
      )}
      style={{ fontVariationSettings: "'opsz' 14" }}
    >
      {children}
    </span>
  );
}

function ShortcutRailCard({
  tall,
  chip,
  label,
  href,
}: {
  tall?: boolean;
  chip: React.ReactNode;
  label: React.ReactNode;
  /** When set, renders Next.js Link instead of `<button>` (appointment → schedule page). */
  href?: string;
}) {
  const cls = classNames(
    "flex w-full flex-col items-center rounded-[11.042px] border-[1.157px] border-warm-border bg-cream-50 px-[1.157px] pb-[9.892px] pt-[9.982px]",
    tall ? "min-h-[84.457px]" : "h-[72.032px]",
    "gap-[4.413px]",
    href && "text-left no-underline transition-opacity hover:opacity-95",
  );

  const body = (
    <>
      {chip}
      <ShortcutRailLabel tall={tall}>{label}</ShortcutRailLabel>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cls}>
        {body}
      </Link>
    );
  }

  return (
    <button type="button" className={cls}>
      {body}
    </button>
  );
}

function ShortcutIconFolder({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"
      />
    </svg>
  );
}

function ShortcutIconBook({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  );
}

function ShortcutIconCreditCard({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}

function ShortcutIconExcelMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M14 3l2.5 7H22v2h-4.25L17 21h-2l-2.25-9H9L6.75 21h-2L7 12H3v-2h4.5L10 3h4z" />
    </svg>
  );
}

function ShortcutIconSheetGrid({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z" />
    </svg>
  );
}

function ShortcutIconWordMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M4 4h6l2 10L14 4h6v16h-3V9l-3 11h-3L9 9v11H6V4z" />
    </svg>
  );
}

/** Figma 3:9228 — Solar Design shortcut (gradient tile + centred mark + label) */
function ShortcutRailSolarDesignButton() {
  return (
    <button
      type="button"
      className="flex h-[72.032px] w-full flex-col items-center gap-[4.413px] rounded-[11.042px] border-[1.157px] border-warm-border px-[1.157px] pb-[9.892px] pt-[9.982px] transition-opacity hover:opacity-95"
      style={{
        backgroundImage:
          "linear-gradient(125.24deg, rgb(84, 116, 235) 16.14%, rgb(255, 60, 60) 99.62%, rgb(0, 188, 255) 101.23%)",
      }}
      data-node-id="3:9228"
    >
      <Image
        alt="Sun"
        src="/images/solarDesignLogo.png"
        width={36}
        height={36}
      />
      <span
        className="text-center font-dm-sans text-[9.938px] font-semibold uppercase leading-[12.422px] text-white px-1.5"
        style={{ fontVariationSettings: "'opsz' 14" }}
      >
        Solar Design
      </span>
    </button>
  );
}

function ShortcutRailUploadButton() {
  return (
    <button
      type="button"
      className="flex h-[72.032px] w-full flex-col items-center justify-center rounded-[11.042px] border-[1.157px] border-warm-border px-[1.157px] pb-[9.892px] pt-[9.982px]"
      style={{
        backgroundImage:
          "linear-gradient(108.71390978018913deg, rgb(32, 148, 243) 0%, rgb(23, 207, 207) 100%)",
      }}
    >
      <div className="flex flex-col items-center gap-1">
        <span className="flex size-[35.32px] items-center justify-center rounded-[8.833px] border border-white">
          <svg
            className="size-[18px] text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
          </svg>
        </span>
        <span
          className="font-dm-sans text-[10px] font-bold uppercase leading-normal text-white"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          Upload
        </span>
      </div>
    </button>
  );
}

export function InstallerShortcutRail() {
  return (
    <aside
      className="hidden shrink-0 flex-col border-l border-warm-border bg-cream-50 py-8 lg:flex"
      aria-label="Quick shortcuts"
      data-node-id="3:9234"
    >
      <nav className="flex flex-col gap-[7px] px-2">
        <ShortcutRailSolarDesignButton />
        <ShortcutRailCard
          href="/installers/dashboard/schedule"
          chip={
            <ShortcutRailGradientChip>
              <Icon name="Calendar" />
            </ShortcutRailGradientChip>
          }
          label="Appointment"
        />
        <ShortcutRailCard
          chip={
            <ShortcutRailGradientChip>
              <Icon name="Doc" />
            </ShortcutRailGradientChip>
          }
          label="Invoice"
        />
        <ShortcutRailCard
          chip={
            <ShortcutRailGradientChip>
              <Icon name="MessageSquare" />
            </ShortcutRailGradientChip>
          }
          label="Notes"
        />
        <ShortcutRailCard
          chip={
            <ShortcutRailGradientChip>
              <IconCheckSquare />
            </ShortcutRailGradientChip>
          }
          label="Tasks"
        />
        <ShortcutRailCard
          chip={
            <ShortcutRailGradientChip>
              <IconPanelTag />
            </ShortcutRailGradientChip>
          }
          label="Tags"
        />
        <ShortcutRailCard
          tall
          chip={
            <ShortcutRailGradientChip>
              <ShortcutIconFolder />
            </ShortcutRailGradientChip>
          }
          label={
            <>
              <span className="block">Site</span>
              <span className="block">Projects</span>
            </>
          }
        />
        <ShortcutRailCard
          chip={
            <ShortcutRailGradientChip>
              <ShortcutIconBook />
            </ShortcutRailGradientChip>
          }
          label="Datasheets"
        />
        <ShortcutRailCard
          chip={
            <ShortcutRailGradientChip>
              <ShortcutIconCreditCard />
            </ShortcutRailGradientChip>
          }
          label="Payments"
        />
        <ShortcutRailCard
          chip={
            <ShortcutRailBrandChip bgClassName="bg-[#217346]">
              <ShortcutIconExcelMark className="size-[17.651px]" />
            </ShortcutRailBrandChip>
          }
          label="Excel"
        />
        <ShortcutRailCard
          tall
          chip={
            <ShortcutRailBrandChip bgClassName="bg-[#0f9d58]">
              <ShortcutIconSheetGrid className="size-[14px]" />
            </ShortcutRailBrandChip>
          }
          label={
            <>
              <span className="block">Google</span>
              <span className="block">Sheets</span>
            </>
          }
        />
        <ShortcutRailCard
          chip={
            <ShortcutRailBrandChip bgClassName="bg-[#2b579a]">
              <ShortcutIconWordMark className="size-[15px]" />
            </ShortcutRailBrandChip>
          }
          label="Word"
        />
        <ShortcutRailUploadButton />
      </nav>
    </aside>
  );
}
