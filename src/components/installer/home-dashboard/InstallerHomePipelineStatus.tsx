"use client";

import classNames from "classnames";
import type { ComponentPropsWithoutRef } from "react";
import { InstallerLeadsWorkspace } from "@/components/installer/leads/InstallerLeadsWorkspace";
import Icon from "@/components/ui/Icons";
import { INSTALLER_HOME_PROFILE } from "@/components/installer/home-dashboard/installerHomeMock";
import { PIPELINE_KANBAN_HEADER_GRADIENTS } from "@/components/installer/home-dashboard/installerPipelineKanbanStyles";
import {
  PIPELINE_COMMISSIONING_TESTS,
  PIPELINE_DESIGN_CHECKS,
  PIPELINE_EQUIPMENT_STRIP,
  PIPELINE_INSTALL_CHECKLIST,
  PIPELINE_INSTALL_DATES,
  PIPELINE_ISSUES,
  PIPELINE_MAINTENANCE_DOCS,
  PIPELINE_MONITORING_CHECKS,
  PIPELINE_ORDER_CHECKS,
  PIPELINE_STEPPER_HEADERS,
  PIPELINE_STEPPER_ROW,
} from "@/components/installer/home-dashboard/installerPipelineStatusMock";

function IconBattery({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <rect x="2" y="7" width="18" height="10" rx="2" ry="2" />
      <path d="M22 11v2" strokeLinecap="round" />
    </svg>
  );
}

function IconCpu({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M9 9h6v6H9zM9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
    </svg>
  );
}

function ProfileUploadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
    </svg>
  );
}

/** Figma 3:6819 — spec column (icon + title + grey label rows; design uses labels only). */
function PipelineEquipmentStripColumn({
  title,
  icon,
  labels,
}: {
  title: string;
  icon: React.ReactNode;
  labels: readonly string[];
}) {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2 border-r border-warm-border pl-[10px] pr-[11px] pt-[10px]">
      <div className="flex h-3 shrink-0 items-center gap-[6px]">
        <span className="flex size-3 shrink-0 items-center justify-center text-warm-ink [&_svg]:size-3">
          {icon}
        </span>
        <p
          className="font-dm-sans text-[8px] font-bold uppercase leading-3 tracking-[0.4px] text-warm-ink"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          {title}
        </p>
      </div>
      <div className="flex flex-col gap-[2px]">
        {labels.map((label) => (
          <div
            key={label}
            className="flex h-3 items-center justify-between gap-2 font-dm-sans"
          >
            <span
              className="text-[8px] font-normal leading-3 text-warm-gray"
              style={{ fontVariationSettings: "'opsz' 9" }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Figma 3:6819 — equipment + customer single horizontal strip */
function PipelineEquipmentStrip() {
  const p = INSTALLER_HOME_PROFILE;

  return (
    <div
      className="overflow-hidden rounded-[10px] border border-warm-border bg-cream-50 p-px"
      data-node-id="3:6819"
    >
      <div className="flex min-h-[143.5px] w-full min-w-[720px] items-start">
        <PipelineEquipmentStripColumn
          title="Solar System"
          icon={<Icon name="Sun" className="text-warm-ink" />}
          labels={PIPELINE_EQUIPMENT_STRIP.solar}
        />
        <PipelineEquipmentStripColumn
          title="Battery System"
          icon={<IconBattery className="text-warm-ink" />}
          labels={PIPELINE_EQUIPMENT_STRIP.battery}
        />
        <PipelineEquipmentStripColumn
          title="Equipment Details"
          icon={<IconCpu className="text-warm-ink" />}
          labels={PIPELINE_EQUIPMENT_STRIP.equipment}
        />
        <PipelineEquipmentStripColumn
          title="Site Details"
          icon={<Icon name="LocationPin" className="text-warm-ink" />}
          labels={PIPELINE_EQUIPMENT_STRIP.site}
        />

        <div className="relative h-[143.5px] w-[140px] shrink-0 border-r border-warm-border">
          <div className="flex flex-col px-[10px] pt-[10px] font-dm-sans">
            <div className="flex h-[13.5px] items-center gap-[6px]">
              <Icon name="User" className="size-3 shrink-0 text-warm-ink" />
              <p
                className="text-[9px] font-bold leading-[13.5px] text-warm-ink"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                {p.name}
              </p>
            </div>
            <p
              className="mt-[8px] text-[8px] leading-3 text-warm-gray"
              style={{ fontVariationSettings: "'opsz' 9" }}
            >
              {p.phone}
            </p>
            <p
              className="mt-0 text-[8px] leading-3 text-warm-gray"
              style={{ fontVariationSettings: "'opsz' 9" }}
            >
              {p.email}
            </p>
            <p
              className="mt-[2px] text-[8px] leading-3 text-warm-gray"
              style={{ fontVariationSettings: "'opsz' 9" }}
            >
              Individual / Business
            </p>
            <div className="mt-[6px] flex flex-col border-t border-warm-border pt-[5px]">
              <p
                className="text-[9px] font-bold uppercase leading-[13.5px] tracking-[0.3px] text-warm-ink"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                Sale Price
              </p>
              <p
                className="text-[9px] font-bold uppercase leading-[13.5px] tracking-[0.3px] text-warm-ink"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                Profit
              </p>
            </div>
            <button
              type="button"
              className="mt-[6px] flex h-[20px] w-[119px] shrink-0 items-center justify-center gap-1 rounded-[4px] px-2 text-white"
              style={{
                backgroundImage:
                  "linear-gradient(168.67deg, rgb(32, 148, 243) 3.67%, rgb(23, 207, 207) 96.33%)",
              }}
            >
              <ProfileUploadIcon className="size-[10px] shrink-0 text-white" />
              <span
                className="font-dm-sans text-[7px] font-bold uppercase leading-[10.5px] tracking-[0.3px]"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                Upload
              </span>
            </button>
          </div>
        </div>

        <div className="relative h-[143.5px] w-[90px] shrink-0">
          <div className="absolute left-[7px] top-[12.99px] flex w-[75px] flex-col items-center gap-[19px]">
            <div className="flex w-[67px] flex-col items-center gap-[5px]">
              <button
                type="button"
                className="font-dm-sans text-[7px] font-bold uppercase leading-[10.5px] tracking-[0.3px] text-warm-gray hover:text-warm-ink"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                Customer Refs &gt;
              </button>
              <div className="flex size-[20px] items-center justify-center rounded-[4px] bg-[#e8e3d9]">
                <Icon name="User" className="size-3 text-warm-ink" />
              </div>
            </div>
            <div className="flex w-[72px] flex-col items-center gap-1">
              <p
                className="font-dm-sans text-[7px] font-bold uppercase leading-[10.5px] tracking-[0.3px] text-warm-gray"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                Solar Design
              </p>
              <button
                type="button"
                className="flex h-[47px] w-full flex-col items-center gap-[2.898px] rounded-[7.251px] border-[0.76px] border-warm-border pb-[6.496px] pt-[6.555px] text-white"
                style={{
                  backgroundImage:
                    "linear-gradient(131.43deg, rgb(84, 116, 235) 16.14%, rgb(255, 60, 60) 99.62%, rgb(0, 188, 255) 101.23%)",
                }}
              >
                <span className="flex size-[8.873px] shrink-0 items-center justify-center rounded-full bg-solar-gold">
                  <Icon name="Sun" className="size-[6px] text-warm-ink" />
                </span>
                <span
                  className="font-dm-sans text-[7.53px] font-bold uppercase leading-[8.157px]"
                  style={{ fontVariationSettings: "'opsz' 14" }}
                >
                  Solar Design
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Default pipeline checklist checkbox (~12×12px Figma). Checked state references node 3:5478. */
function PipelineKanbanCheckbox({
  checked,
  className,
  ...rest
}: {
  checked: boolean;
} & Omit<ComponentPropsWithoutRef<"input">, "type" | "defaultChecked">) {
  return (
    <input
      type="checkbox"
      defaultChecked={checked}
      className={classNames(
        "size-3 shrink-0 cursor-pointer rounded-[2px] border border-warm-border bg-white accent-warm-ink",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue",
        className,
      )}
      data-node-id={checked ? "3:5478" : undefined}
      {...rest}
    />
  );
}

/** Figma 3:5445 — row actions: 30×14 area, 14px hit targets, 8px glyphs, gap 2px */
function PipelineRowActions() {
  return (
    <div className="flex h-[14px] w-[30px] shrink-0 items-center gap-0.5">
      <button
        type="button"
        className="flex size-[14px] shrink-0 items-center justify-center rounded-[4px] text-warm-gray hover:bg-black/5"
        aria-label="Edit row"
      >
        <Icon name="Pencil" className="size-2" />
      </button>
      <button
        type="button"
        className="flex size-[14px] shrink-0 items-center justify-center rounded-[4px] text-warm-gray hover:bg-black/5"
        aria-label="Delete row"
      >
        <Icon name="Trash" className="size-2" />
      </button>
    </div>
  );
}

function PipelineChecklistRowLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span
      className="font-dm-sans text-[9px] font-bold uppercase leading-[13.5px] tracking-[0.2px] text-warm-ink"
      style={{ fontVariationSettings: "'opsz' 14" }}
    >
      {children}
    </span>
  );
}

function DesignCheckRow({ label }: { label: string }) {
  return (
    <div className="flex h-[18px] items-center gap-[6px]">
      <label className="flex min-h-0 min-w-0 flex-1 cursor-pointer items-center gap-[6px]">
        <PipelineKanbanCheckbox checked={true} />
        <PipelineChecklistRowLabel>{label}</PipelineChecklistRowLabel>
      </label>
      <PipelineRowActions />
    </div>
  );
}

function InstallCheckRow({ label }: { label: string }) {
  return (
    <div className="flex h-[18px] items-center gap-[6px]">
      <label className="flex min-h-0 min-w-0 flex-1 cursor-pointer items-center gap-[6px]">
        <PipelineKanbanCheckbox checked={false} />
        <PipelineChecklistRowLabel>{label}</PipelineChecklistRowLabel>
      </label>
      <PipelineRowActions />
    </div>
  );
}

function IconAlertTriangle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  );
}

function IssueRow({ label }: { label: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2 py-1.5 font-dm-sans text-[11px] leading-tight text-warm-ink">
      <IconAlertTriangle className="size-2.5 shrink-0 text-amber-600" />
      <span className="min-w-0 flex-1">{label}</span>
      <div className="flex flex-wrap items-center gap-1">
        {(["Open", "WIP", "Done"] as const).map((s) => (
          <button
            key={s}
            type="button"
            className="rounded border border-warm-border bg-white px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-warm-gray hover:bg-cream-50"
          >
            {s}
          </button>
        ))}
        <PipelineRowActions />
      </div>
    </div>
  );
}

/** Figma 3:5418 / 3:5429 — empty pipeline lane card */
function PipelineLaneYellowCard() {
  return (
    <div
      className="h-[70.183px] w-full shrink-0 rounded-[6.793px] bg-linear-to-b from-[#ffe609] to-[#cbb600]"
      aria-hidden
    />
  );
}

/** Figma 3:5424 — Proposal / Quote Sent state */
function PipelineLaneQuoteCard({ label }: { label: string }) {
  return (
    <div className="flex h-[70.183px] w-full items-center justify-center rounded-[6.793px] bg-linear-to-b from-[#7fe484] to-[#006f05] px-1">
      <p
        className="text-center font-dm-sans text-[9.057px] font-bold uppercase leading-[12.453px] tracking-[0.3396px] text-white"
        style={{ fontVariationSettings: "'opsz' 14" }}
      >
        {label}
      </p>
    </div>
  );
}

/** Figma node 3:5390 — pipeline phase header + customer row */
function PipelineStepper() {
  const headers = PIPELINE_STEPPER_HEADERS;
  /** Figma MCP: Payment Completed header fill */
  const paymentHeaderBg =
    "linear-gradient(178.39deg, rgb(255, 239, 98) 6.17%, rgb(247, 141, 0) 35.39%, rgb(239, 83, 80) 64.61%, rgb(224, 64, 251) 93.83%)";

  return (
    <div className="overflow-x-auto" data-node-id="3:5390">
      <div className="min-w-[1223px] rounded-[11.321px] border-[1.187px] border-warm-border bg-cream-50 p-[1.187px]">
        <div
          className="grid h-[29.427px] w-full"
          style={{
            gridTemplateColumns: "113.201px repeat(6, minmax(0, 1fr))",
          }}
        >
          {headers.map((label, i) => {
            const isPaymentHeader = i === headers.length - 1;
            return (
              <div
                key={label}
                className={classNames(
                  "flex items-center border-b-[1.187px] border-warm-border pb-[1.187px]",
                  i < headers.length - 1 && "border-r-[1.187px]",
                  !isPaymentHeader && "bg-cream-150",
                  i === 0 && "justify-start pl-[11.311px] pr-[1.187px]",
                  i > 0 && !isPaymentHeader && "justify-center pr-[1.187px]",
                  isPaymentHeader && "justify-center",
                )}
                style={
                  isPaymentHeader
                    ? { backgroundImage: paymentHeaderBg }
                    : undefined
                }
              >
                <span
                  className={classNames(
                    "whitespace-nowrap font-dm-sans text-[7.925px] font-bold uppercase leading-[10.189px] tracking-[0.3396px]",
                    isPaymentHeader ? "text-white" : "text-warm-ink",
                  )}
                  style={{ fontVariationSettings: "'opsz' 14" }}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        <div
          className="grid h-[80.418px] w-full border-b-[1.187px] border-warm-border bg-[#fffde7]"
          style={{
            gridTemplateColumns: "113.201px repeat(6, minmax(0, 1fr))",
          }}
        >
          {PIPELINE_STEPPER_ROW.map((cell, i) => (
            <div
              key={i}
              className={classNames(
                "flex border-warm-border",
                i < PIPELINE_STEPPER_ROW.length - 1 && "border-r-[1.187px]",
                cell.kind === "customer"
                  ? "items-center pl-[11.311px] pr-[1.187px]"
                  : "flex-col items-stretch pt-[4.524px] pl-[4.524px] pr-[5.711px]",
              )}
            >
              {cell.kind === "customer" ? (
                <p
                  className="uppercase font-dm-sans text-[10.189px] font-bold leading-[15.283px] tracking-[0.3396px] text-warm-ink"
                  style={{ fontVariationSettings: "'opsz' 14" }}
                >
                  {cell.label}
                </p>
              ) : cell.kind === "laneQuote" ? (
                <PipelineLaneQuoteCard label={cell.label ?? "Quote Sent"} />
              ) : (
                <PipelineLaneYellowCard />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Figma 3:5432 — single kanban column (outer column matches Frame 186 cells). */
function KanbanColumn({
  title,
  headerBackground,
  children,
}: {
  title: string;
  headerBackground: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-0 min-w-0 flex-col bg-cream-50">
      <div
        className="flex h-[28px] w-full shrink-0 items-center justify-center px-0.5"
        style={{ backgroundImage: headerBackground }}
      >
        <p
          className="whitespace-nowrap text-center font-dm-sans text-[8px] font-bold uppercase leading-[12px] tracking-[0.5px] text-white"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          {title}
        </p>
      </div>
      <div className="max-h-[min(70vh,560px)] min-h-[280px] flex-1 overflow-y-auto px-[10px] pb-3 pt-[10px]">
        {children}
      </div>
    </div>
  );
}

/** Figma 3:5259 — main column when “Pipeline Status” sub-tab is active */
export function InstallerHomePipelineStatus() {
  return (
    <div className="space-y-5 pb-10">
      <InstallerLeadsWorkspace />
      <PipelineStepper />

      <div
        className="grid w-full min-w-0 grid-cols-1 gap-px overflow-hidden border border-warm-border bg-warm-border xl:grid-cols-4"
        data-node-id="3:5430"
      >
        <KanbanColumn
          title="Design and Permissions"
          headerBackground={PIPELINE_KANBAN_HEADER_GRADIENTS.design}
        >
          <div className="flex flex-col space-y-5">
            {PIPELINE_DESIGN_CHECKS.map((t) => (
              <DesignCheckRow key={t} label={t} />
            ))}
            <p
              className="pl-5 font-dm-sans text-[8px] font-bold uppercase leading-[12px] tracking-[0.2px] text-warm-gray"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              Proof of Connection #
            </p>
            <button
              type="button"
              className="inline-flex h-4 items-center gap-1 font-dm-sans text-[8px] font-bold uppercase leading-[12px] tracking-[0.2px] text-warm-gray hover:opacity-90"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              <span className="text-[10px] leading-none">+</span>
              Add Item...
            </button>
            <button
              type="button"
              className="flex h-[22px] w-full items-center justify-center gap-2 rounded-[4px] bg-linear-to-b from-yellow-lemon to-orange-amber px-2"
            >
              <Icon name="Doc" className="size-2.5 shrink-0 text-warm-black" />
              <span
                className="font-dm-sans text-[8px] font-bold uppercase leading-[12px] tracking-[0.3px] text-warm-black"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                Generate Bill of Materials
              </span>
            </button>
            <div className="space-y-5 border-t border-warm-border pt-2">
              {PIPELINE_ORDER_CHECKS.map((t) => (
                <DesignCheckRow key={t} label={t} />
              ))}
            </div>
            <button
              type="button"
              className="inline-flex h-4 items-center gap-1 font-dm-sans text-[8px] font-bold uppercase leading-[12px] tracking-[0.2px] text-warm-gray hover:opacity-90"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              <span className="text-[10px] leading-none">+</span>
              Add Order...
            </button>
            <div className="space-y-3 border-t border-warm-border pt-2">
              <p
                className="font-dm-sans text-[8px] font-bold uppercase leading-[12px] tracking-[0.3px] text-warm-ink"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                Team
              </p>
              <div className="flex h-4 items-center gap-[6px]">
                <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-[6px]">
                  <PipelineKanbanCheckbox checked={true} />
                  <PipelineChecklistRowLabel>
                    Chief Installer
                  </PipelineChecklistRowLabel>
                </label>
                <button
                  type="button"
                  className="flex size-[14px] shrink-0 items-center justify-center rounded-[4px] text-warm-gray hover:bg-black/5"
                  aria-label="Remove team member"
                >
                  <Icon name="Trash" className="size-2" />
                </button>
              </div>
              <button
                type="button"
                className="mt-2 inline-flex h-4 items-center gap-1 font-dm-sans text-[8px] font-bold uppercase leading-[12px] tracking-[0.2px] text-warm-gray hover:opacity-90"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                <Icon name="UserPlus" className="size-2.5" />
                Add Team Member
              </button>
            </div>
            <div className="border-t border-warm-border pt-3">
              <div className="flex h-5 items-center gap-2">
                <Icon
                  name="Calendar"
                  className="size-3 shrink-0 text-warm-gray"
                />
                <span
                  className="min-w-0 flex-1 font-dm-sans text-[8px] font-bold uppercase leading-[12px] tracking-[0.2px] text-warm-ink"
                  style={{ fontVariationSettings: "'opsz' 14" }}
                >
                  Expected Installation Date
                </span>
                <input
                  type="text"
                  readOnly
                  placeholder=""
                  className="h-4 w-[90px] shrink-0 rounded-[4px] border border-warm-border bg-white px-1 text-[8px]"
                  aria-label="Expected installation date"
                />
              </div>
              <button
                type="button"
                className="mt-4 flex h-[22px] w-full items-center justify-center gap-2 rounded-[4px] border border-warm-border bg-white px-2"
              >
                <ProfileUploadIcon className="size-2.5 shrink-0 text-warm-ink" />
                <span
                  className="font-dm-sans text-[8px] font-bold uppercase leading-[12px] tracking-[0.3px] text-warm-ink"
                  style={{ fontVariationSettings: "'opsz' 14" }}
                >
                  Upload Documents
                </span>
              </button>
            </div>
          </div>
        </KanbanColumn>

        <KanbanColumn
          title="Pre & Post Installation"
          headerBackground={PIPELINE_KANBAN_HEADER_GRADIENTS.preInstall}
        >
          <div className="space-y-3">
            {PIPELINE_INSTALL_DATES.map((d) => (
              <div
                key={d.id}
                className="flex items-center gap-2 font-dm-sans text-[11px] text-warm-ink"
              >
                <Icon
                  name="Calendar"
                  className="size-3 shrink-0 text-warm-gray"
                />
                <span className="min-w-0 flex-1 leading-tight">{d.label}</span>
                <input
                  type="text"
                  readOnly
                  placeholder="—"
                  className="w-[90px] shrink-0 rounded border border-warm-border px-1 py-0.5 text-[11px]"
                />
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-warm-border pt-2 font-dm-sans text-[11px] font-semibold uppercase text-warm-ink">
              <span>Checklist</span>
              <span className="text-warm-gray">0/8 (0%)</span>
            </div>
            <div className="h-1 w-full rounded-full bg-cream-200">
              <div className="h-full w-0 rounded-full bg-amber-500" />
            </div>
            {PIPELINE_INSTALL_CHECKLIST.map((t) => (
              <InstallCheckRow key={t} label={t} />
            ))}
            <button
              type="button"
              className="inline-flex items-center gap-1 font-dm-sans text-[11px] font-semibold text-brand-blue hover:underline"
            >
              <span className="text-sm leading-none">+</span>
              Add Checklist Item...
            </button>
            <p className="font-dm-sans text-[11px] font-semibold uppercase text-warm-gray">
              Issues Log
            </p>
            {PIPELINE_ISSUES.map((t) => (
              <IssueRow key={t} label={t} />
            ))}
            <button
              type="button"
              className="inline-flex items-center gap-1 font-dm-sans text-[11px] font-semibold text-brand-blue hover:underline"
            >
              <span className="text-sm leading-none">+</span>
              Add Issue...
            </button>
            <p className="font-dm-sans text-[11px] font-semibold uppercase text-warm-gray">
              Notes
            </p>
            <textarea
              rows={3}
              placeholder="Add notes..."
              className="w-full resize-none rounded-lg border border-warm-border bg-cream-50 p-2 font-dm-sans text-[13px] text-warm-ink placeholder:text-warm-gray/60"
            />
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-b from-yellow-lemon to-orange-amber py-2 font-inter text-[11px] font-semibold text-warm-black shadow-sm"
            >
              <Icon name="Doc" className="size-2.5" />
              Pre and Post Installation Guides
            </button>
          </div>
        </KanbanColumn>

        <KanbanColumn
          title="Commissioning"
          headerBackground={PIPELINE_KANBAN_HEADER_GRADIENTS.commissioning}
        >
          <div className="space-y-2 font-dm-sans text-[10px] leading-tight text-warm-gray">
            <div className="flex flex-wrap items-center gap-1 border-b border-warm-border pb-2">
              <span>Testing</span>
              <span>/</span>
              <span>Failed</span>
              <span>/</span>
              <span>Rechecked</span>
              <span>/</span>
              <span>Passed</span>
              <PipelineKanbanCheckbox
                checked={true}
                className="ml-auto"
                aria-label="Commissioning checklist complete"
              />
            </div>
            <div className="flex gap-3 text-[10px]">
              <span>0 Pass</span>
              <span>0 Fail</span>
              <span>0 Recheck</span>
            </div>
            <p className="pt-1 font-inter text-[11px] font-semibold uppercase text-warm-ink">
              Tests
            </p>
            <div className="space-y-0 divide-y divide-warm-border/70">
              {PIPELINE_COMMISSIONING_TESTS.map((t) => (
                <div
                  key={t}
                  className="flex items-start justify-between gap-2 py-2"
                >
                  <div className="flex min-w-0 flex-1 items-start gap-2">
                    <span className="mt-1.5 size-2 shrink-0 rotate-45 border border-warm-ink bg-warm-ink/10" />
                    <span className="text-[11px] leading-snug text-warm-ink">
                      {t}
                    </span>
                  </div>
                  <PipelineRowActions />
                </div>
              ))}
            </div>
            <div className="space-y-2 border-t border-warm-border pt-3">
              <p className="text-[11px] font-semibold uppercase text-warm-ink">
                Electrical safety tests
              </p>
              {PIPELINE_COMMISSIONING_TESTS.slice(0, 4).map((t) => (
                <div
                  key={`pf-${t}`}
                  className="flex flex-wrap items-center justify-between gap-2 py-1 font-dm-sans text-[10px]"
                >
                  <span className="min-w-0 flex-1 leading-tight text-warm-ink">
                    {t}
                  </span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      className="rounded bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-800"
                    >
                      Pass
                    </button>
                    <button
                      type="button"
                      className="rounded bg-red-100 px-2 py-0.5 font-semibold text-red-800"
                    >
                      Fail
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </KanbanColumn>

        <KanbanColumn
          title="Maintenance and Monitoring"
          headerBackground={PIPELINE_KANBAN_HEADER_GRADIENTS.maintenance}
        >
          <div className="space-y-3">
            {PIPELINE_MAINTENANCE_DOCS.map((t) => (
              <DesignCheckRow key={t} label={t} />
            ))}
            <button
              type="button"
              className="inline-flex items-center gap-1 font-dm-sans text-[11px] font-semibold text-brand-blue hover:underline"
            >
              <span className="text-sm leading-none">+</span>
              Add Document...
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2 font-inter text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm hover:bg-emerald-700"
            >
              <Icon name="Mail" className="size-2.5 text-white" />
              Send to Customer
            </button>
            <p className="font-dm-sans text-[11px] font-semibold uppercase text-warm-gray">
              Monitoring and Maintenance Checklist
            </p>
            {PIPELINE_MONITORING_CHECKS.map((t) => (
              <InstallCheckRow key={t} label={t} />
            ))}
          </div>
        </KanbanColumn>
      </div>

      <section className="mt-6 overflow-x-auto">
        <PipelineEquipmentStrip />
      </section>
    </div>
  );
}
