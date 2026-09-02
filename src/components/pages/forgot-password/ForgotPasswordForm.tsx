"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthCard } from "@/components/ui/auth/AuthCard";
import { AuthField } from "@/components/ui/auth/AuthField";
import { AuthPrimaryButton } from "@/components/ui/auth/AuthButtons";
import Icon from "@/components/ui/Icons";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/lib/validations/auth";

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setServerError(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { message?: string };
        setServerError(json.message || "Something went wrong. Please try again.");
        return;
      }
      setSent(true);
    } catch {
      setServerError("Could not reach the server. Please try again shortly.");
    }
  };

  return (
    <AuthCard className="w-full max-w-[440px] p-[3px]">
      <div className="flex flex-col gap-4 rounded-[21px] bg-white px-8 py-10">
        {sent ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-mint-soft">
              <Icon name="Mail" className="size-7 text-success" />
            </span>
            <h1 className="font-inter text-xl font-bold text-warm-ink">Check your email</h1>
            <p className="font-dm-sans text-sm text-warm-gray">
              If that email is registered, we&apos;ve sent a link to reset your password.
              It expires in 1 hour.
            </p>
            <Link
              href="/customers/auth"
              className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-xl border-2 border-warm-ink/20 px-6 font-inter text-sm font-bold text-warm-ink hover:bg-cream-50"
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
            <div className="text-center">
              <h1 className="font-inter text-xl font-bold text-warm-ink">Forgot your password?</h1>
              <p className="mt-1 font-dm-sans text-sm text-warm-gray">
                Enter the email on your account and we&apos;ll send you a reset link.
              </p>
            </div>

            {serverError ? (
              <p className="rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 font-dm-sans text-sm text-danger">
                {serverError}
              </p>
            ) : null}

            <AuthField
              icon={<Icon name="Mail" />}
              placeholder="Email"
              type="email"
              inputClassName="text-[16px] tracking-[-0.3125px]"
              error={errors.email?.message}
              {...register("email")}
            />

            <AuthPrimaryButton
              type="submit"
              icon={<Icon name="ArrowRight" />}
              label={isSubmitting ? "Sending…" : "Send reset link"}
            />

            <Link
              href="/customers/auth"
              className="text-center font-source-sans text-[14px] font-medium text-(--color-auth-subtle-60) underline"
            >
              Back to sign in
            </Link>
          </form>
        )}
      </div>
    </AuthCard>
  );
}
