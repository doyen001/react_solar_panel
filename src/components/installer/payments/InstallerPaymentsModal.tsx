"use client";

import classNames from "classnames";
import Image from "next/image";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import Icon from "@/components/ui/Icons";
import type { InstallerCustomerSummary } from "@/lib/installers/customers";
import {
  createStripeCheckout,
  fetchInstallerPayments,
  fetchStripePaymentStatus,
  formatPaymentAmount,
  INSTALLER_PAYMENT_BRANDS,
  PAYMENT_STATUS_LABELS,
  type InstallerPayment,
  type PaymentStatus,
  type StripePaymentMethodGroup,
  type StripePaymentStatus,
} from "@/lib/installers/payments";

type Props = {
  open: boolean;
  onClose: () => void;
  customer: InstallerCustomerSummary | null;
};

const STATUS_STYLES: Record<PaymentStatus, string> = {
  PAID: "bg-emerald-500/10 text-emerald-700",
  PENDING: "bg-amber-500/10 text-amber-700",
  FAILED: "bg-danger/10 text-danger",
  CANCELLED: "bg-warm-black/5 text-warm-gray",
  REFUNDED: "bg-brand-blue/10 text-brand-blue",
};

function customerDisplayName(customer: InstallerCustomerSummary | null) {
  if (!customer) return "";
  const full = `${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim();
  return full || customer.email?.trim() || "";
}

export function InstallerPaymentsModal({ open, onClose, customer }: Props) {
  const titleId = useId();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("Solar installation payment");
  const [selectedBrandId, setSelectedBrandId] =
    useState<StripePaymentMethodGroup>(INSTALLER_PAYMENT_BRANDS[0].id);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [providerStatus, setProviderStatus] =
    useState<StripePaymentStatus | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [history, setHistory] = useState<InstallerPayment[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const customerName = useMemo(() => customerDisplayName(customer), [customer]);
  const customerEmail = customer?.email?.trim() ?? "";
  const customerId = customer?.id;
  const currency = providerStatus?.defaultCurrency ?? "AUD";
  const configured = providerStatus?.configured ?? null;

  const loadHistory = useCallback(async (id: string) => {
    setHistoryLoading(true);
    try {
      setHistory(await fetchInstallerPayments({ customerId: id, limit: 5 }));
    } catch {
      // History is supplementary — a failure here must not block taking a payment.
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    setAmount("");
    setDescription("Solar installation payment");
    setSelectedBrandId(INSTALLER_PAYMENT_BRANDS[0].id);
    setError(null);
    setHistory([]);
    setStatusError(null);
    setProviderStatus(null);

    void fetchStripePaymentStatus()
      .then((status) => {
        setProviderStatus(status);
        setStatusError(null);
      })
      .catch((err: unknown) => {
        // Distinct from `configured: false` — the server never answered, so we
        // genuinely do not know whether Stripe is set up.
        setStatusError(
          err instanceof Error
            ? err.message
            : "Could not reach the payments service.",
        );
      });

    if (customerId) void loadHistory(customerId);
  }, [customerId, loadHistory, open]);

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
    if (!customerId || !customerEmail || !customerName) {
      const message =
        "Select a customer with a valid email before taking payment.";
      setError(message);
      toast.error(message);
      return;
    }

    const parsedAmount = Number.parseFloat(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Enter a valid payment amount.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const session = await createStripeCheckout({
        amount: parsedAmount,
        currency,
        description: description.trim() || "Solar installation payment",
        customerId,
        customerEmail,
        customerName,
        paymentMethod: selectedBrandId,
      });

      toast.info("Redirecting to Stripe secure checkout…");
      // Full-page redirect rather than window.open: popup blockers reject an
      // async-opened tab, and Stripe returns us to the dashboard either way.
      window.location.assign(session.checkoutUrl);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not start payment checkout";
      setError(message);
      toast.error(message);
      setSubmitting(false);
    }
  }

  if (!open || typeof document === "undefined") return null;

  const submitDisabled =
    submitting ||
    configured === false ||
    providerStatus?.keyFormatValid === false ||
    !customerId ||
    !customerEmail ||
    !amount;

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
        className="relative z-[1] max-h-[min(92vh,760px)] w-full max-w-[560px] overflow-y-auto rounded-[12px] border border-warm-border bg-white shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]"
      >
        <div className="border-b border-warm-border bg-linear-to-b from-yellow-lemon to-orange-amber px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-warm-black/10 text-warm-black">
                <Icon name="Dollar" className="size-4" />
              </span>
              <h2
                id={titleId}
                className="font-inter text-[14px] font-bold leading-[21px] text-warm-black"
              >
                Collect payment
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
          {statusError ? (
            <p className="rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 font-dm-sans text-sm text-danger">
              Could not reach the payments service, so Stripe availability is
              unknown: {statusError}
            </p>
          ) : null}

          {configured === false ? (
            <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 font-dm-sans text-sm text-warm-ink">
              Stripe is not configured yet. Add{" "}
              <code className="text-xs">STRIPE_SECRET_KEY</code> to the backend{" "}
              <code className="text-xs">.env</code> and restart the backend —
              environment variables are only read at startup.
            </p>
          ) : null}

          {configured && providerStatus?.keyFormatValid === false ? (
            <p className="rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 font-dm-sans text-sm text-danger">
              <code className="text-xs">STRIPE_SECRET_KEY</code> is set but does
              not look like a Stripe secret key. Expected{" "}
              <code className="text-xs">sk_test_…</code> or{" "}
              <code className="text-xs">sk_live_…</code> from the Stripe
              Dashboard API keys page.
            </p>
          ) : null}

          {configured && providerStatus?.webhookConfigured === false ? (
            <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 font-dm-sans text-sm text-warm-ink">
              <code className="text-xs">STRIPE_WEBHOOK_SECRET</code> is missing, so
              payments will stay “Awaiting payment” until refreshed manually.
            </p>
          ) : null}

          {error ? (
            <p className="rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 font-dm-sans text-sm text-danger">
              {error}
            </p>
          ) : null}

          <div className="rounded-lg border border-warm-border bg-cream-50 px-3 py-2.5">
            <p className="font-dm-sans text-[10px] font-semibold uppercase tracking-wide text-warm-gray">
              Customer
            </p>
            <p className="mt-1 font-dm-sans text-sm font-semibold text-warm-ink">
              {customerName || "No customer selected"}
            </p>
            {customerEmail ? (
              <p className="font-dm-sans text-xs text-warm-gray">{customerEmail}</p>
            ) : null}
          </div>

          <label className="block">
            <span className="mb-1.5 block font-dm-sans text-xs font-semibold uppercase tracking-wide text-warm-gray">
              Amount ({currency})
            </span>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              disabled={submitting}
              className="w-full rounded-lg border border-warm-border bg-cream-50 px-3 py-2 font-dm-sans text-sm text-warm-ink outline-none focus:border-brand-blue"
              placeholder="0.00"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block font-dm-sans text-xs font-semibold uppercase tracking-wide text-warm-gray">
              Description
            </span>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
              disabled={submitting}
              className="w-full rounded-lg border border-warm-border bg-cream-50 px-3 py-2 font-dm-sans text-sm text-warm-ink outline-none focus:border-brand-blue"
            />
          </label>

          <div>
            <span className="mb-2 block font-dm-sans text-xs font-semibold uppercase tracking-wide text-warm-gray">
              Payment method
            </span>
            <div className="grid gap-2">
              {INSTALLER_PAYMENT_BRANDS.map((brand) => {
                const selected = brand.id === selectedBrandId;
                return (
                  <button
                    key={brand.id}
                    type="button"
                    disabled={submitting}
                    onClick={() => setSelectedBrandId(brand.id)}
                    aria-pressed={selected}
                    className={classNames(
                      "rounded-lg border px-3 py-3 text-left transition-colors",
                      selected
                        ? "border-brand-blue bg-brand-blue/5"
                        : "border-warm-border bg-white hover:bg-cream-50",
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={classNames(
                          "font-dm-sans text-sm font-semibold",
                          selected ? "text-brand-blue" : "text-warm-ink",
                        )}
                      >
                        {brand.label}
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        {brand.logos.map((logo) => (
                          <Image
                            key={logo.name}
                            src={logo.src}
                            alt={logo.name}
                            width={72}
                            height={28}
                            className="h-6 w-auto max-w-[72px] object-contain"
                          />
                        ))}
                      </div>
                    </div>
                    {"note" in brand && brand.note ? (
                      <p className="mt-2 font-dm-sans text-[11px] text-warm-gray">
                        {brand.note}
                      </p>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {customerId ? (
            <div>
              <span className="mb-2 block font-dm-sans text-xs font-semibold uppercase tracking-wide text-warm-gray">
                Recent payments
              </span>
              {historyLoading ? (
                <p className="font-dm-sans text-xs text-warm-gray">Loading…</p>
              ) : history.length === 0 ? (
                <p className="font-dm-sans text-xs text-warm-gray">
                  No payments recorded for this customer yet.
                </p>
              ) : (
                <ul className="divide-y divide-warm-border rounded-lg border border-warm-border">
                  {history.map((payment) => (
                    <li
                      key={payment.id}
                      className="flex items-center justify-between gap-3 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-dm-sans text-sm text-warm-ink">
                          {formatPaymentAmount(payment)}
                        </p>
                        <p className="truncate font-dm-sans text-[11px] text-warm-gray">
                          {payment.description}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {payment.receiptUrl ? (
                          <a
                            href={payment.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-dm-sans text-[11px] font-semibold text-brand-blue underline"
                          >
                            Receipt
                          </a>
                        ) : null}
                        <span
                          className={classNames(
                            "rounded-full px-2 py-0.5 font-dm-sans text-[10px] font-semibold uppercase tracking-wide",
                            STATUS_STYLES[payment.status],
                          )}
                        >
                          {PAYMENT_STATUS_LABELS[payment.status]}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}

          <p className="font-dm-sans text-[11px] leading-[16px] text-warm-gray">
            You will be redirected to Stripe secure checkout and returned here once
            the payment is finished. Available methods depend on your Stripe account.
          </p>

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
              disabled={submitDisabled}
              className="rounded-lg bg-linear-to-b from-yellow-lemon to-orange-amber px-4 py-2 font-dm-sans text-sm font-bold uppercase tracking-wide text-warm-black hover:opacity-95 disabled:opacity-60"
            >
              {submitting ? "Redirecting…" : "Continue to checkout"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
