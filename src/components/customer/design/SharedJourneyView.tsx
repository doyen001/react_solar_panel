"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icons";
import {
  fetchSharedJourney,
  formatReferralCurrency,
  type SharedJourney,
} from "@/lib/customers/referrals";

type Props = {
  token: string;
  /** Referral code from the link, so a signup from here is attributed. */
  referralCode: string | null;
};

/**
 * The customer theme is dark (`--color-customer-card-bg: #0f2240`), so this page
 * uses the on-dark text tokens throughout. The light-theme `text-warm-ink` /
 * `text-warm-gray` are near-black and disappear against it.
 */
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="customer-card-bg customer-cream-card-border rounded-[10px] border px-4 py-3 text-center">
      <p className="font-inter text-lg font-bold leading-[27px] text-white">
        {value}
      </p>
      <p className="mt-1 font-dm-sans text-[9px] font-normal uppercase leading-[13.5px] tracking-[0.3px] customer-text-muted">
        {label}
      </p>
    </div>
  );
}

export function SharedJourneyView({ token, referralCode }: Props) {
  const [journey, setJourney] = useState<SharedJourney | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchSharedJourney(token)
      .then((data) => {
        if (!cancelled) setJourney(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "This shared design is unavailable",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  // Prefer the code from the payload; the query string is only a convenience and
  // can be stripped by the platforms the link travels through.
  const signupRef = journey?.referralCode ?? referralCode;
  const signupHref = signupRef
    ? `/customers/auth?ref=${encodeURIComponent(signupRef)}`
    : "/customers/auth";

  return (
    <div className="mx-auto flex w-full max-w-[720px] flex-1 flex-col gap-5 px-4 py-10">
      {loading ? (
        <p className="font-dm-sans text-sm customer-text-subtle">Loading…</p>
      ) : error || !journey ? (
        <div className="customer-card-bg customer-cream-card-border rounded-[10px] border p-8 text-center">
          <p className="font-dm-sans text-sm customer-text-subtle">
            {error ?? "This shared design is unavailable."}
          </p>
          <Link
            href="/designs"
            className="mt-3 inline-block font-dm-sans text-xs font-bold uppercase tracking-wide text-orange-amber underline"
          >
            Design your own system
          </Link>
        </div>
      ) : (
        <>
          <header className="text-center">
            <p className="font-dm-sans text-xs font-semibold uppercase tracking-wide customer-text-subtle">
              {journey.ownerFirstName}&apos;s solar journey
            </p>
            <h1 className="mt-1 font-inter text-2xl font-bold text-white">
              {journey.title}
            </h1>
            {journey.status === "COMPLETED" ? (
              <span className="mt-2 inline-block rounded-full bg-mint-soft px-2.5 py-0.5 font-inter text-[9px] font-bold uppercase tracking-[0.62px] text-success">
                Approved
              </span>
            ) : null}
          </header>

          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat
              label="System size"
              value={
                journey.systemSizeKw
                  ? `${journey.systemSizeKw.toFixed(1)} kW`
                  : "—"
              }
            />
            <Stat
              label="Panels"
              value={
                journey.panelCount != null ? String(journey.panelCount) : "—"
              }
            />
            <Stat
              label="Est. savings"
              value={
                journey.estimatedSavings
                  ? `${formatReferralCurrency(journey.estimatedSavings)}/yr`
                  : "—"
              }
            />
            <Stat label="Battery" value={journey.hasBattery ? "Yes" : "No"} />
          </section>

          <section className="customer-panel-bg customer-panel-border-dark rounded-[10px] border p-5 text-center">
            <Icon
              name="MyDesignGift"
              className="mx-auto size-5 text-white"
              aria-hidden
            />
            <p className="mt-2 font-inter text-base font-bold text-white">
              Want the same savings?
            </p>
            <p className="mt-1 font-dm-sans text-xs customer-text-subtle">
              {journey.ownerFirstName} went solar with EasyLink. Start your own
              free design in minutes.
            </p>
            <div className="mt-4 flex flex-col justify-center gap-2 sm:flex-row">
              <Link
                href="/designs"
                className="rounded-lg bg-linear-to-b from-yellow-lemon to-orange-amber px-4 py-2 font-dm-sans text-sm font-bold uppercase tracking-wide text-warm-black"
              >
                Design my system
              </Link>
              <Link
                href={signupHref}
                className="rounded-lg border border-white/40 px-4 py-2 font-dm-sans text-sm font-semibold text-white"
              >
                Create an account
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
