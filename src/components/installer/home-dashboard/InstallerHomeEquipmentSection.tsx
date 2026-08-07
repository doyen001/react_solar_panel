"use client";

import type { ReactNode } from "react";
import { useEffect, useId, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Icon from "@/components/ui/Icons";
import { useInstallerConfirm } from "@/components/installer/home-dashboard/InstallerConfirmDialog";
import {
  buildEquipmentWizardPatch,
  mergeEquipmentWithWizardData,
  type EquipmentCardKey,
  type EquipmentRow,
  type InstallerHomeEquipment,
} from "@/lib/installers/design-equipment";
import {
  updateInstallerDesign,
  type InstallerCustomerDesign,
} from "@/lib/installers/designs";

function IconBattery({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <rect x="2" y="7" width="18" height="10" rx="2" ry="2" />
      <path d="M22 11v2" strokeLinecap="round" />
    </svg>
  );
}

function IconCpu({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M9 9h6v6H9zM9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
    </svg>
  );
}

const CARD_CONFIG: {
  key: EquipmentCardKey;
  title: string;
  icon: ReactNode;
}[] = [
  {
    key: "solar",
    title: "Solar System",
    icon: <Icon name="Sun" className="text-warm-ink" />,
  },
  {
    key: "battery",
    title: "Battery System",
    icon: <IconBattery className="text-warm-ink" />,
  },
  {
    key: "equipment",
    title: "Equipment",
    icon: <IconCpu className="text-warm-ink" />,
  },
  {
    key: "site",
    title: "Site Details",
    icon: <Icon name="LocationPin" className="text-warm-ink" />,
  },
];

function EquipmentSpecRow({ label, value }: EquipmentRow) {
  return (
    <div className="flex min-h-[19.875px] min-w-0 items-start justify-between gap-2 font-dm-sans">
      <span className="shrink-0 text-[13.25px] leading-[19.875px] text-warm-gray">
        {label}
      </span>
      <span
        className="min-w-0 truncate text-right text-[13.25px] font-medium leading-[19.875px] text-warm-ink"
        title={value}
      >
        {value}
      </span>
    </div>
  );
}

function EditEquipmentModal({
  open,
  cardTitle,
  rows,
  saving,
  error,
  onClose,
  onSubmit,
}: {
  open: boolean;
  cardTitle: string;
  rows: EquipmentRow[];
  saving: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (rows: EquipmentRow[]) => void;
}) {
  const titleId = useId();
  const [draftRows, setDraftRows] = useState<EquipmentRow[]>(rows);

  useEffect(() => {
    if (!open) return;
    setDraftRows(rows.map((row) => ({ ...row })));
  }, [open, rows]);

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
        className="relative z-[1] flex max-h-[min(90vh,640px)] w-full max-w-[480px] flex-col overflow-hidden rounded-[12px] border border-warm-border bg-white shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]"
      >
        <div className="border-b border-warm-border bg-linear-to-b from-yellow-lemon to-orange-amber px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <h2
              id={titleId}
              className="font-inter text-[14px] font-bold leading-[21px] text-warm-black"
            >
              Edit {cardTitle}
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
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(
              draftRows
                .map((row) => ({
                  label: row.label.trim(),
                  value: row.value.trim(),
                }))
                .filter((row) => row.label.length > 0),
            );
          }}
        >
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {draftRows.map((row, index) => (
              <div
                key={`${row.label}-${index}`}
                className="grid gap-2 rounded-lg border border-warm-border bg-cream-50 p-3 sm:grid-cols-2"
              >
                <label className="block">
                  <span className="mb-1 block font-dm-sans text-[10px] font-semibold uppercase tracking-wide text-warm-gray">
                    Label
                  </span>
                  <input
                    type="text"
                    value={row.label}
                    onChange={(e) => {
                      setDraftRows((current) =>
                        current.map((item, i) =>
                          i === index
                            ? { ...item, label: e.target.value }
                            : item,
                        ),
                      );
                    }}
                    disabled={saving}
                    className="w-full rounded-lg border border-warm-border bg-white px-3 py-2 font-dm-sans text-sm text-warm-ink outline-none focus:border-brand-blue"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block font-dm-sans text-[10px] font-semibold uppercase tracking-wide text-warm-gray">
                    Value
                  </span>
                  <input
                    type="text"
                    value={row.value}
                    onChange={(e) => {
                      setDraftRows((current) =>
                        current.map((item, i) =>
                          i === index
                            ? { ...item, value: e.target.value }
                            : item,
                        ),
                      );
                    }}
                    disabled={saving}
                    className="w-full rounded-lg border border-warm-border bg-white px-3 py-2 font-dm-sans text-sm text-warm-ink outline-none focus:border-brand-blue"
                  />
                </label>
              </div>
            ))}
          </div>

          {error ? (
            <p className="px-4 font-dm-sans text-sm text-red-600">{error}</p>
          ) : null}

          <div className="flex justify-end gap-2 border-t border-warm-border px-4 py-3">
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
              disabled={saving || draftRows.every((row) => !row.label.trim())}
              className="rounded-lg bg-linear-to-b from-yellow-lemon to-orange-amber px-4 py-2 font-dm-sans text-sm font-bold uppercase tracking-wide text-warm-black hover:opacity-95 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

function EquipmentCard({
  title,
  icon,
  rows,
  disabled,
  deleting,
  onEdit,
  onDelete,
}: {
  title: string;
  icon: ReactNode;
  rows: EquipmentRow[];
  disabled?: boolean;
  deleting?: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className="relative min-w-0 overflow-hidden rounded-[11px] border-[1.157px] border-warm-border bg-cream-50 p-[13.24px]"
      data-node-id="3:8717"
    >
      <div className="flex items-center gap-[8.825px] pr-[52px]">
        <span className="flex size-[30.907px] shrink-0 items-center justify-center rounded-[8.833px] bg-linear-to-b from-yellow-lemon to-orange-amber text-warm-ink [&_svg]:size-[15.445px]">
          {icon}
        </span>
        <h4 className="min-w-0 truncate font-inter text-[13.25px] font-bold uppercase leading-[19.875px] tracking-[0.33px] text-warm-ink">
          {title}
        </h4>
      </div>
      <div className="absolute right-[13.24px] top-[8.83px] flex gap-[4.413px]">
        <button
          type="button"
          className="flex size-[22.082px] items-center justify-center rounded-[4.417px] text-warm-gray hover:bg-black/5 disabled:opacity-50"
          aria-label={`Edit ${title}`}
          disabled={disabled || deleting}
          onClick={onEdit}
        >
          <Icon name="Pencil" className="size-[13.24px]" />
        </button>
        <button
          type="button"
          className="flex size-[22.082px] items-center justify-center rounded-[4.417px] text-danger hover:bg-black/5 disabled:opacity-50"
          aria-label={`Delete ${title}`}
          disabled={disabled || deleting}
          onClick={onDelete}
        >
          <Icon name="Trash" className="size-[13.24px]" />
        </button>
      </div>
      <div className="mt-[13px] flex flex-col gap-[4.413px]">
        {rows.map((row) => (
          <EquipmentSpecRow
            key={row.label}
            label={row.label}
            value={row.value}
          />
        ))}
      </div>
    </div>
  );
}

type Props = {
  design: InstallerCustomerDesign | null;
  baseEquipment: InstallerHomeEquipment;
  onDesignUpdated: (design: InstallerCustomerDesign) => void;
};

export function InstallerHomeEquipmentSection({
  design,
  baseEquipment,
  onDesignUpdated,
}: Props) {
  const { equipment, hidden } = useMemo(
    () => mergeEquipmentWithWizardData(baseEquipment, design?.wizardData),
    [baseEquipment, design?.wizardData],
  );

  const visibleCards = useMemo(
    () => CARD_CONFIG.filter((card) => !hidden.has(card.key)),
    [hidden],
  );

  const [editingKey, setEditingKey] = useState<EquipmentCardKey | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingKey, setDeletingKey] = useState<EquipmentCardKey | null>(null);
  const { confirm, confirmDialog } = useInstallerConfirm();

  const editingCard = editingKey
    ? CARD_CONFIG.find((card) => card.key === editingKey)
    : null;

  async function persistWizardData(
    wizardData: Record<string, unknown>,
  ): Promise<void> {
    if (!design?.id) {
      throw new Error("Save a customer design before editing equipment.");
    }
    const updated = await updateInstallerDesign(design.id, { wizardData });
    onDesignUpdated(updated);
  }

  async function handleSaveEdit(rows: EquipmentRow[]) {
    if (!editingKey || !design) return;
    setSaving(true);
    setFormError(null);
    try {
      const wizardData = buildEquipmentWizardPatch(design.wizardData, {
        cardKey: editingKey,
        rows,
      });
      await persistWizardData(wizardData);
      setEditingKey(null);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to save equipment",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(cardKey: EquipmentCardKey, title: string) {
    if (!design?.id) return;
    const confirmed = await confirm({
      title: "Remove equipment",
      description: `Remove "${title}" from this customer?`,
      confirmLabel: "Remove",
      tone: "danger",
    });
    if (!confirmed) return;

    setDeletingKey(cardKey);
    try {
      const wizardData = buildEquipmentWizardPatch(design.wizardData, {
        hideCardKey: cardKey,
      });
      await persistWizardData(wizardData);
    } catch (err) {
      window.alert(
        err instanceof Error ? err.message : "Failed to delete equipment card",
      );
    } finally {
      setDeletingKey(null);
    }
  }

  return (
    <section className="mt-5">
      {visibleCards.length === 0 ? (
        <div className="rounded-[11px] border border-dashed border-warm-border bg-cream-50 px-4 py-6 text-center font-dm-sans text-sm text-warm-gray">
          All equipment cards are hidden for this customer.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {visibleCards.map((card) => (
            <EquipmentCard
              key={card.key}
              title={card.title}
              icon={card.icon}
              rows={equipment[card.key]}
              disabled={!design?.id || saving}
              deleting={deletingKey === card.key}
              onEdit={() => {
                setFormError(null);
                setEditingKey(card.key);
              }}
              onDelete={() => void handleDelete(card.key, card.title)}
            />
          ))}
        </div>
      )}

      <button
        type="button"
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-warm-border bg-cream-50 py-3 font-inter text-sm font-medium text-warm-ink hover:bg-cream-100"
      >
        <span className="text-lg leading-none">+</span>
        Create New Deal / System
      </button>

      <EditEquipmentModal
        open={editingKey != null}
        cardTitle={editingCard?.title ?? "Equipment"}
        rows={editingKey ? equipment[editingKey] : []}
        saving={saving}
        error={formError}
        onClose={() => {
          if (!saving) {
            setEditingKey(null);
            setFormError(null);
          }
        }}
        onSubmit={(rows) => void handleSaveEdit(rows)}
      />

      {confirmDialog}
    </section>
  );
}
