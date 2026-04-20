"use client";

import { ACTIVITY_FEED, TEAM_ROWS } from "./pipelineDashboardMock";

export function PipelineTeamAndActivity() {
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
          <button
            type="button"
            className="inline-flex items-center gap-1 font-dm-sans text-[11px] font-semibold leading-[16.5px] text-navy-800"
          >
            View All <span aria-hidden>➜</span>
          </button>
        </div>
        <ul className="divide-y divide-warm-border">
          {ACTIVITY_FEED.map((a) => (
            <li key={a.id} className="flex min-h-[64px] gap-3 px-4 py-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-navy-800 font-dm-sans text-[10px] font-semibold text-yellow-lemon">
                {a.initials}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-dm-sans text-[13px] font-medium leading-[19.5px] text-warm-ink">
                    {a.name}
                  </span>
                  <span className="font-dm-sans text-[12px] font-bold leading-[18px] text-warm-ink">
                    {a.amount}
                  </span>
                </div>
                <p className="mt-px font-dm-sans text-[11px] font-normal leading-[16.5px] text-warm-gray">
                  {a.detail}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-dm-sans text-[10px] font-semibold leading-[15px] ${statusToneClass(a.statusTone)}`}>
                  <span aria-hidden>{statusIcon(a.statusTone)}</span>
                  {a.status}
                </span>
                <span className="font-dm-sans text-[10px] font-normal leading-[15px] text-warm-gray/60">
                  {a.time}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function statusToneClass(tone: "success" | "warning" | "info" | "danger" | "muted") {
  if (tone === "success") return "bg-success/7 text-success";
  if (tone === "warning") return "bg-orange-amber/7 text-orange-amber";
  if (tone === "info") return "bg-navy-800/7 text-navy-800";
  if (tone === "danger") return "bg-red-600/7 text-red-600";
  return "bg-warm-gray/7 text-warm-gray";
}

function statusIcon(tone: "success" | "warning" | "info" | "danger" | "muted") {
  if (tone === "success") return "◉";
  if (tone === "warning") return "◬";
  if (tone === "info") return "◷";
  if (tone === "danger") return "◌";
  return "◫";
}
