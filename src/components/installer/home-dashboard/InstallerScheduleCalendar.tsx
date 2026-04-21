"use client";

import classNames from "classnames";
import { format, getDay, startOfWeek } from "date-fns";
import { enUS } from "date-fns/locale";
import { useMemo, useState } from "react";
import type { View } from "react-big-calendar";
import {
  Calendar,
  dateFnsLocalizer,
  Navigate,
  type EventPropGetter,
  type ToolbarProps,
  Views,
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import Icon from "@/components/ui/Icons";
import "./InstallerScheduleCalendar.css";
import type { InstallerCalEvent } from "@/components/installer/home-dashboard/installerHomeScheduleMock";
import { INSTALLER_SCHEDULE_EVENTS } from "@/components/installer/home-dashboard/installerHomeScheduleMock";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  startOfWeek,
  getDay,
  locales,
});

function ScheduleToolbar(props: ToolbarProps<InstallerCalEvent, object>) {
  const { label, onNavigate, onView, view } = props;

  const viewModes: View[] = [Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA];

  return (
    <div className="mb-4 flex flex-col gap-3 border-b border-warm-border pb-4 md:flex-row md:flex-wrap md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        <button
          type="button"
          onClick={() => onNavigate(Navigate.TODAY)}
          className="rounded-lg border border-warm-border bg-white px-3 py-1.5 font-inter text-xs font-medium text-warm-ink shadow-sm hover:bg-cream-50"
        >
          Today
        </button>
        <div className="flex gap-1">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => onNavigate(Navigate.PREVIOUS)}
            className="flex size-8 items-center justify-center rounded-lg border border-warm-border bg-white text-warm-ink hover:bg-cream-50"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => onNavigate(Navigate.NEXT)}
            className="flex size-8 items-center justify-center rounded-lg border border-warm-border bg-white text-warm-ink hover:bg-cream-50"
          >
            ›
          </button>
        </div>
        <span className="inline-flex items-center gap-2 font-inter text-sm font-semibold text-warm-ink">
          <Icon name="Calendar" className="size-[18px] text-warm-gray" />
          {label}
        </span>
      </div>
      <div className="flex flex-wrap gap-1">
        {viewModes.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onView(v)}
            className={classNames(
              "rounded-md px-3 py-1.5 font-inter text-[11px] font-semibold uppercase tracking-wide",
              view === v
                ? "bg-linear-to-b from-yellow-lemon to-orange-amber text-warm-black"
                : "bg-white text-warm-gray ring-1 ring-warm-border hover:text-warm-ink",
            )}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}

const eventPropGetter: EventPropGetter<InstallerCalEvent> = (event) => {
  const v = event.variant;
  const map: Record<
    InstallerCalEvent["variant"],
    { className: string }
  > = {
    survey: { className: "installer-cal-event installer-cal-event--survey" },
    install: { className: "installer-cal-event installer-cal-event--install" },
    inspect: { className: "installer-cal-event installer-cal-event--inspect" },
    consult: { className: "installer-cal-event installer-cal-event--consult" },
  };
  return map[v] ?? { className: "" };
};

export function InstallerScheduleCalendar() {
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date(2026, 2, 1));

  const events = useMemo(
    () => INSTALLER_SCHEDULE_EVENTS.map((e) => ({ ...e })),
    [],
  );

  return (
    <section
      className="installer-schedule-cal overflow-hidden rounded-xl border border-warm-border bg-white p-4 shadow-sm md:p-5"
      aria-label="Project schedule calendar"
    >
      <Calendar<InstallerCalEvent>
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 620 }}
        view={view}
        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
        date={date}
        onNavigate={(d) => setDate(d)}
        onView={(v) => setView(v)}
        eventPropGetter={eventPropGetter}
        components={{
          toolbar: ScheduleToolbar,
        }}
      />
    </section>
  );
}
