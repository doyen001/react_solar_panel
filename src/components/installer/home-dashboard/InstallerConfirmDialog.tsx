"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Icon from "@/components/ui/Icons";

export type InstallerConfirmOptions = {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** "danger" reddens the confirm button and icon for destructive actions (delete/remove). */
  tone?: "danger" | "default";
};

type PendingConfirm = InstallerConfirmOptions & {
  resolve: (confirmed: boolean) => void;
};

/**
 * Promise-based replacement for `window.confirm`, styled to match the rest of
 * the installer dashboard's modals instead of the browser's native dialog.
 *
 * Usage: call the returned `confirm(options)` from an async handler and await
 * it exactly like `window.confirm` — `if (!(await confirm({...}))) return;` —
 * then render `{confirmDialog}` once anywhere in the component's JSX.
 */
export function useInstallerConfirm() {
  const [pending, setPending] = useState<PendingConfirm | null>(null);

  const confirm = useCallback((options: InstallerConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setPending({ ...options, resolve });
    });
  }, []);

  const settle = useCallback(
    (confirmed: boolean) => {
      pending?.resolve(confirmed);
      setPending(null);
    },
    [pending],
  );

  const confirmDialog = pending ? (
    <InstallerConfirmDialog
      {...pending}
      onConfirm={() => settle(true)}
      onCancel={() => settle(false)}
    />
  ) : null;

  return { confirm, confirmDialog };
}

function InstallerConfirmDialog({
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "default",
  onConfirm,
  onCancel,
}: InstallerConfirmOptions & {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const titleId = useId();
  const descriptionId = useId();
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const isDanger = tone === "danger";

  useEffect(() => {
    confirmButtonRef.current?.focus();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onCancel]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center px-4 py-8"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Dismiss dialog"
        className="absolute inset-0 bg-[rgba(47,47,47,0.67)] backdrop-blur-[1px]"
        onClick={onCancel}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative z-[1] w-full max-w-[420px] overflow-hidden rounded-[12px] border border-warm-border bg-white shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]"
      >
        <div className="flex items-start gap-3 px-5 pt-5">
          <span
            aria-hidden="true"
            className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
              isDanger ? "bg-danger/10 text-danger" : "bg-brand-blue/10 text-brand-blue"
            }`}
          >
            <Icon
              name={isDanger ? "AlertTriangle" : "Info"}
              className="size-[18px]"
            />
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <h2
              id={titleId}
              className="font-inter text-[15px] font-bold leading-[22px] text-warm-black"
            >
              {title}
            </h2>
            <p
              id={descriptionId}
              className="mt-1 font-dm-sans text-sm leading-[20px] text-warm-gray"
            >
              {description}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-5 pb-5 pt-5">
          <button
            type="button"
            className="inline-flex h-9 items-center rounded-lg border border-warm-border bg-white px-4 font-dm-sans text-sm font-semibold text-warm-ink hover:bg-cream-50"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            onClick={onConfirm}
            className={`inline-flex h-9 items-center rounded-lg px-4 font-dm-sans text-sm font-semibold text-white hover:opacity-95 ${
              isDanger
                ? "bg-danger"
                : "bg-linear-to-br from-brand-blue to-brand-teal"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
