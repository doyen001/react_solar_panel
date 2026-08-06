"use client";

import classNames from "classnames";
import {
  INSTALLER_HOME_PIPELINE_PHASES,
} from "@/lib/installers/project-phase";

/** Figma 3:8986 — overlap layout is relative to 1166px-wide frame */
const PIPELINE_BAR_REF_WIDTH = 1166;

const PIPELINE_SEGMENT_LAYOUT = [
  { left: 0, width: 303, z: 10, round: "rounded-[12px]" },
  {
    left: 271,
    width: 300,
    z: 20,
    round: "rounded-br-[12px] rounded-tr-[12px]",
  },
  {
    left: 542,
    width: 312,
    z: 30,
    round: "rounded-br-[12px] rounded-tr-[12px]",
  },
  {
    left: 833,
    width: 333,
    z: 40,
    round: "rounded-br-[12px] rounded-tr-[12px]",
  },
] as const;

const PIPELINE_PHASE_ACTIVE_BG =
  "linear-gradient(98.60461707551042deg, rgb(191, 70, 198) 4.0573%, rgb(113, 0, 119) 98.533%), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%)";

const PIPELINE_PHASE_COMPLETED_BG =
  "linear-gradient(180deg, rgba(120, 120, 120, 0.5) 0%, rgba(78, 78, 78, 0.4) 100%)";

const PIPELINE_PHASE_UPCOMING_BG =
  "linear-gradient(180deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.08) 100%)";

type SegmentState = "completed" | "active" | "upcoming";

function segmentState(index: number, activeIndex: number): SegmentState {
  if (index < activeIndex) return "completed";
  if (index === activeIndex) return "active";
  return "upcoming";
}

export function InstallerHomePipelinePhaseStrip({
  phases = INSTALLER_HOME_PIPELINE_PHASES,
  activeIndex = 0,
  suggestedIndex,
  onPhaseSelect,
  interactive = false,
  disabled = false,
  loading = false,
  className,
}: {
  phases?: readonly string[];
  activeIndex?: number;
  suggestedIndex?: number;
  onPhaseSelect?: (index: number) => void;
  interactive?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}) {
  const showSuggestion =
    suggestedIndex != null &&
    suggestedIndex !== activeIndex &&
    !loading &&
    !disabled;

  return (
    <div className={classNames("min-w-0", className)}>

      <nav
        className="min-w-0 overflow-x-auto"
        aria-label="Project pipeline phases"
        data-node-id="3:8986"
      >
        <ol className="relative isolate mb-0 mt-0 h-8 w-full min-w-[320px] list-none overflow-hidden rounded-[10px] border border-white/30 bg-linear-to-r from-[rgba(84,116,235,0.35)] via-[rgba(255,255,255,0.15)] to-[rgba(0,188,255,0.35)] p-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-sm sm:h-9 sm:min-w-[420px] sm:rounded-[12px] lg:h-[38px] lg:min-w-[520px]">
          {phases.map((label, i) => {
            const layout = PIPELINE_SEGMENT_LAYOUT[i];
            if (!layout) return null;

            const state = segmentState(i, activeIndex);
            const isActive = state === "active";
            const isSuggested = showSuggestion && i === suggestedIndex;
            const leftPct = (layout.left / PIPELINE_BAR_REF_WIDTH) * 100;
            const widthPct = (layout.width / PIPELINE_BAR_REF_WIDTH) * 100;

            const backgroundImage =
              state === "active"
                ? PIPELINE_PHASE_ACTIVE_BG
                : state === "completed"
                  ? PIPELINE_PHASE_COMPLETED_BG
                  : PIPELINE_PHASE_UPCOMING_BG;

            const content = (
              <span
                className={classNames(
                  "max-w-full truncate text-center font-dm-sans text-[7px] font-bold leading-tight tracking-[0.3px] uppercase sm:text-[9px] md:text-[10px] lg:text-[11px]",
                  state === "upcoming" ? "text-white/75" : "text-white",
                  interactive && !disabled && !loading && "group-hover:text-white",
                )}
                style={{ fontVariationSettings: "'opsz' 14" }}
                title={label}
              >
                {label}
              </span>
            );

            return (
              <li
                key={label}
                className={classNames(
                  "absolute inset-y-0 overflow-hidden border-2 px-1 sm:px-1.5 lg:px-2",
                  layout.round,
                  state === "active"
                    ? "border-[rgba(255,255,255,0.45)] shadow-[0_4px_14px_rgba(113,0,119,0.35)]"
                    : state === "completed"
                      ? "border-[rgba(255,255,255,0.35)]"
                      : "border-[rgba(255,255,255,0.18)] backdrop-blur-md",
                  isSuggested && "ring-offset-1 ring-offset-transparent",
                )}
                style={{
                  left: `${leftPct}%`,
                  width: `${widthPct}%`,
                  zIndex: isActive ? 50 : layout.z,
                  backgroundImage,
                }}
                aria-current={isActive ? "step" : undefined}
              >
                {interactive && onPhaseSelect ? (
                  <button
                    type="button"
                    disabled={disabled || loading}
                    onClick={() => onPhaseSelect(i)}
                    className={classNames(
                      "group flex size-full items-center justify-center transition-transform",
                      !disabled && !loading && "hover:brightness-110 active:scale-[0.98]",
                      (disabled || loading) && "cursor-not-allowed opacity-60",
                    )}
                    aria-label={`Set project phase to ${label}`}
                    title={
                      disabled
                        ? "Select a customer with an active lead"
                        : `Set phase: ${label}`
                    }
                  >
                    {content}
                  </button>
                ) : (
                  <div className="flex size-full items-center justify-center">
                    {content}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {loading ? (
        <p className="mt-1 font-dm-sans text-[10px] text-warm-gray">
          Loading project phase…
        </p>
      ) : disabled ? (
        <p className="mt-1 font-dm-sans text-[10px] text-warm-gray">
          Select a customer to view and update job phase.
        </p>
      ) : interactive ? (
        <p className="mt-1 font-dm-sans text-[10px] text-warm-gray">
          Current:{" "}
          <span className="font-semibold text-warm-ink">
            {phases[activeIndex] ?? ""}
          </span>
          {" · "}
          Click a phase to update this job.
        </p>
      ) : null}
    </div>
  );
}
