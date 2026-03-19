"use client";

import { forwardRef, useId } from "react";

export type AuthFieldProps = {
  icon: React.ReactNode;
  placeholder: string;
  type?: "text" | "email" | "password" | "tel";
  right?: React.ReactNode;
  inputClassName?: string;
  error?: string;
};

export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(
  function AuthField(
    { icon, placeholder, type = "text", right, inputClassName, error, ...rest },
    ref,
  ) {
    const id = useId();
    const hasError = !!error;

    return (
      <div className="flex flex-col gap-[4px]">
        <label
          htmlFor={id}
          className={`flex h-[44px] w-full items-center gap-[12px] rounded-[14px] bg-auth-input px-[16px] shadow-[0px_0px_0px_0px_rgba(196,148,48,0.2)] transition-shadow ${
            hasError ? "ring-1 ring-red-500/60" : ""
          }`}
        >
          <span className="grid size-[16px] place-items-center text-auth-placeholder">
            {icon}
          </span>
          <input
            id={id}
            ref={ref}
            type={type}
            placeholder={placeholder}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${id}-error` : undefined}
            className={`h-full w-full bg-transparent font-source-sans text-[14px] tracking-[-0.1504px] text-auth-title placeholder:text-auth-placeholder outline-none ${inputClassName ?? ""}`}
            {...rest}
          />
          {right ? (
            <span className="grid size-[16px] place-items-center">{right}</span>
          ) : null}
        </label>
        {hasError && (
          <p
            id={`${id}-error`}
            role="alert"
            className="px-[16px] font-source-sans text-[12px] leading-[16px] text-red-600"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);
