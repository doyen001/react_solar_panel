"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { useInstallerCustomersOptional } from "@/components/installer/dashboard/InstallerCustomersProvider";
import Icon from "@/components/ui/Icons";
import {
  appointmentCustomerDisplayName,
  defaultCreateAppointmentRange,
  fromDateTimeInputValue,
  toDateTimeInputValue,
} from "@/lib/installers/appointment-form";
import {
  createInstallerAppointment,
  INSTALLER_APPOINTMENT_STATUSES,
  type InstallerAppointment,
  type InstallerAppointmentStatus,
} from "@/lib/installers/appointments";
import {
  fetchInstallerCustomers,
  type InstallerCustomerSummary,
} from "@/lib/installers/customers";
import { fetchInstallerLeads, type InstallerLeadSummary } from "@/lib/installers/leads";
import { INSTALLER_SCHEDULE_DEFAULTS } from "@/utils/constant";

type FormState = {
  title: string;
  startAt: string;
  endAt: string;
  status: InstallerAppointmentStatus;
  leadId: string;
  customerId: string;
  notes: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  defaultCustomerId?: string | null;
  /** When provided, customer dropdown uses this list instead of fetching. */
  customers?: InstallerCustomerSummary[];
  onCreated?: (appointment: InstallerAppointment) => void;
};

function buildInitialForm(defaultCustomerId?: string | null): FormState {
  const { start, end } = defaultCreateAppointmentRange(
    INSTALLER_SCHEDULE_DEFAULTS.createDurationMs,
  );
  const customerId =
    defaultCustomerId && !defaultCustomerId.startsWith("fallback-")
      ? defaultCustomerId
      : "";

  return {
    title: "",
    startAt: toDateTimeInputValue(start),
    endAt: toDateTimeInputValue(end),
    status: "SCHEDULED",
    leadId: "",
    customerId,
    notes: "",
  };
}

export function InstallerCreateAppointmentModal({
  open,
  onClose,
  defaultCustomerId,
  customers: customersProp,
  onCreated,
}: Props) {
  const titleId = useId();
  const sharedCustomers = useInstallerCustomersOptional();
  const [formState, setFormState] = useState<FormState>(() =>
    buildInitialForm(defaultCustomerId),
  );
  const [leads, setLeads] = useState<InstallerLeadSummary[]>([]);
  const [fetchedCustomers, setFetchedCustomers] = useState<
    InstallerCustomerSummary[]
  >([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const customers =
    customersProp ?? sharedCustomers?.customers ?? fetchedCustomers;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setFormState(buildInitialForm(defaultCustomerId));
    setError(null);

    const controller = new AbortController();
    setLoadingOptions(true);

    const leadsPromise = fetchInstallerLeads(
      { page: 1, limit: 100 },
      { signal: controller.signal },
    );
    const customersPromise = customersProp
      ? Promise.resolve(customersProp)
      : sharedCustomers
        ? Promise.resolve(sharedCustomers.customers)
        : fetchInstallerCustomers(
            { limit: 100, leadLinkedOnly: true },
            { signal: controller.signal },
          );

    Promise.all([leadsPromise, customersPromise])
      .then(([leadResult, customerRows]) => {
        setLeads(leadResult.leads);
        if (!customersProp && !sharedCustomers) {
          setFetchedCustomers(customerRows);
        }
      })
      .catch((e) => {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setError(e instanceof Error ? e.message : "Failed to load form options");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingOptions(false);
      });

    return () => controller.abort();
  }, [customersProp, defaultCustomerId, open, sharedCustomers]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, open, submitting]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!formState.customerId) {
      const message = "Select a customer before saving.";
      setError(message);
      toast.error(message);
      return;
    }
    if (!formState.startAt || !formState.endAt) {
      const message = "Start and end time are required.";
      setError(message);
      toast.error(message);
      return;
    }
    if (new Date(formState.startAt) >= new Date(formState.endAt)) {
      const message = "Start time must be before end time.";
      setError(message);
      toast.error(message);
      return;
    }

    setSubmitting(true);
    try {
      const created = await createInstallerAppointment({
        title: formState.title.trim(),
        startAt: fromDateTimeInputValue(formState.startAt),
        endAt: fromDateTimeInputValue(formState.endAt),
        status: formState.status,
        ...(formState.leadId ? { leadId: formState.leadId } : {}),
        customerId: formState.customerId,
        notes: formState.notes.trim() || undefined,
      });
      toast.success("Appointment created successfully.");
      if (created) {
        onCreated?.(created);
      }
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create appointment";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-[rgba(47,47,47,0.67)] backdrop-blur-[1px]"
        onClick={() => {
          if (!submitting) onClose();
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-[1] max-h-[min(92vh,640px)] w-full max-w-[560px] overflow-y-auto rounded-[12px] border border-warm-border bg-white shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]"
      >
        <div className="sticky top-0 z-[1] border-b border-warm-border bg-linear-to-b from-yellow-lemon to-orange-amber px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-warm-black/10 text-warm-black">
                <Icon name="Calendar" className="size-4" />
              </span>
              <h2
                id={titleId}
                className="font-inter text-[14px] font-bold leading-[21px] text-warm-black"
              >
                Create appointment
              </h2>
            </div>
            <button
              type="button"
              className="flex size-6 items-center justify-center rounded-full bg-[rgba(28,26,23,0.1)] text-warm-black hover:bg-[rgba(28,26,23,0.18)]"
              onClick={onClose}
              disabled={submitting}
              aria-label="Close"
            >
              <Icon name="X" className="size-[14px]" />
            </button>
          </div>
        </div>

        <form className="space-y-4 px-4 py-4" onSubmit={(e) => void handleSubmit(e)}>
          {error ? (
            <p className="rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 font-dm-sans text-sm text-danger">
              {error}
            </p>
          ) : null}

          {loadingOptions ? (
            <p className="font-dm-sans text-sm text-warm-gray">Loading form…</p>
          ) : null}

          <label className="block">
            <span className="mb-1.5 block font-dm-sans text-xs font-semibold uppercase tracking-wide text-warm-gray">
              Title
            </span>
            <input
              required
              value={formState.title}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, title: e.target.value }))
              }
              disabled={submitting}
              className="w-full rounded-lg border border-warm-border bg-cream-50 px-3 py-2 font-dm-sans text-sm text-warm-ink outline-none focus:border-brand-blue"
              placeholder="Site visit, consultation…"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block font-dm-sans text-xs font-semibold uppercase tracking-wide text-warm-gray">
                Start
              </span>
              <input
                type="datetime-local"
                required
                value={formState.startAt}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, startAt: e.target.value }))
                }
                disabled={submitting}
                className="w-full rounded-lg border border-warm-border bg-cream-50 px-3 py-2 font-dm-sans text-sm text-warm-ink outline-none focus:border-brand-blue"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-dm-sans text-xs font-semibold uppercase tracking-wide text-warm-gray">
                End
              </span>
              <input
                type="datetime-local"
                required
                value={formState.endAt}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, endAt: e.target.value }))
                }
                disabled={submitting}
                className="w-full rounded-lg border border-warm-border bg-cream-50 px-3 py-2 font-dm-sans text-sm text-warm-ink outline-none focus:border-brand-blue"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block font-dm-sans text-xs font-semibold uppercase tracking-wide text-warm-gray">
              Status
            </span>
            <select
              value={formState.status}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  status: e.target.value as InstallerAppointmentStatus,
                }))
              }
              disabled={submitting}
              className="w-full rounded-lg border border-warm-border bg-cream-50 px-3 py-2 font-dm-sans text-sm text-warm-ink outline-none focus:border-brand-blue"
            >
              {INSTALLER_APPOINTMENT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block font-dm-sans text-xs font-semibold uppercase tracking-wide text-warm-gray">
                Lead (optional)
              </span>
              <select
                value={formState.leadId}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, leadId: e.target.value }))
                }
                disabled={submitting}
                className="w-full rounded-lg border border-warm-border bg-cream-50 px-3 py-2 font-dm-sans text-sm text-warm-ink outline-none focus:border-brand-blue"
              >
                <option value="">Select lead</option>
                {leads.map((lead) => (
                  <option key={lead.id} value={lead.id}>
                    {lead.customerName}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block font-dm-sans text-xs font-semibold uppercase tracking-wide text-warm-gray">
                Customer
              </span>
              <select
                required
                value={formState.customerId}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, customerId: e.target.value }))
                }
                disabled={submitting}
                className="w-full rounded-lg border border-warm-border bg-cream-50 px-3 py-2 font-dm-sans text-sm text-warm-ink outline-none focus:border-brand-blue"
              >
                <option value="">Select customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {appointmentCustomerDisplayName(customer)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block font-dm-sans text-xs font-semibold uppercase tracking-wide text-warm-gray">
              Notes
            </span>
            <textarea
              rows={3}
              value={formState.notes}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, notes: e.target.value }))
              }
              disabled={submitting}
              className="w-full resize-none rounded-lg border border-warm-border bg-cream-50 px-3 py-2 font-dm-sans text-sm text-warm-ink outline-none focus:border-brand-blue"
              placeholder="Optional notes for this appointment"
            />
          </label>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              className="inline-flex h-9 items-center rounded-lg border border-warm-border bg-white px-4 font-dm-sans text-sm font-semibold text-warm-ink hover:bg-cream-50"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || loadingOptions}
              className="inline-flex h-9 items-center rounded-lg bg-linear-to-br from-brand-blue to-brand-teal px-4 font-dm-sans text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
            >
              {submitting ? "Creating…" : "Create appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
