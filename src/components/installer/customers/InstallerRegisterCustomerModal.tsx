"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import Icon from "@/components/ui/Icons";
import {
  createInstallerCustomer,
  type InstallerCustomerSummary,
} from "@/lib/installers/customers";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: (customer: InstallerCustomerSummary) => void;
  /**
   * Hands off to the bulk Excel import flow. Omitted when no import surface is
   * mounted, in which case the choice is hidden rather than shown broken.
   */
  onImportFromExcel?: () => void;
};

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
};

export function InstallerRegisterCustomerModal({
  open,
  onClose,
  onCreated,
  onImportFromExcel,
}: Props) {
  const titleId = useId();
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setForm(EMPTY_FORM);
    setError(null);
  }, [open]);

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

  function updateField(field: keyof typeof EMPTY_FORM, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const address = form.address.trim();

    if (!firstName || !lastName || !email) return;

    setSubmitting(true);
    setError(null);
    try {
      const saved = await createInstallerCustomer({
        firstName,
        lastName,
        email,
        ...(phone ? { phone } : {}),
        ...(address ? { address } : {}),
      });
      toast.success("Customer registered successfully.");
      onCreated?.(saved);
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to register customer";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit =
    Boolean(form.firstName.trim()) &&
    Boolean(form.lastName.trim()) &&
    Boolean(form.email.trim());

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
        className="relative z-[1] w-full max-w-[520px] overflow-hidden rounded-[12px] border border-warm-border bg-white shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]"
      >
        <div className="border-b border-warm-border bg-linear-to-b from-yellow-lemon to-orange-amber px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-warm-black/10 text-warm-black">
                <Icon name="UserPlus" className="size-4" />
              </span>
              <h2
                id={titleId}
                className="font-inter text-[14px] font-bold leading-[21px] text-warm-black"
              >
                Register new customer
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

        {onImportFromExcel ? (
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-warm-border bg-cream-50 px-4 py-2.5">
            <p className="font-dm-sans text-xs text-warm-gray">
              Adding one customer. Have a list?
            </p>
            <button
              type="button"
              onClick={onImportFromExcel}
              disabled={submitting}
              className="flex items-center gap-1.5 rounded-lg border border-warm-border bg-white px-3 py-1.5 font-dm-sans text-xs font-semibold text-warm-ink hover:bg-cream-50 disabled:opacity-60"
            >
              <Icon name="ArrowUpRight" className="size-3.5" />
              Import from Excel file
            </button>
          </div>
        ) : null}

        <form className="space-y-4 px-4 py-4" onSubmit={(e) => void handleSubmit(e)}>
          {error ? (
            <p className="rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 font-dm-sans text-sm text-danger">
              {error}
            </p>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block font-dm-sans text-xs font-semibold uppercase tracking-wide text-warm-gray">
                First name
              </span>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                required
                disabled={submitting}
                autoComplete="given-name"
                className="w-full rounded-lg border border-warm-border bg-cream-50 px-3 py-2 font-dm-sans text-sm text-warm-ink outline-none focus:border-brand-blue"
                placeholder="First name"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block font-dm-sans text-xs font-semibold uppercase tracking-wide text-warm-gray">
                Last name
              </span>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                required
                disabled={submitting}
                autoComplete="family-name"
                className="w-full rounded-lg border border-warm-border bg-cream-50 px-3 py-2 font-dm-sans text-sm text-warm-ink outline-none focus:border-brand-blue"
                placeholder="Last name"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block font-dm-sans text-xs font-semibold uppercase tracking-wide text-warm-gray">
              Email
            </span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              required
              disabled={submitting}
              autoComplete="email"
              className="w-full rounded-lg border border-warm-border bg-cream-50 px-3 py-2 font-dm-sans text-sm text-warm-ink outline-none focus:border-brand-blue"
              placeholder="customer@example.com"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block font-dm-sans text-xs font-semibold uppercase tracking-wide text-warm-gray">
              Phone <span className="font-normal normal-case">(optional)</span>
            </span>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              disabled={submitting}
              autoComplete="tel"
              className="w-full rounded-lg border border-warm-border bg-cream-50 px-3 py-2 font-dm-sans text-sm text-warm-ink outline-none focus:border-brand-blue"
              placeholder="Phone number"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block font-dm-sans text-xs font-semibold uppercase tracking-wide text-warm-gray">
              Address <span className="font-normal normal-case">(optional)</span>
            </span>
            <input
              type="text"
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
              disabled={submitting}
              autoComplete="street-address"
              className="w-full rounded-lg border border-warm-border bg-cream-50 px-3 py-2 font-dm-sans text-sm text-warm-ink outline-none focus:border-brand-blue"
              placeholder="Installation address"
            />
          </label>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-warm-border px-4 py-2 font-dm-sans text-sm font-medium text-warm-ink hover:bg-cream-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !canSubmit}
              className="rounded-lg bg-linear-to-b from-yellow-lemon to-orange-amber px-4 py-2 font-dm-sans text-sm font-bold uppercase tracking-wide text-warm-black hover:opacity-95 disabled:opacity-60"
            >
              {submitting ? "Registering…" : "Register customer"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
