"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { IconCheckSquare } from "@/components/installer/dashboard/installerDashboardIcons";
import Icon from "@/components/ui/Icons";
import { createInstallerTask, type InstallerTask } from "@/lib/installers/tasks";

type Props = {
  open: boolean;
  onClose: () => void;
  customerId?: string | null;
  onCreated?: (task: InstallerTask) => void;
};

export function InstallerCreateTaskModal({
  open,
  onClose,
  customerId,
  onCreated,
}: Props) {
  const titleId = useId();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedCustomerId =
    customerId && !customerId.startsWith("fallback-") ? customerId : null;

  useEffect(() => {
    if (!open) return;
    setTitle("");
    setContent("");
    setError(null);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, open, submitting]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCustomerId) {
      const message = "Select a customer before saving.";
      setError(message);
      toast.error(message);
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    if (!trimmedTitle || !trimmedContent) return;

    setSubmitting(true);
    setError(null);
    try {
      const saved = await createInstallerTask({
        customerId: selectedCustomerId,
        title: trimmedTitle,
        content: trimmedContent,
      });
      toast.success("Task created successfully.");
      onCreated?.(saved);
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create task";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-[rgba(47,47,47,0.67)] backdrop-blur-[1px]"
        onClick={() => {
          if (!submitting) onClose();
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-[1] w-full max-w-[480px] overflow-hidden rounded-[12px] border border-warm-border bg-white shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]"
      >
        <div className="border-b border-warm-border bg-linear-to-b from-yellow-lemon to-orange-amber px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-warm-black/10 text-warm-black">
                <IconCheckSquare className="size-4" />
              </span>
              <h2
                id={titleId}
                className="font-inter text-[14px] font-bold leading-[21px] text-warm-black"
              >
                Add task
              </h2>
            </div>
            <button
              type="button"
              className="flex size-6 items-center justify-center rounded-full bg-[rgba(28,26,23,0.1)] text-warm-black hover:bg-[rgba(28,26,23,0.18)]"
              onClick={onClose}
              disabled={submitting}
              aria-label="Close"
            >
              <Icon name="X" className="size-[14px]" />
            </button>
          </div>
        </div>

        <form className="space-y-4 px-4 py-4" onSubmit={(e) => void handleSubmit(e)}>
          {error ? (
            <p className="rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 font-dm-sans text-sm text-danger">
              {error}
            </p>
          ) : null}

          <label className="block">
            <span className="mb-1.5 block font-dm-sans text-xs font-semibold uppercase tracking-wide text-warm-gray">
              Title
            </span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              required
              disabled={submitting}
              className="w-full rounded-lg border border-warm-border bg-cream-50 px-3 py-2 font-dm-sans text-sm text-warm-ink outline-none focus:border-brand-blue"
              placeholder="Task title"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block font-dm-sans text-xs font-semibold uppercase tracking-wide text-warm-gray">
              Content
            </span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={8000}
              required
              disabled={submitting}
              rows={6}
              className="w-full resize-y rounded-lg border border-warm-border bg-cream-50 px-3 py-2 font-dm-sans text-sm text-warm-ink outline-none focus:border-brand-blue"
              placeholder="Describe the task..."
            />
          </label>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-warm-border px-4 py-2 font-dm-sans text-sm font-medium text-warm-ink hover:bg-cream-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !title.trim() || !content.trim()}
              className="rounded-lg bg-linear-to-b from-yellow-lemon to-orange-amber px-4 py-2 font-dm-sans text-sm font-bold uppercase tracking-wide text-warm-black hover:opacity-95 disabled:opacity-60"
            >
              {submitting ? "Saving…" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
