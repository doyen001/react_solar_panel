"use client";

import classNames from "classnames";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IconPanelPlus } from "@/components/installer/dashboard/installerDashboardIcons";
import Icon from "@/components/ui/Icons";
import {
  fetchInstallerAppointments,
  type InstallerAppointment,
  type InstallerAppointmentStatus,
} from "@/lib/installers/appointments";

type Props = {
  customerId: string | null;
  nodeId?: string;
};

function formatAppointmentWhen(startAt: string, endAt: string) {
  try {
    const start = new Date(startAt);
    const end = new Date(endAt);
    const dateLabel = start.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const startTime = start.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
    const endTime = end.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
    return `${dateLabel} · ${startTime} – ${endTime}`;
  } catch {
    return "";
  }
}

function statusLabel(status: InstallerAppointmentStatus) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function statusClassName(status: InstallerAppointmentStatus) {
  switch (status) {
    case "COMPLETED":
      return "bg-emerald-100 text-emerald-800";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-cream-100 text-warm-ink";
  }
}

export function InstallerHomeAppointmentsPanel({ customerId, nodeId }: Props) {
  const selectedCustomerId =
    customerId && !customerId.startsWith("fallback-") ? customerId : null;

  const [appointments, setAppointments] = useState<InstallerAppointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedCustomerId) {
      setAppointments([]);
      setError(null);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchInstallerAppointments(
      {
        customerId: selectedCustomerId,
        limit: 20,
        page: 1,
      },
      { signal: controller.signal },
    )
      .then((rows) => {
        setAppointments(
          [...rows].sort(
            (a, b) =>
              new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
          ),
        );
      })
      .catch((e) => {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setError(e instanceof Error ? e.message : "Failed to load appointments");
        setAppointments([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [selectedCustomerId]);

  const addDisabled = !selectedCustomerId || loading;

  return (
    <section
      className="overflow-hidden rounded-[11.042px] border-[1.157px] border-warm-border bg-cream-50"
      data-node-id={nodeId}
    >
      <div className="flex h-[39.733px] items-center justify-between border-l-[2.315px] border-yellow-lemon bg-linear-to-b from-[rgba(245,159,10,0.15)] to-transparent pl-[17.65px] pr-[17.65px]">
        <div className="flex min-w-0 items-center gap-[8.83px]">
          <span className="shrink-0 text-warm-ink [&_svg]:size-[17.651px]">
            <Icon name="Calendar" />
          </span>
          <h3 className="truncate font-inter text-[13.25px] font-bold uppercase leading-[19.875px] tracking-[0.3313px] text-warm-ink">
            Appointment Schedule
          </h3>
        </div>
        <Link
          href="/installers/dashboard/schedule"
          aria-disabled={addDisabled}
          className={classNames(
            "inline-flex h-[24.288px] min-w-[61.453px] shrink-0 items-center gap-[8px] rounded-[6.625px] bg-linear-to-b from-yellow-lemon to-orange-amber px-[11.03px] font-dm-sans text-[9.938px] font-bold uppercase leading-[14.906px] tracking-[0.3313px] text-warm-black hover:opacity-95",
            addDisabled && "pointer-events-none opacity-50",
          )}
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          <IconPanelPlus className="size-[13.238px] shrink-0" />
          Add
        </Link>
      </div>

      <div className="min-h-[72.864px] px-[17.65px] py-3">
        {!selectedCustomerId ? (
          <p className="py-4 text-center font-dm-sans text-[13.25px] text-warm-gray">
            Select a customer to view appointments.
          </p>
        ) : loading ? (
          <p className="py-4 text-center font-dm-sans text-[13.25px] text-warm-gray">
            Loading appointments…
          </p>
        ) : error ? (
          <p className="py-4 text-center font-dm-sans text-[13.25px] text-red-600">
            {error}
          </p>
        ) : appointments.length === 0 ? (
          <p className="py-4 text-center font-dm-sans text-[13.25px] text-warm-gray">
            No upcoming appointments
          </p>
        ) : (
          <ul className="divide-y divide-warm-border">
            {appointments.map((appointment) => (
              <li
                key={appointment.id}
                className="flex min-w-0 items-start justify-between gap-3 py-3 first:pt-1 last:pb-1"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-inter text-sm font-semibold text-warm-ink">
                    {appointment.title}
                  </p>
                  <p className="mt-0.5 font-dm-sans text-xs text-warm-gray">
                    {formatAppointmentWhen(
                      appointment.startAt,
                      appointment.endAt,
                    )}
                  </p>
                  {appointment.notes ? (
                    <p className="mt-1 line-clamp-2 font-dm-sans text-xs text-warm-gray">
                      {appointment.notes}
                    </p>
                  ) : null}
                </div>
                <span
                  className={classNames(
                    "shrink-0 rounded-full px-2 py-1 font-dm-sans text-[10px] font-semibold uppercase tracking-wide",
                    statusClassName(appointment.status),
                  )}
                >
                  {statusLabel(appointment.status)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
