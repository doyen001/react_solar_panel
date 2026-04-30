"use client";

import classNames from "classnames";
import { format, getDay, startOfWeek } from "date-fns";
import { enUS } from "date-fns/locale";
import { useEffect, useMemo, useState } from "react";
import type { View } from "react-big-calendar";
import {
  Calendar,
  dateFnsLocalizer,
  Navigate,
  type SlotInfo,
  type EventPropGetter,
  type Event,
  type ToolbarProps,
  Views,
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import Icon from "@/components/ui/Icons";
import {
  createInstallerAppointment,
  deleteInstallerAppointment,
  fetchInstallerAppointments,
  INSTALLER_APPOINTMENT_STATUSES,
  type InstallerAppointment,
  type InstallerAppointmentStatus,
  updateInstallerAppointment,
} from "@/lib/installers/appointments";
import { fetchInstallerLeads, type InstallerLeadSummary } from "@/lib/installers/leads";
import {
  INSTALLER_SCHEDULE_DEFAULTS,
  INSTALLER_SCHEDULE_VIEW_MODES,
} from "@/utils/constant";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  startOfWeek,
  getDay,
  locales,
});

type CalendarAppointmentEvent = Event & {
  id: string;
  appointmentId: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  status: InstallerAppointmentStatus;
  notes: string | null;
  customerName?: string;
};

type CustomerApiItem = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
};

type PaginatedApiResponse<T> = {
  success?: boolean;
  data?: T[];
};

function customerDisplayName(customer: CustomerApiItem) {
  const full = `${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim();
  if (full) return full;
  return customer.email?.trim() || "Unnamed customer";
}

function toDateTimeInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function fromDateTimeInputValue(value: string) {
  return new Date(value).toISOString();
}

function ScheduleToolbar(props: ToolbarProps<CalendarAppointmentEvent, object>) {
  const { label, onNavigate, onView, view } = props;

  const viewModes: View[] = [...INSTALLER_SCHEDULE_VIEW_MODES];

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

const eventPropGetter: EventPropGetter<CalendarAppointmentEvent> = (event) => {
  const map: Record<InstallerAppointmentStatus, { className: string }> = {
    SCHEDULED: { className: "installer-cal-event installer-cal-event--scheduled" },
    COMPLETED: { className: "installer-cal-event installer-cal-event--completed" },
    CANCELLED: { className: "installer-cal-event installer-cal-event--cancelled" },
  };
  return map[event.status] ?? { className: "" };
};

export function InstallerScheduleCalendar() {
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [appointments, setAppointments] = useState<InstallerAppointment[]>([]);
  const [leads, setLeads] = useState<InstallerLeadSummary[]>([]);
  const [customers, setCustomers] = useState<CustomerApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(
    null,
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [formState, setFormState] = useState({
    title: "",
    startAt: "",
    endAt: "",
    status: "SCHEDULED" as InstallerAppointmentStatus,
    leadId: "",
    customerId: "",
    notes: "",
  });

  async function loadScheduleData() {
    setIsLoading(true);
    setError(null);
    try {
      const [liveAppointments, liveLeads, customersResponse] = await Promise.all([
        fetchInstallerAppointments({
          page: INSTALLER_SCHEDULE_DEFAULTS.appointmentsPage,
          limit: INSTALLER_SCHEDULE_DEFAULTS.appointmentsLimit,
        }),
        fetchInstallerLeads({ page: 1, limit: 100 }),
        fetch("/api/installers/customers?limit=100", { cache: "no-store" }),
      ]);
      let liveCustomers: CustomerApiItem[] = [];
      if (customersResponse.ok) {
        const customerJson =
          (await customersResponse.json()) as PaginatedApiResponse<CustomerApiItem>;
        liveCustomers = Array.isArray(customerJson.data) ? customerJson.data : [];
      }
      setAppointments(liveAppointments);
      setLeads(liveLeads.leads);
      setCustomers(liveCustomers);
    } catch (loadError) {
      const message =
        loadError instanceof Error ? loadError.message : "Failed to load schedule";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadScheduleData();
  }, []);

  const selectedAppointment = useMemo(
    () => appointments.find((a) => a.id === selectedAppointmentId) ?? null,
    [appointments, selectedAppointmentId],
  );

  const events = useMemo<CalendarAppointmentEvent[]>(
    () =>
      appointments.map((a) => ({
        id: a.id,
        appointmentId: a.id,
        title: a.title,
        start: new Date(a.startAt),
        end: new Date(a.endAt),
        status: a.status,
        notes: a.notes,
        customerName:
          a.lead?.customerName ||
          (a.customer
            ? customerDisplayName({
                id: a.customer.id,
                firstName: a.customer.firstName,
                lastName: a.customer.lastName,
                email: a.customer.email,
              })
            : undefined),
      })),
    [appointments],
  );

  function openCreateFormWithRange(start: Date, end: Date) {
    setFormMode("create");
    setFormState({
      title: "",
      startAt: toDateTimeInputValue(start),
      endAt: toDateTimeInputValue(end),
      status: "SCHEDULED",
      leadId: "",
      customerId: "",
      notes: "",
    });
    setIsFormOpen(true);
  }

  function openEditForm(appointment: InstallerAppointment) {
    setFormMode("edit");
    setSelectedAppointmentId(appointment.id);
    setFormState({
      title: appointment.title,
      startAt: toDateTimeInputValue(new Date(appointment.startAt)),
      endAt: toDateTimeInputValue(new Date(appointment.endAt)),
      status: appointment.status,
      leadId: appointment.leadId ?? "",
      customerId: appointment.customerId ?? "",
      notes: appointment.notes ?? "",
    });
    setIsFormOpen(true);
  }

  function onSelectSlot(slot: SlotInfo) {
    openCreateFormWithRange(new Date(slot.start), new Date(slot.end));
  }

  function onSelectEvent(event: CalendarAppointmentEvent) {
    const appointment = appointments.find((a) => a.id === event.appointmentId);
    if (!appointment) return;
    openEditForm(appointment);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!formState.leadId && !formState.customerId) {
      setError("Select a lead or customer before saving.");
      return;
    }
    if (!formState.startAt || !formState.endAt) {
      setError("Start and end time are required.");
      return;
    }
    if (new Date(formState.startAt) >= new Date(formState.endAt)) {
      setError("Start time must be before end time.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (formMode === "create") {
        await createInstallerAppointment({
          title: formState.title.trim(),
          startAt: fromDateTimeInputValue(formState.startAt),
          endAt: fromDateTimeInputValue(formState.endAt),
          status: formState.status,
          leadId: formState.leadId || undefined,
          customerId: formState.customerId || undefined,
          notes: formState.notes.trim() || undefined,
        });
      } else if (selectedAppointmentId) {
        await updateInstallerAppointment(selectedAppointmentId, {
          title: formState.title.trim(),
          startAt: fromDateTimeInputValue(formState.startAt),
          endAt: fromDateTimeInputValue(formState.endAt),
          status: formState.status,
          notes: formState.notes.trim(),
        });
      }
      setIsFormOpen(false);
      await loadScheduleData();
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Failed to save appointment";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCancelAppointment(appointmentId: string) {
    setError(null);
    setIsSubmitting(true);
    try {
      await deleteInstallerAppointment(appointmentId);
      if (selectedAppointmentId === appointmentId) {
        setSelectedAppointmentId(null);
      }
      await loadScheduleData();
    } catch (cancelError) {
      const message =
        cancelError instanceof Error
          ? cancelError.message
          : "Failed to cancel appointment";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <section
        className="installer-schedule-cal overflow-hidden rounded-xl border border-warm-border bg-white p-4 shadow-sm md:p-5"
        aria-label="Project schedule calendar"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-inter text-base font-semibold text-warm-ink">
            Live Appointment Calendar
          </h2>
          <button
            type="button"
            onClick={() =>
              openCreateFormWithRange(
                new Date(),
                new Date(Date.now() + INSTALLER_SCHEDULE_DEFAULTS.createDurationMs),
              )
            }
            className="inline-flex items-center gap-2 rounded-lg bg-linear-to-b from-yellow-lemon to-orange-amber px-3 py-1.5 font-inter text-xs font-semibold text-warm-black"
          >
            <Icon name="Plus" className="size-4" />
            New appointment
          </button>
        </div>

        {error ? (
          <div className="mb-3 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 font-inter text-sm text-danger">
            {error}
          </div>
        ) : null}

        <Calendar<CalendarAppointmentEvent>
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: INSTALLER_SCHEDULE_DEFAULTS.calendarHeightPx }}
          selectable
          view={view}
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          date={date}
          onNavigate={(d) => setDate(d)}
          onView={(v) => setView(v)}
          onSelectSlot={onSelectSlot}
          onSelectEvent={onSelectEvent}
          eventPropGetter={eventPropGetter}
          components={{
            toolbar: ScheduleToolbar,
          }}
        />
      </section>

      {isFormOpen ? (
        <section className="rounded-xl border border-warm-border bg-cream-50 p-4 shadow-sm">
          <h3 className="font-inter text-sm font-semibold text-warm-ink">
            {formMode === "create" ? "Create appointment" : "Update appointment"}
          </h3>
          <form className="mt-3 grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-1">
              <span className="font-inter text-xs text-warm-gray">Title</span>
              <input
                required
                value={formState.title}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, title: e.target.value }))
                }
                className="rounded-md border border-warm-border bg-white px-3 py-2 font-inter text-sm text-warm-ink"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-inter text-xs text-warm-gray">Status</span>
              <select
                value={formState.status}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    status: e.target.value as InstallerAppointmentStatus,
                  }))
                }
                className="rounded-md border border-warm-border bg-white px-3 py-2 font-inter text-sm text-warm-ink"
              >
                {INSTALLER_APPOINTMENT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-inter text-xs text-warm-gray">Start</span>
              <input
                type="datetime-local"
                required
                value={formState.startAt}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, startAt: e.target.value }))
                }
                className="rounded-md border border-warm-border bg-white px-3 py-2 font-inter text-sm text-warm-ink"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-inter text-xs text-warm-gray">End</span>
              <input
                type="datetime-local"
                required
                value={formState.endAt}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, endAt: e.target.value }))
                }
                className="rounded-md border border-warm-border bg-white px-3 py-2 font-inter text-sm text-warm-ink"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-inter text-xs text-warm-gray">Lead (optional)</span>
              <select
                value={formState.leadId}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, leadId: e.target.value }))
                }
                className="rounded-md border border-warm-border bg-white px-3 py-2 font-inter text-sm text-warm-ink"
              >
                <option value="">Select lead</option>
                {leads.map((lead) => (
                  <option key={lead.id} value={lead.id}>
                    {lead.customerName}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-inter text-xs text-warm-gray">
                Customer (optional)
              </span>
              <select
                value={formState.customerId}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, customerId: e.target.value }))
                }
                className="rounded-md border border-warm-border bg-white px-3 py-2 font-inter text-sm text-warm-ink"
              >
                <option value="">Select customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customerDisplayName(customer)}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 md:col-span-2">
              <span className="font-inter text-xs text-warm-gray">Notes</span>
              <textarea
                value={formState.notes}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, notes: e.target.value }))
                }
                rows={3}
                className="rounded-md border border-warm-border bg-white px-3 py-2 font-inter text-sm text-warm-ink"
              />
            </label>
            <div className="flex gap-2 md:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-linear-to-b from-yellow-lemon to-orange-amber px-4 py-2 font-inter text-xs font-semibold text-warm-black disabled:opacity-60"
              >
                {isSubmitting
                  ? "Saving..."
                  : formMode === "create"
                    ? "Create appointment"
                    : "Save changes"}
              </button>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="rounded-lg border border-warm-border bg-white px-4 py-2 font-inter text-xs font-semibold text-warm-ink"
              >
                Close
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <section className="rounded-xl border border-warm-border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-warm-border px-4 py-3">
          <h3 className="font-inter text-sm font-semibold text-warm-ink">
            Appointment list
          </h3>
          <button
            type="button"
            onClick={() => void loadScheduleData()}
            className="rounded-md border border-warm-border bg-white px-3 py-1.5 font-inter text-xs font-medium text-warm-ink"
          >
            Refresh
          </button>
        </div>

        {isLoading ? (
          <p className="px-4 py-4 font-inter text-sm text-warm-gray">
            Loading appointments...
          </p>
        ) : appointments.length === 0 ? (
          <p className="px-4 py-4 font-inter text-sm text-warm-gray">
            No upcoming appointments.
          </p>
        ) : (
          <ul className="divide-y divide-warm-border">
            {appointments.map((appointment) => (
              <li
                key={appointment.id}
                className="flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate font-inter text-sm font-semibold text-warm-ink">
                    {appointment.title}
                  </p>
                  <p className="font-inter text-xs text-warm-gray">
                    {format(new Date(appointment.startAt), "PPp")} -{" "}
                    {format(new Date(appointment.endAt), "PPp")}
                  </p>
                  <p className="mt-1 font-inter text-xs text-warm-gray">
                    {appointment.lead?.customerName ||
                      (appointment.customer
                        ? customerDisplayName(appointment.customer)
                        : "Unlinked appointment")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-cream-100 px-2 py-1 font-inter text-[10px] font-semibold text-warm-ink">
                    {appointment.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => openEditForm(appointment)}
                    className="rounded-md border border-warm-border bg-white px-2.5 py-1.5 font-inter text-xs font-medium text-warm-ink"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting || appointment.status === "CANCELLED"}
                    onClick={() => void handleCancelAppointment(appointment.id)}
                    className="rounded-md border border-danger/30 bg-danger/10 px-2.5 py-1.5 font-inter text-xs font-medium text-danger disabled:opacity-60"
                  >
                    Cancel
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {selectedAppointment ? (
        <p className="font-inter text-xs text-warm-gray">
          Selected: {selectedAppointment.title}
        </p>
      ) : null}
    </div>
  );
}
