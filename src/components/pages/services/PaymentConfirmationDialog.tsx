"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import Icon from "@/components/ui/Icons";
import {
  refreshAdQuotePayment,
  type AdQuotePayment,
} from "@/lib/public/adQuoteCheckout";

type DialogState =
  | { kind: "cancelled" }
  | { kind: "success"; payment: AdQuotePayment }
  | { kind: "success-unconfirmed" }
  | { kind: "pending" }
  | { kind: "failed"; message: string }
  | { kind: "error"; message: string };

function formatAmount(payment: { amount: number; currency: string }): string {
  try {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: payment.currency,
    }).format(payment.amount);
  } catch {
    return `${payment.amount.toFixed(2)} ${payment.currency}`;
  }
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-AU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

/**
 * Stripe sends the visitor back to /services with `?payment=...`. This is
 * the customer's actual order confirmation — a real dialog with the
 * transaction details and what they bought, since a guest Google-sign-in
 * checkout has no account/dashboard to check it in afterwards.
 */
export function PaymentConfirmationDialog() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const handled = useRef<string | null>(null);
  const [state, setState] = useState<DialogState | null>(null);

  const outcome = params.get("payment");
  const paymentId = params.get("paymentId");

  // An Effect Event, not a plain callback: it always sees the latest
  // outcome/paymentId/etc. without being a reactive dependency itself.
  const onCheckoutOutcome = useEffectEvent(async () => {
    if (!outcome) return;

    const key = `${outcome}:${paymentId ?? ""}`;
    if (handled.current === key) return;
    handled.current = key;

    const clearParams = () => {
      const next = new URLSearchParams(params.toString());
      next.delete("payment");
      next.delete("paymentId");
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    };

    if (outcome === "cancelled") {
      setState({ kind: "cancelled" });
      clearParams();
      return;
    }

    if (outcome !== "success") {
      clearParams();
      return;
    }

    if (!paymentId) {
      setState({ kind: "success-unconfirmed" });
      clearParams();
      return;
    }

    try {
      const payment = await refreshAdQuotePayment(paymentId);
      if (payment.status === "PAID") {
        setState({ kind: "success", payment });
      } else if (payment.status === "PENDING") {
        setState({ kind: "pending" });
      } else {
        setState({
          kind: "failed",
          message: payment.failureMessage ?? `Payment ${payment.status.toLowerCase()}.`,
        });
      }
    } catch {
      setState({
        kind: "error",
        message: "Checkout finished, but we couldn't confirm the payment status just now.",
      });
    } finally {
      clearParams();
    }
  });

  useEffect(() => {
    onCheckoutOutcome();
  }, [outcome, paymentId]);

  useEffect(() => {
    if (!state) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setState(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state]);

  if (!state) return null;

  const goHome = () => {
    setState(null);
    router.push("/");
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 px-4" role="presentation">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0"
        onClick={() => setState(null)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-confirmation-title"
        className="relative z-1 w-full max-w-[440px] rounded-2xl bg-white p-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={() => setState(null)}
          aria-label="Close"
          className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-svc-muted hover:bg-svc-accent-soft"
        >
          <Icon name="X" className="size-4" />
        </button>

        {state.kind === "success" ? (
          <>
            <div className="flex size-14 items-center justify-center rounded-full bg-emerald-100">
              <Icon name="Check" className="size-7 text-emerald-600" />
            </div>
            <h2
              id="payment-confirmation-title"
              className="mt-4 font-outfit text-xl font-bold text-svc-ink"
            >
              Payment confirmed
            </h2>
            <p className="mt-1 font-dm-sans text-sm text-svc-body">
              Thanks, {state.payment.customerName || "there"} — we&apos;ve received your
              payment and will be in touch shortly to get started.
            </p>

            <div className="mt-5 rounded-xl border border-svc-border-soft bg-svc-accent-soft/40 p-4">
              <dl className="flex flex-col gap-3 font-dm-sans text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-svc-muted">Order</dt>
                  <dd className="font-semibold text-svc-ink">{state.payment.description}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-svc-muted">Amount paid</dt>
                  <dd className="font-semibold text-svc-ink">{formatAmount(state.payment)}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-svc-muted">Date</dt>
                  <dd className="text-svc-ink">{formatDate(state.payment.paidAt)}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-svc-muted">Reference</dt>
                  <dd className="font-mono text-[11px] text-svc-ink">{state.payment.id}</dd>
                </div>
              </dl>
            </div>

            <p className="mt-4 font-dm-sans text-xs text-svc-muted">
              A receipt has also been emailed to {state.payment.customerEmail}.
              {state.payment.receiptUrl ? (
                <>
                  {" "}
                  <a
                    href={state.payment.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-svc-accent-text underline"
                  >
                    View Stripe receipt
                  </a>
                </>
              ) : null}
            </p>
          </>
        ) : state.kind === "cancelled" ? (
          <>
            <div className="flex size-14 items-center justify-center rounded-full bg-svc-accent-soft">
              <Icon name="X" className="size-7 text-svc-accent-text" />
            </div>
            <h2 id="payment-confirmation-title" className="mt-4 font-outfit text-xl font-bold text-svc-ink">
              Checkout cancelled
            </h2>
            <p className="mt-1 font-dm-sans text-sm text-svc-body">
              Nothing was charged. You can restart checkout any time from the pricing
              section below.
            </p>
          </>
        ) : state.kind === "pending" ? (
          <>
            <div className="flex size-14 items-center justify-center rounded-full bg-amber-100">
              <Icon name="Clock" className="size-7 text-amber-600" />
            </div>
            <h2 id="payment-confirmation-title" className="mt-4 font-outfit text-xl font-bold text-svc-ink">
              Confirming your payment…
            </h2>
            <p className="mt-1 font-dm-sans text-sm text-svc-body">
              Checkout finished and Stripe is still confirming this payment. You&apos;ll
              get an email receipt as soon as it clears — no need to try again.
            </p>
          </>
        ) : state.kind === "success-unconfirmed" ? (
          <>
            <div className="flex size-14 items-center justify-center rounded-full bg-emerald-100">
              <Icon name="Check" className="size-7 text-emerald-600" />
            </div>
            <h2 id="payment-confirmation-title" className="mt-4 font-outfit text-xl font-bold text-svc-ink">
              Order completed
            </h2>
            <p className="mt-1 font-dm-sans text-sm text-svc-body">
              Thanks — your order went through. We&apos;ll be in touch shortly.
            </p>
          </>
        ) : (
          <>
            <div className="flex size-14 items-center justify-center rounded-full bg-red-100">
              <Icon name="X" className="size-7 text-red-600" />
            </div>
            <h2 id="payment-confirmation-title" className="mt-4 font-outfit text-xl font-bold text-svc-ink">
              {state.kind === "failed" ? "Payment not completed" : "Something went wrong"}
            </h2>
            <p className="mt-1 font-dm-sans text-sm text-svc-body">{state.message}</p>
          </>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setState(null)}
            className="rounded-xl border-2 border-svc-accent px-5 py-2.5 font-outfit text-sm font-semibold text-svc-accent-text transition hover:bg-svc-accent-soft"
          >
            Close
          </button>
          <button
            type="button"
            onClick={goHome}
            className="svc-cta-primary rounded-xl px-5 py-2.5 font-outfit text-sm font-semibold text-warm-black"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
