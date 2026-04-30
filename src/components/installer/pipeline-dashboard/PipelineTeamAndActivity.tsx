"use client";

import { useInstallerActivityFeed } from "@/lib/installers/useInstallerActivityFeed";
import { TEAM_ROWS } from "./pipelineDashboardMock";
import {
  activityActorInitials,
  activityActorName,
  activityEventTypeLabel,
  activityEventTypeTone,
  formatActivityCreatedAt,
  type ActivityTone,
} from "./activityFeedDisplay";

export function PipelineTeamAndActivity() {
  const { events, isLoading, error, refetch } = useInstallerActivityFeed({
    limit: 20,
  });

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <section className="overflow-hidden rounded-lg border border-warm-border bg-white shadow-sm">
        <div className="yellow-gradient-header">
          <h3 className="font-inter text-[13px] font-bold uppercase tracking-[0.06em] text-brown-muted">
            Team Performance
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left">
            <thead>
              <tr className="border-b border-warm-border bg-cream-50/80">
                <th className="px-4 py-2 font-inter text-[10px] font-semibold uppercase tracking-wide text-brown-muted md:px-5">
                  #
                </th>
                <th className="px-4 py-2 font-inter text-[10px] font-semibold uppercase tracking-wide text-brown-muted md:px-5">
                  Name
                </th>
                <th className="px-4 py-2 font-inter text-[10px] font-semibold uppercase tracking-wide text-brown-muted md:px-5">
                  Deals
                </th>
                <th className="px-4 py-2 font-inter text-[10px] font-semibold uppercase tracking-wide text-brown-muted md:px-5">
                  Conv.
                </th>
                <th className="px-4 py-2 font-inter text-[10px] font-semibold uppercase tracking-wide text-brown-muted md:px-5">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody>
              {TEAM_ROWS.map((row) => (
                <tr
                  key={row.rank}
                  className="border-b border-warm-border last:border-0"
                >
                  <td className="px-4 py-3 font-inter text-[13px] text-warm-gray md:px-5">
                    {row.rank}
                  </td>
                  <td className="px-4 py-3 md:px-5">
                    <div className="flex items-center gap-2">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-linear-to-b from-yellow-lemon to-orange-amber font-inter text-[11px] font-semibold text-warm-black">
                        {row.initials}
                      </span>
                      <span className="font-inter text-[13px] font-semibold text-warm-ink">
                        {row.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 md:px-5">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-cream-150">
                        <div
                          className="h-full rounded-full bg-ocean"
                          style={{ width: `${row.dealsPct}%` }}
                        />
                      </div>
                      <span className="font-inter text-[12px] text-warm-gray">
                        {row.dealsPct}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-inter text-[13px] text-warm-ink md:px-5">
                    {row.conv}
                  </td>
                  <td className="px-4 py-3 font-inter text-[13px] font-semibold text-warm-ink md:px-5">
                    {row.revenue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="overflow-hidden rounded-[10px] border border-warm-border bg-cream-50 shadow-sm">
        <div className="flex min-h-[42px] items-center justify-between gap-3 border-l-2 border-yellow-lemon bg-linear-to-b from-amber-hot/15 to-transparent pl-[18px] pr-4">
          <h3 className="font-inter text-[12px] font-bold uppercase leading-[18px] tracking-[0.3px] text-warm-ink">
            Recent Activity
          </h3>
          <span className="font-dm-sans text-[10px] font-medium leading-[15px] text-warm-gray/70">
            Newest first
          </span>
        </div>

        {isLoading ? (
          <ul className="divide-y divide-warm-border">
            {Array.from({ length: 5 }).map((_, i) => (
              <li key={i} className="flex min-h-[64px] gap-3 px-4 py-3">
                <span className="size-8 shrink-0 animate-pulse rounded-full bg-warm-border" />
                <div className="min-w-0 flex-1 space-y-2 pt-0.5">
                  <div className="h-3 w-40 animate-pulse rounded bg-warm-border" />
                  <div className="h-2.5 w-full max-w-[280px] animate-pulse rounded bg-warm-border/80" />
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2 pt-0.5">
                  <div className="h-5 w-16 animate-pulse rounded-full bg-warm-border/80" />
                  <div className="h-2.5 w-12 animate-pulse rounded bg-warm-border/60" />
                </div>
              </li>
            ))}
          </ul>
        ) : error ? (
          <div
            className="flex flex-col gap-3 px-4 py-6"
            role="alert"
          >
            <p className="font-dm-sans text-[13px] leading-[19.5px] text-red-700">
              {error}
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="self-start rounded-md border border-warm-border bg-white px-3 py-1.5 font-dm-sans text-[12px] font-semibold text-navy-800 shadow-sm hover:bg-cream-50"
            >
              Try again
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <p className="font-dm-sans text-[13px] leading-[19.5px] text-warm-gray">
              No recent activity yet. Updates from leads and appointments will
              appear here in chronological order.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-warm-border">
            {events.map((a) => {
              const tone = activityEventTypeTone(a.eventType);
              const label = activityEventTypeLabel(a.eventType);
              const rel = formatActivityCreatedAt(a.createdAt);
              return (
                <li key={a.id} className="flex min-h-[64px] gap-3 px-4 py-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-navy-800 font-dm-sans text-[10px] font-semibold text-yellow-lemon">
                    {activityActorInitials(a.actorUser)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-dm-sans text-[13px] font-medium leading-[19.5px] text-warm-ink">
                        {activityActorName(a.actorUser)}
                      </span>
                    </div>
                    <p className="mt-px font-dm-sans text-[11px] font-normal leading-[16.5px] text-warm-gray">
                      {a.summary}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-dm-sans text-[10px] font-semibold leading-[15px] ${statusToneClass(tone)}`}
                    >
                      <span aria-hidden>{statusIcon(tone)}</span>
                      {label}
                    </span>
                    <span className="font-dm-sans text-[10px] font-normal leading-[15px] text-warm-gray/60">
                      {rel}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function statusToneClass(
  tone: ActivityTone,
) {
  if (tone === "success") return "bg-success/7 text-success";
  if (tone === "warning") return "bg-orange-amber/7 text-orange-amber";
  if (tone === "info") return "bg-navy-800/7 text-navy-800";
  if (tone === "danger") return "bg-red-600/7 text-red-600";
  return "bg-warm-gray/7 text-warm-gray";
}

function statusIcon(tone: ActivityTone) {
  if (tone === "success") return "◉";
  if (tone === "warning") return "◬";
  if (tone === "info") return "◷";
  if (tone === "danger") return "◌";
  return "◫";
}
