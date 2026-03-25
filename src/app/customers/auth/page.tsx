"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type Mode = "signin" | "signup";
type Lang = "en-uk" | "en-au";

const LANGUAGES: { value: Lang; label: string; flag: string }[] = [
  { value: "en-uk", label: "English", flag: "/images/home/uk-flag.png" },
  { value: "en-au", label: "Australia", flag: "/images/home/au-flag.png" },
];

function TopBar({
  language,
  onLanguageChange,
}: {
  language: Lang;
  onLanguageChange: (lang: Lang) => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const selected = LANGUAGES.find((l) => l.value === language) ?? LANGUAGES[0];

  return (
    <div className="pt-[26px] flex w-[min(1284px,calc(100%-148px))] items-start justify-between mx-auto">
      <Image
        src="/images/home/solar-design-logo.png"
        alt="EasyLink Solar"
        width={66}
        height={66}
        className="opacity-90 cursor-pointer"
        onClick={() => router.push("/")}
      />
      <div className="flex h-[40px] items-center gap-[16px] z-20">
        <button
          type="button"
          aria-label="Help"
          className="grid size-[20px] place-items-center text-gold-2"
        >
          <IconCircleQuestion />
        </button>

        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-haspopup="listbox"
            aria-expanded={open}
            className="flex h-[40px] items-center gap-[4px] rounded-full bg-white pl-[12px] pr-[10px]"
          >
            <Image src={selected.flag} alt="UK" width={18} height={18} />
            <span className="font-source-sans text-[14px] leading-[20px] tracking-[-0.1504px] text-[#4a5565] whitespace-nowrap">
              {selected.label}
            </span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4a5565"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {open && (
            <div
              role="listbox"
              aria-label="Language"
              className="absolute right-0 top-[calc(100%+4px)] z-30 min-w-full overflow-hidden rounded-[12px] bg-white py-[4px] shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
            >
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.value}
                  type="button"
                  role="option"
                  aria-selected={lang.value === language}
                  onClick={() => {
                    onLanguageChange(lang.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-[8px] px-[12px] py-[8px] text-left transition-colors hover:bg-gray-3 ${
                    lang.value === language ? "bg-gray-4" : ""
                  }`}
                >
                  <Image src={lang.flag} alt="UK" width={18} height={18} />
                  <span className="font-source-sans text-[14px] leading-[20px] tracking-[-0.1504px] text-[#4a5565] whitespace-nowrap">
                    {lang.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SignInForm({ onSwitchMode }: { onSwitchMode: () => void }) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  const onSubmit = (data: SignInFormData) => {
    console.log("Sign In:", data);
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
        result?.message ??
          "Account created successfully. You can now sign in.",
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
  const [language, setLanguage] = useState<Lang>("en-uk");

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
      <TopBar language={language} onLanguageChange={setLanguage} />

      <div className="relative z-10 flex min-h-[calc(100vh-92px)] items-center justify-center px-5 py-12">
        <AuthCard className={cardSize}>
          {mode === "signin" ? (
            <SignInForm onSwitchMode={() => setMode("signup")} />
          ) : (
            <SignUpForm onSwitchMode={() => setMode("signin")} />
          )}
        </AuthCard>
      </div>
    </main>
  );
}
