"use client";

import classNames from "classnames";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import {
  IconPanelPlus,
  IconPanelTag,
} from "@/components/installer/dashboard/installerDashboardIcons";
import Icon from "@/components/ui/Icons";
import {
  createInstallerTag,
  deleteInstallerTag,
  type InstallerTag,
} from "@/lib/installers/tags";

type Props = {
  customerId: string | null;
  nodeId?: string;
  tags: InstallerTag[];
  loading: boolean;
  loadError: string | null;
  onTagUpsert: (tag: InstallerTag) => void;
  onTagRemove: (id: string) => void;
};

type TagVariant =
  | "amberStrong"
  | "golden"
  | "amberSoft"
  | "amberLight"
  | "neutral";

const TAG_VARIANTS: TagVariant[] = [
  "amberStrong",
  "golden",
  "amberSoft",
  "amberLight",
  "neutral",
];

const TAG_VARIANT_CLASS: Record<
  TagVariant,
  { shell: string; label: string }
> = {
  amberStrong: {
    shell: "bg-[rgba(245,159,10,0.2)] border-[rgba(245,159,10,0.3)]",
    label: "text-warm-black",
  },
  golden: {
    shell: "bg-[rgba(238,166,43,0.2)] border-[rgba(238,166,43,0.3)]",
    label: "text-warm-black",
  },
  amberSoft: {
    shell: "bg-[rgba(240,199,117,0.3)] border-[rgba(240,199,117,0.5)]",
    label: "text-warm-ink",
  },
  amberLight: {
    shell: "bg-[rgba(245,159,10,0.15)] border-[rgba(245,159,10,0.2)]",
    label: "text-warm-ink",
  },
  neutral: {
    shell: "bg-cream-300 border-warm-border",
    label: "text-brown-muted",
  },
};

function IconTagDismiss({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function TagPill({
  tag,
  variantIndex,
  removing,
  onRemove,
}: {
  tag: InstallerTag;
  variantIndex: number;
  removing: boolean;
  onRemove: () => void;
}) {
  const variant = TAG_VARIANTS[variantIndex % TAG_VARIANTS.length] ?? "amberLight";
  const { shell, label: labelTone } = TAG_VARIANT_CLASS[variant];

  return (
    <div className="inline-flex h-[30.907px] items-stretch">
      <span
        className={classNames(
          "inline-flex items-center rounded-l-full border-b-[1.157px] border-l-[1.157px] border-t-[1.157px] border-solid py-[1.157px] pl-[14.407px] pr-[13.25px] font-dm-sans text-[12.146px] font-semibold leading-[18.219px]",
          shell,
          labelTone,
        )}
        style={{ fontVariationSettings: "'opsz' 14" }}
      >
        {tag.value.charAt(0).toUpperCase() + tag.value.slice(1)}
      </span>
      <button
        type="button"
        onClick={onRemove}
        disabled={removing}
        className={classNames(
          "inline-flex w-[26.494px] shrink-0 items-center justify-center rounded-r-full border-b-[1.157px] border-r-[1.157px] border-t-[1.157px] border-solid py-[1.157px] hover:opacity-80 disabled:opacity-50",
          shell,
          labelTone,
        )}
        aria-label={`Remove ${tag.value}`}
      >
        <IconTagDismiss className="size-[13.238px]" />
      </button>
    </div>
  );
}

function AddTagModal({
  open,
  saving,
  error,
  onClose,
  onSubmit,
}: {
  open: boolean;
  saving: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (value: string) => void;
}) {
  const titleId = useId();
  const [value, setValue] = useState("");

  useEffect(() => {
    if (open) setValue("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !saving) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, open, saving]);

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
          if (!saving) onClose();
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-[1] w-full max-w-[400px] overflow-hidden rounded-[12px] border border-warm-border bg-white shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]"
      >
        <div className="border-b border-warm-border bg-linear-to-b from-yellow-lemon to-orange-amber px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <h2
              id={titleId}
              className="font-inter text-[14px] font-bold leading-[21px] text-warm-black"
            >
              Add tag
            </h2>
            <button
              type="button"
              className="flex size-6 items-center justify-center rounded-full bg-[rgba(28,26,23,0.1)] text-warm-black hover:bg-[rgba(28,26,23,0.18)]"
              onClick={onClose}
              disabled={saving}
              aria-label="Close"
            >
              <Icon name="X" className="size-[14px]" />
            </button>
          </div>
        </div>

        <form
          className="space-y-4 px-4 py-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(value.trim());
          }}
        >
          <label className="block">
            <span className="mb-1.5 block font-dm-sans text-xs font-semibold uppercase tracking-wide text-warm-gray">
              Tag
            </span>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              maxLength={100}
              required
              disabled={saving}
              className="w-full rounded-lg border border-warm-border bg-cream-50 px-3 py-2 font-dm-sans text-sm text-warm-ink outline-none focus:border-brand-blue"
              placeholder="e.g. VIP, Follow Up"
              autoFocus
            />
          </label>

          {error ? (
            <p className="font-dm-sans text-sm text-red-600">{error}</p>
          ) : null}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-warm-border px-4 py-2 font-dm-sans text-sm font-medium text-warm-ink hover:bg-cream-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !value.trim()}
              className="rounded-lg bg-linear-to-b from-yellow-lemon to-orange-amber px-4 py-2 font-dm-sans text-sm font-bold uppercase tracking-wide text-warm-black hover:opacity-95 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

export function InstallerHomeTagsPanel({
  customerId,
  nodeId,
  tags,
  loading,
  loadError,
  onTagUpsert,
  onTagRemove,
}: Props) {
  const selectedCustomerId =
    customerId && !customerId.startsWith("fallback-") ? customerId : null;

  const [modalOpen, setModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const displayError = actionError ?? loadError;

  const handleAdd = async (value: string) => {
    if (!selectedCustomerId || !value) return;

    setSaving(true);
    setFormError(null);
    try {
      const saved = await createInstallerTag({
        customerId: selectedCustomerId,
        value,
      });
      onTagUpsert(saved);
      setModalOpen(false);
      setActionError(null);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Could not add tag");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (tag: InstallerTag) => {
    setRemovingId(tag.id);
    setActionError(null);
    try {
      await deleteInstallerTag(tag.id);
      onTagRemove(tag.id);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Failed to remove tag");
    } finally {
      setRemovingId(null);
    }
  };

  const addDisabled = !selectedCustomerId || loading;

  return (
    <>
      <section
        className="overflow-hidden rounded-[11.042px] border-[1.157px] border-warm-border bg-cream-50"
        data-node-id={nodeId}
      >
        <div className="flex h-[39.733px] items-center justify-between border-l-[2.315px] border-yellow-lemon bg-linear-to-b from-[rgba(245,159,10,0.15)] to-transparent pl-[17.65px] pr-[17.65px]">
          <div className="flex min-w-0 items-center gap-[8.83px]">
            <span className="shrink-0 text-warm-ink [&_svg]:size-[17.651px]">
              <IconPanelTag />
            </span>
            <h3 className="truncate font-inter text-[13.25px] font-bold uppercase leading-[19.875px] tracking-[0.3313px] text-warm-ink">
              Tags
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              setFormError(null);
              setModalOpen(true);
            }}
            disabled={addDisabled}
            className="inline-flex h-[24.288px] min-w-[61.453px] shrink-0 items-center gap-[8px] rounded-[6.625px] bg-linear-to-b from-yellow-lemon to-orange-amber px-[11.03px] font-dm-sans text-[9.938px] font-bold uppercase leading-[14.906px] tracking-[0.3313px] text-warm-black hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            <IconPanelPlus className="size-[13.238px] shrink-0" />
            Add
          </button>
        </div>

        <div className="flex min-h-[105.942px] flex-wrap gap-x-[8.825px] gap-y-[8.825px] px-[17.65px] py-[17.65px]">
          {!selectedCustomerId ? (
            <p className="w-full py-2 text-center font-dm-sans text-[13.25px] text-warm-gray">
              Select a customer to manage tags.
            </p>
          ) : loading ? (
            <p className="w-full py-2 text-center font-dm-sans text-[13.25px] text-warm-gray">
              Loading tags…
            </p>
          ) : displayError ? (
            <p className="w-full py-2 text-center font-dm-sans text-[13.25px] text-red-600">
              {displayError}
            </p>
          ) : tags.length === 0 ? (
            <p className="w-full py-2 text-center font-dm-sans text-[13.25px] text-warm-gray">
              No tags yet
            </p>
          ) : (
            tags.map((tag, index) => (
              <TagPill
                key={tag.id}
                tag={tag}
                variantIndex={index}
                removing={removingId === tag.id}
                onRemove={() => void handleRemove(tag)}
              />
            ))
          )}
        </div>
      </section>

      <AddTagModal
        open={modalOpen}
        saving={saving}
        error={formError}
        onClose={() => {
          if (!saving) {
            setModalOpen(false);
            setFormError(null);
          }
        }}
        onSubmit={(value) => void handleAdd(value)}
      />
    </>
  );
}
