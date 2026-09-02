"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icons";
import { createAdQuoteCheckout, type AdQuoteTierId } from "@/lib/public/adQuoteCheckout";
import { renderGoogleSignInButton } from "@/lib/public/googleIdentity";

type Props = {
  tierId: AdQuoteTierId;
  tierName: string;
  priceLabel: string;
  onClose: () => void;
};

/**
 * "Sign in with Google, then straight to Stripe" — no account, no password.
 * The Google button itself hands us a signed ID token; we send that straight
 * to the backend, which verifies it and creates the Checkout session.
 */
export function PricingCheckoutModal({ tierId, tierName, priceLabel, onClose }: Props) {
  const buttonHostRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitting]);

  useEffect(() => {
    const host = buttonHostRef.current;
    if (!host) return;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

    void renderGoogleSignInButton(host, clientId, (idToken) => {
      setSubmitting(true);
      setError(null);
      void createAdQuoteCheckout({ tierId, googleIdToken: idToken })
        .then((session) => {
          window.location.assign(session.checkoutUrl);
        })
        .catch((err: unknown) => {
          setError(err instanceof Error ? err.message : "Could not start checkout");
          setSubmitting(false);
        });
    }).catch((err: unknown) => {
      setError(
        err instanceof Error ? err.message : "Could not load Google sign-in",
      );
    });
  }, [tierId]);

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 px-4"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0"
        onClick={() => {
          if (!submitting) onClose();
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pricing-checkout-title"
        className="relative z-1 w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2
              id="pricing-checkout-title"
              className="font-outfit text-lg font-bold text-svc-ink"
            >
              {tierName}
            </h2>
            <p className="mt-0.5 font-dm-sans text-sm text-svc-muted">{priceLabel}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-svc-muted hover:bg-svc-accent-soft disabled:opacity-50"
          >
            <Icon name="X" className="size-4" />
          </button>
        </div>

        <p className="mt-4 font-dm-sans text-sm leading-6 text-svc-body">
          Sign in with Google to confirm who to send the receipt and project
          updates to, then you&apos;ll go straight to Stripe&apos;s secure
          checkout to pay.
        </p>

        {error ? (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 font-dm-sans text-sm text-red-800">
            {error}
          </p>
        ) : null}

        <div className="mt-5 flex flex-col items-center gap-3">
          <div ref={buttonHostRef} />
          {submitting ? (
            <p className="font-dm-sans text-sm text-svc-muted">
              Redirecting to Stripe secure checkout…
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
