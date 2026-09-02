"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import Icon from "@/components/ui/Icons";
import { AuthCard } from "@/components/ui/auth/AuthCard";

type VerifyState =
  | { kind: "loading" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

export function VerifyEmailStatus() {
  const params = useSearchParams();
  const token = params.get("token");
  const handled = useRef<string | null>(null);
  const [state, setState] = useState<VerifyState>(
    token ? { kind: "loading" } : { kind: "error", message: "This link is missing a verification token." },
  );

  const onVerify = useEffectEvent(async () => {
    if (!token || handled.current === token) return;
    handled.current = token;

    try {
      const res = await fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`, {
        cache: "no-store",
      });
      const json = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) {
        setState({
          kind: "error",
          message: json.message || "This verification link is invalid or has expired.",
        });
        return;
      }
      setState({ kind: "success", message: json.message || "Email verified successfully." });
    } catch {
      setState({
        kind: "error",
        message: "Could not reach the verification service. Please try again shortly.",
      });
    }
  });

  useEffect(() => {
    onVerify();
  }, [token]);

  return (
    <AuthCard className="w-full max-w-[440px] p-[3px]">
      <div className="flex flex-col items-center gap-4 rounded-[21px] bg-white px-8 py-10 text-center">
        {state.kind === "loading" ? (
          <>
            <span className="flex size-14 items-center justify-center rounded-full bg-cream-150">
              <span className="size-6 animate-spin rounded-full border-2 border-warm-gray/40 border-t-warm-ink" />
            </span>
            <h1 className="font-inter text-xl font-bold text-warm-ink">Verifying your email…</h1>
            <p className="font-dm-sans text-sm text-warm-gray">
              Just a moment while we confirm your link.
            </p>
          </>
        ) : state.kind === "success" ? (
          <>
            <span className="flex size-14 items-center justify-center rounded-full bg-mint-soft">
              <Icon name="CheckCircle" className="size-7 text-success" />
            </span>
            <h1 className="font-inter text-xl font-bold text-warm-ink">Email verified</h1>
            <p className="font-dm-sans text-sm text-warm-gray">{state.message}</p>
            <Link
              href="/customers/auth"
              className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-xl bg-linear-to-r from-yellow-lemon to-orange-amber px-6 font-inter text-sm font-bold text-warm-black"
            >
              Continue to sign in
            </Link>
          </>
        ) : (
          <>
            <span className="flex size-14 items-center justify-center rounded-full bg-danger/10">
              <Icon name="AlertTriangle" className="size-7 text-danger" />
            </span>
            <h1 className="font-inter text-xl font-bold text-warm-ink">Verification failed</h1>
            <p className="font-dm-sans text-sm text-warm-gray">{state.message}</p>
            <Link
              href="/customers/auth"
              className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-xl border-2 border-warm-ink/20 px-6 font-inter text-sm font-bold text-warm-ink hover:bg-cream-50"
            >
              Back to sign in
            </Link>
          </>
        )}
      </div>
    </AuthCard>
  );
}
