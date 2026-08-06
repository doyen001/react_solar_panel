"use client";

import classNames from "classnames";
import Image from "next/image";
import { useEffect, useId, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import Icon from "@/components/ui/Icons";
import type { InstallerCustomerSummary } from "@/lib/installers/customers";
import {
  createUnlimitCheckout,
  fetchUnlimitPaymentStatus,
  INSTALLER_PAYMENT_BRANDS,
  type UnlimitPaymentMethod,
} from "@/lib/installers/payments";

type Props = {
  open: boolean;
  onClose: () => void;
  customer: InstallerCustomerSummary | null;
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
  const [selectedBrandId, setSelectedBrandId] = useState<
    (typeof INSTALLER_PAYMENT_BRANDS)[number]["id"]
  >(INSTALLER_PAYMENT_BRANDS[0].id);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [configured, setConfigured] = useState<boolean | null>(null);

  const customerName = useMemo(() => customerDisplayName(customer), [customer]);
  const customerEmail = customer?.email?.trim() ?? "";

  const selectedBrand = useMemo(
    () =>
      INSTALLER_PAYMENT_BRANDS.find((b) => b.id === selectedBrandId) ??
      INSTALLER_PAYMENT_BRANDS[0],
    [selectedBrandId],
  );

  useEffect(() => {
    if (!open) return;
    setAmount("");
    setDescription("Solar installation payment");
    setSelectedBrandId(INSTALLER_PAYMENT_BRANDS[0].id);
    setError(null);
    void fetchUnlimitPaymentStatus()
      .then((status) => setConfigured(status.configured))
      .catch(() => setConfigured(false));
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customer?.id || !customerEmail || !customerName) {
      const message = "Select a customer with a valid email before taking payment.";
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
      const session = await createUnlimitCheckout({
        amount: parsedAmount,
        currency: "AUD",
        description: description.trim() || "Solar installation payment",
        customerId: customer.id,
        customerEmail,
        customerName,
        paymentMethod: selectedBrand.paymentMethod as UnlimitPaymentMethod,
      });

      window.open(session.redirectUrl, "_blank", "noopener,noreferrer");
      toast.success("Secure checkout opened in a new tab.");
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not start payment checkout";
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
        className="relative z-[1] max-h-[min(92vh,720px)] w-full max-w-[560px] overflow-y-auto rounded-[12px] border border-warm-border bg-white shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]"
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
          {configured === false ? (
            <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 font-dm-sans text-sm text-warm-ink">
              Unlimit is not configured yet. Add{" "}
              <code className="text-xs">UNLIMIT_TERMINAL_CODE</code> and{" "}
              <code className="text-xs">UNLIMIT_PASSWORD</code> on the backend.
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

          <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <label className="block">
              <span className="mb-1.5 block font-dm-sans text-xs font-semibold uppercase tracking-wide text-warm-gray">
                Amount (AUD)
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
          </div>

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

          <p className="font-dm-sans text-[11px] leading-[16px] text-warm-gray">
            You will be redirected to Unlimit secure checkout to complete the payment.
            Card, PayPal, and BNPL options depend on your Unlimit merchant account.
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
              disabled={
                submitting ||
                configured === false ||
                !customer?.id ||
                !customerEmail ||
                !amount
              }
              className="rounded-lg bg-linear-to-b from-yellow-lemon to-orange-amber px-4 py-2 font-dm-sans text-sm font-bold uppercase tracking-wide text-warm-black hover:opacity-95 disabled:opacity-60"
            >
              {submitting ? "Starting…" : "Continue to checkout"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
