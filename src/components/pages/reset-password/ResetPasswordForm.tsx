"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthCard } from "@/components/ui/auth/AuthCard";
import { AuthField } from "@/components/ui/auth/AuthField";
import { AuthPrimaryButton } from "@/components/ui/auth/AuthButtons";
import Icon from "@/components/ui/Icons";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/lib/validations/auth";

export function ResetPasswordForm() {
  const params = useSearchParams();
  const token = params.get("token");
  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;
    setServerError(null);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: data.password }),
      });
      const json = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) {
        setServerError(json.message || "This reset link is invalid or has expired.");
        return;
      }
      setDone(true);
    } catch {
      setServerError("Could not reach the server. Please try again shortly.");
    }
  };

  if (!token) {
    return (
      <AuthCard className="w-full max-w-[440px] p-[3px]">
        <div className="flex flex-col items-center gap-4 rounded-[21px] bg-white px-8 py-10 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-danger/10">
            <Icon name="AlertTriangle" className="size-7 text-danger" />
          </span>
          <h1 className="font-inter text-xl font-bold text-warm-ink">Invalid link</h1>
          <p className="font-dm-sans text-sm text-warm-gray">
            This link is missing a reset token. Request a new one below.
          </p>
          <Link
            href="/forgot-password"
            className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-xl bg-linear-to-r from-yellow-lemon to-orange-amber px-6 font-inter text-sm font-bold text-warm-black"
          >
            Request a new link
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard className="w-full max-w-[440px] p-[3px]">
      <div className="flex flex-col gap-4 rounded-[21px] bg-white px-8 py-10">
        {done ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-mint-soft">
              <Icon name="CheckCircle" className="size-7 text-success" />
            </span>
            <h1 className="font-inter text-xl font-bold text-warm-ink">Password reset</h1>
            <p className="font-dm-sans text-sm text-warm-gray">
              Your password has been updated. You can now sign in with it.
            </p>
            <Link
              href="/customers/auth"
              className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-xl bg-linear-to-r from-yellow-lemon to-orange-amber px-6 font-inter text-sm font-bold text-warm-black"
            >
              Continue to sign in
            </Link>
          </div>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
            <div className="text-center">
              <h1 className="font-inter text-xl font-bold text-warm-ink">Set a new password</h1>
              <p className="mt-1 font-dm-sans text-sm text-warm-gray">
                Choose a new password for your account.
              </p>
            </div>

            {serverError ? (
              <p className="rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 font-dm-sans text-sm text-danger">
                {serverError}
              </p>
            ) : null}

            <AuthField
              icon={<Icon name="Lock" />}
              placeholder="New password"
              type={showPassword ? "text" : "password"}
              inputClassName="text-[16px] tracking-[-0.3125px]"
              error={errors.password?.message}
              right={
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((x) => !x)}
                  className="text-auth-placeholder"
                >
                  <Icon name="Eye" />
                </button>
              }
              {...register("password")}
            />
            <AuthField
              icon={<Icon name="Lock" />}
              placeholder="Confirm new password"
              type={showPassword ? "text" : "password"}
              inputClassName="text-[16px] tracking-[-0.3125px]"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            <AuthPrimaryButton
              type="submit"
              icon={<Icon name="ArrowRight" />}
              label={isSubmitting ? "Saving…" : "Reset password"}
            />
          </form>
        )}
      </div>
    </AuthCard>
  );
}
