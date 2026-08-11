"use client";

import classNames from "classnames";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import Icon from "@/components/ui/Icons";
import { projectPhaseLabel } from "@/lib/installers/project-phase";
import {
  formatMilestoneDate,
  setInstallerCurrentMilestone,
  type JourneyMilestone,
  type ProjectJourney,
} from "@/lib/project-journey";

type Props = {
  journey: ProjectJourney | null;
  loading?: boolean;
  disabled?: boolean;
  onJourneyChange: (journey: ProjectJourney) => void;
  className?: string;
};

/**
 * The installer's detailed progress bar: every step of the shared journey,
 * clickable. Clicking a step sets it as current — everything before becomes
 * completed, everything after upcoming — and the customer timeline follows,
 * showing only its own subset of these steps.
 */
export function InstallerJourneyStepBar({
  journey,
  loading = false,
  disabled = false,
  onJourneyChange,
  className,
}: Props) {
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const groups = useMemo(() => {
    if (!journey) return [];
    const order: string[] = [];
    const byPhase = new Map<string, JourneyMilestone[]>();

    for (const milestone of journey.milestones) {
      if (!byPhase.has(milestone.phase)) {
        byPhase.set(milestone.phase, []);
        order.push(milestone.phase);
      }
      byPhase.get(milestone.phase)!.push(milestone);
    }

    return order.map((phase) => ({
      phase,
      label: projectPhaseLabel(phase as never),
      milestones: byPhase.get(phase)!,
    }));
  }, [journey]);

  async function select(milestone: JourneyMilestone) {
    if (!journey || disabled || pendingKey) return;
    if (milestone.key === journey.currentMilestoneKey) return;

    setPendingKey(milestone.key);
    try {
      onJourneyChange(
        await setInstallerCurrentMilestone(journey.leadId, milestone.key),
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not update the project step",
      );
    } finally {
      setPendingKey(null);
    }
  }

  if (loading) {
    return (
      <p className={classNames("font-dm-sans text-[10px] text-warm-gray", className)}>
        Loading project steps…
      </p>
    );
  }

  if (disabled || !journey) {
    return (
      <p className={classNames("font-dm-sans text-[10px] text-warm-gray", className)}>
        Select a customer with an active lead to update job progress.
      </p>
    );
  }

  return (
    <div className={classNames("min-w-0", className)}>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <p className="font-dm-sans text-[10px] font-semibold uppercase tracking-wide text-warm-gray">
          Project steps
        </p>
        <p className="font-dm-sans text-[10px] text-warm-gray">
          {journey.completedCount} of {journey.totalCount} done ·{" "}
          {journey.percentComplete}%
        </p>
      </div>

      <div className="min-w-0 overflow-x-auto pb-1">
        <div className="flex min-w-max items-stretch gap-3">
          {groups.map((group) => (
            <div key={group.phase} className="min-w-0">
              <p className="mb-1 truncate font-dm-sans text-[9px] font-semibold uppercase tracking-wide text-warm-ink/60">
                {group.label}
              </p>

              <ol className="flex items-stretch gap-1">
                {group.milestones.map((milestone) => {
                  const isCurrent = milestone.state === "current";
                  const isDone = milestone.state === "completed";
                  const isPending = pendingKey === milestone.key;
                  const internal = milestone.audience === "installer";

                  return (
                    <li key={milestone.key} className="flex">
                      <button
                        type="button"
                        onClick={() => void select(milestone)}
                        disabled={Boolean(pendingKey)}
                        aria-current={isCurrent ? "step" : undefined}
                        title={[
                          milestone.label,
                          milestone.hint,
                          internal
                            ? "Internal — hidden from the customer"
                            : "Visible on the customer timeline",
                          formatMilestoneDate(milestone.completedAt) ?? undefined,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                        className={classNames(
                          "flex w-[104px] flex-col gap-1 rounded-lg border px-2 py-1.5 text-left transition-colors",
                          isCurrent
                            ? "border-brand-blue bg-brand-blue/10"
                            : isDone
                              ? "border-success/40 bg-success/5 hover:bg-success/10"
                              : "border-warm-border bg-white hover:bg-cream-50",
                          isPending && "opacity-60",
                        )}
                      >
                        <span className="flex items-center gap-1">
                          <span
                            className={classNames(
                              "flex size-3.5 shrink-0 items-center justify-center rounded-full border",
                              isDone
                                ? "border-success bg-success text-white"
                                : isCurrent
                                  ? "border-brand-blue bg-white"
                                  : "border-warm-border bg-white",
                            )}
                          >
                            {isDone ? (
                              <Icon name="Check" className="size-2 text-white" />
                            ) : null}
                          </span>

                          {internal ? (
                            <span
                              className="rounded-sm bg-warm-black/5 px-1 font-dm-sans text-[8px] font-bold uppercase tracking-wide text-warm-gray"
                              aria-label="Internal step, hidden from the customer"
                            >
                              Int
                            </span>
                          ) : null}
                        </span>

                        <span
                          className={classNames(
                            "line-clamp-2 font-dm-sans text-[10px] leading-[13px]",
                            isCurrent
                              ? "font-bold text-brand-blue"
                              : isDone
                                ? "font-medium text-warm-ink"
                                : "text-warm-gray",
                          )}
                        >
                          {milestone.label}
                        </span>

                        <span className="truncate font-dm-sans text-[9px] text-warm-gray">
                          {formatMilestoneDate(milestone.completedAt) ??
                            (isCurrent ? "In progress" : "—")}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-1 font-dm-sans text-[10px] text-warm-gray">
        Click a step to set it as current. Steps marked{" "}
        <span className="font-semibold">Int</span> are internal and stay hidden
        from the customer timeline.
      </p>
    </div>
  );
}
