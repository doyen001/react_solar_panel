"use client";

import classNames from "classnames";
import {
  INSTALLER_HOME_PIPELINE_ACTIVE_PHASE_INDEX,
  INSTALLER_HOME_PIPELINE_PHASES,
} from "./installerHomeMock";

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

const PIPELINE_PHASE_INACTIVE_BG =
  "linear-gradient(90deg, rgba(78, 78, 78, 0.83) 0%, rgba(78, 78, 78, 0.83) 100%), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%)";

export function InstallerHomePipelinePhaseStrip({
  phases = INSTALLER_HOME_PIPELINE_PHASES,
  activeIndex = INSTALLER_HOME_PIPELINE_ACTIVE_PHASE_INDEX,
  className,
}: {
  phases?: readonly string[];
  activeIndex?: number;
  className?: string;
}) {
  return (
    <nav
      className={classNames("min-w-0 overflow-x-auto", className)}
      aria-label="Project pipeline phases"
      data-node-id="3:8986"
    >
      <ol className="relative isolate mb-0 mt-0 h-8 w-full min-w-[320px] list-none overflow-hidden rounded-[10px] bg-white p-0 sm:h-9 sm:min-w-[420px] sm:rounded-[12px] lg:h-[38px] lg:min-w-[520px]">
        {phases.map((label, i) => {
          const layout = PIPELINE_SEGMENT_LAYOUT[i];
          if (!layout) return null;
          const isActive = i === activeIndex;
          const leftPct = (layout.left / PIPELINE_BAR_REF_WIDTH) * 100;
          const widthPct = (layout.width / PIPELINE_BAR_REF_WIDTH) * 100;
          return (
            <li
              key={label}
              className={classNames(
                "absolute inset-y-0 flex items-center justify-center overflow-hidden border-2 border-[rgba(231,231,231,0.3)] px-1 sm:px-1.5 lg:px-2",
                layout.round,
              )}
              style={{
                left: `${leftPct}%`,
                width: `${widthPct}%`,
                zIndex: layout.z,
                backgroundImage: isActive
                  ? PIPELINE_PHASE_ACTIVE_BG
                  : PIPELINE_PHASE_INACTIVE_BG,
              }}
              aria-current={isActive ? "step" : undefined}
            >
              <span
                className="max-w-full truncate text-center font-dm-sans text-[7px] font-bold leading-tight tracking-[0.3px] text-white uppercase sm:text-[9px] md:text-[10px] lg:text-[11px]"
                style={{ fontVariationSettings: "'opsz' 14" }}
                title={label}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
