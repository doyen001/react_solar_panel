"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import {
  formatPaymentAmount,
  refreshInstallerPayment,
} from "@/lib/installers/payments";

/**
 * Stripe sends the installer back to the dashboard with `?payment=...`.
 * We surface the outcome, then strip the params so a refresh does not re-toast.
 */
export function InstallerPaymentReturnNotice() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const handled = useRef<string | null>(null);

  const outcome = params.get("payment");
  const paymentId = params.get("paymentId");

  useEffect(() => {
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
      toast.info("Payment was cancelled — nothing was charged.");
      clearParams();
      return;
    }

    if (outcome !== "success") {
      clearParams();
      return;
    }

    if (!paymentId) {
      toast.success("Payment completed.");
      clearParams();
      return;
    }

    // The webhook is authoritative but may not have landed yet, so pull the
    // state straight from Stripe before telling the installer anything.
    void refreshInstallerPayment(paymentId)
      .then((payment) => {
        if (payment.status === "PAID") {
          toast.success(`Payment of ${formatPaymentAmount(payment)} received.`);
        } else if (payment.status === "PENDING") {
          toast.info(
            "Checkout finished — Stripe is still confirming this payment.",
          );
        } else {
          toast.error(
            payment.failureMessage ?? `Payment ${payment.status.toLowerCase()}.`,
          );
        }
      })
      .catch(() => {
        toast.info("Checkout finished — could not confirm the payment status.");
      })
      .finally(clearParams);
  }, [outcome, params, pathname, paymentId, router]);

  return null;
}
