"use client";

import Image from "next/image";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthCard } from "@/components/ui/auth/AuthCard";
import { AuthDivider } from "@/components/ui/auth/AuthDivider";
import { AuthField } from "@/components/ui/auth/AuthField";
import {
  AuthGhostButton,
  AuthPrimaryButton,
} from "@/components/ui/auth/AuthButtons";
import {
  IconArrowIn,
  IconCircleQuestion,
  IconEye,
  IconLock,
  IconMail,
  IconPhone,
  IconPin,
  IconSolarDesignLogo,
  IconUser,
  IconUserPlus,
} from "@/components/ui/Icons";
import {
  signInSchema,
  signUpSchema,
  type SignInFormData,
  type SignUpFormData,
} from "@/lib/validations/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/lib/store/hooks";
import { setUser, type CustomerUser } from "@/lib/store/customerAuthSlice";
import { DesignTopBar } from "../../../components/modules/DesignTopBar";

type Mode = "signin" | "signup";

function SignInForm({ onSwitchMode }: { onSwitchMode: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      const response = await fetch("/api/customers/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = (await response.json().catch(() => null)) as {
        message?: string;
        user?: CustomerUser;
        fieldErrors?: Partial<Record<keyof SignInFormData, string[]>>;
      } | null;

      if (!response.ok) {
        if (result?.fieldErrors) {
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            const firstMessage = messages?.[0];
            if (firstMessage) {
              setError(field as keyof SignInFormData, {
                type: "server",
                message: firstMessage,
              });
            }
          }
        }

        toast.error(
          result?.message ?? "Unable to sign you in. Please try again.",
        );
        return;
      }

      toast.success(result?.message ?? "Signed in successfully.");
      if (result?.user) {
        dispatch(setUser(result.user));
      }
      const from = searchParams.get("from");
      const safeFrom =
        from &&
        from.startsWith("/customers") &&
        !from.startsWith("/customers/auth")
          ? from
          : "/customers/dashboard";
      router.push(safeFrom);
      router.refresh();
    } catch {
      toast.error("Unable to reach the login service. Please try again.");
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center px-[32px] py-[20px]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex w-[579px] max-w-full flex-col gap-[32px]"
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-[4px] pr-[64px]">
            <p className="font-source-sans text-[24px] font-bold leading-[36px] tracking-[0.5px] text-auth-title">
              Welcome Back
            </p>
            <p className="font-source-sans text-[14px] font-medium leading-[20px] tracking-[-0.1504px] text-(--color-auth-subtle-70)">
              Sign in to your account
            </p>
          </div>
          <div>
            <IconSolarDesignLogo className="w-[54px] h-[54px]" />
          </div>
        </div>

        <div className="flex flex-col gap-[10px]">
          <AuthField
            icon={<IconUser />}
            placeholder="Email"
            inputClassName="text-[16px] tracking-[-0.3125px]"
            error={errors.email?.message}
            {...register("email")}
          />
          <AuthField
            icon={<IconLock />}
            placeholder="Password"
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
                <IconEye />
              </button>
            }
            {...register("password")}
          />

          <div className="flex h-[20px] items-center justify-between px-[4px]">
            <label className="flex items-center gap-[8px]">
              <input
                type="checkbox"
                {...register("remember")}
                className="size-[16px] accent-auth-outline"
              />
              <span className="font-source-sans text-[14px] font-medium leading-[20px] tracking-[-0.1504px] text-(--color-auth-subtle-70)">
                Remember me
              </span>
            </label>
            <button
              type="button"
              className="font-source-sans text-[14px] font-medium leading-[20px] tracking-[-0.1504px] text-(--color-auth-subtle-60) underline"
            >
              Forgot password?
            </button>
          </div>

          <AuthPrimaryButton
            icon={<IconArrowIn />}
            label={isSubmitting ? "Signing in..." : "Sign In"}
            borderVariant="gradient"
            type="submit"
          />

          <AuthDivider label="or" />

          <div className="flex justify-center">
            <AuthGhostButton
              label="Create an Account"
              width={187.235}
              onClick={onSwitchMode}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

function SignUpForm({ onSwitchMode }: { onSwitchMode: () => void }) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
      address: "",
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const response = await fetch("/api/customers/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = (await response.json().catch(() => null)) as {
        message?: string;
        fieldErrors?: Partial<Record<keyof SignUpFormData, string[]>>;
      } | null;

      if (!response.ok) {
        if (result?.fieldErrors) {
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            const firstMessage = messages?.[0];
            if (firstMessage) {
              setError(field as keyof SignUpFormData, {
                type: "server",
                message: firstMessage,
              });
            }
          }
        }

        toast.error(
          result?.message ?? "Unable to create your account right now.",
        );
        return;
      }

      reset();
      toast.success(
        result?.message ?? "Account created successfully. You can now sign in.",
      );
    } catch {
      toast.error("Unable to reach the signup service. Please try again.");
    }
  };

  return (
    <div className="px-[32px] py-[20px]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mx-auto flex w-[435px] max-w-full flex-col gap-[20px]"
      >
        <div className="flex flex-col gap-[4px] pr-[64px]">
          <p className="font-source-sans text-[24px] font-extrabold leading-[36px] tracking-[0.5px] text-auth-title">
            Create Account
          </p>
          <p className="font-source-sans text-[14px] font-bold leading-[20px] tracking-[-0.1504px] text-(--color-auth-subtle-70)">
            Fill in your details to get started
          </p>
        </div>

        <div className="flex flex-col gap-[12px]">
          <AuthField
            icon={<IconUser />}
            placeholder="John"
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <AuthField
            icon={<IconUser />}
            placeholder="Doe"
            error={errors.lastName?.message}
            {...register("lastName")}
          />
          <AuthField
            icon={<IconPhone />}
            placeholder="+1 234 567 8900"
            type="tel"
            error={errors.phone?.message}
            {...register("phone")}
          />
          <AuthField
            icon={<IconMail />}
            placeholder="john@example.com"
            type="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <AuthField
            icon={<IconLock />}
            placeholder="Min 6 characters"
            type={showPassword ? "text" : "password"}
            error={errors.password?.message}
            right={
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((x) => !x)}
                className="text-auth-placeholder"
              >
                <IconEye />
              </button>
            }
            {...register("password")}
          />
          <AuthField
            icon={<IconPin />}
            placeholder="123 Main St"
            error={errors.address?.message}
            {...register("address")}
          />

          <AuthPrimaryButton
            icon={<IconUserPlus />}
            label={isSubmitting ? "Signing up..." : "Sign Up"}
            type="submit"
          />

          <AuthDivider label="already have an account?" />

          <div className="flex justify-center">
            <AuthGhostButton
              label="Login"
              width={178.535}
              onClick={onSwitchMode}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default function CustomerAuthPage() {
  const [mode, setMode] = useState<Mode>("signin");

  const cardSize = useMemo(() => {
    if (mode === "signin") {
      return "w-[min(490px,calc(100%-40px))]";
    }
    return "w-[min(490px,calc(100%-40px))]";
  }, [mode]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b1320]">
      <div className="absolute inset-0">
        <Image
          src="/images/home/login-background.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>
      <DesignTopBar />

      <div className="relative z-10 flex min-h-[calc(100vh-92px)] items-center justify-center px-5 py-12">
        <AuthCard className={cardSize}>
          <Suspense
            fallback={
              <div className="flex min-h-[240px] items-center justify-center px-[32px] py-[20px] font-source-sans text-[14px] text-(--color-auth-subtle-70)">
                Loading…
              </div>
            }
          >
            {mode === "signin" ? (
              <SignInForm onSwitchMode={() => setMode("signup")} />
            ) : (
              <SignUpForm onSwitchMode={() => setMode("signin")} />
            )}
          </Suspense>
        </AuthCard>
      </div>
    </main>
  );
}
