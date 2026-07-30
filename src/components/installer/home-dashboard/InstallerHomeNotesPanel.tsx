"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { IconPanelPlus } from "@/components/installer/dashboard/installerDashboardIcons";
import Icon from "@/components/ui/Icons";
import {
  createInstallerNote,
  deleteInstallerNote,
  updateInstallerNote,
  type InstallerNote,
} from "@/lib/installers/notes";

type Props = {
  customerId: string | null;
  nodeId?: string;
  notes: InstallerNote[];
  loading: boolean;
  loadError: string | null;
  onNoteUpsert: (note: InstallerNote) => void;
  onNoteRemove: (id: string) => void;
};

type NoteFormState = {
  title: string;
  content: string;
};

function formatNoteDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function NoteFormModal({
  open,
  mode,
  initial,
  saving,
  error,
  onClose,
  onSubmit,
}: {
  open: boolean;
  mode: "create" | "edit";
  initial: NoteFormState;
  saving: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (values: NoteFormState) => void;
}) {
  const titleId = useId();
  const [title, setTitle] = useState(initial.title);
  const [content, setContent] = useState(initial.content);

  useEffect(() => {
    if (!open) return;
    setTitle(initial.title);
    setContent(initial.content);
  }, [initial.content, initial.title, open]);

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

  const heading = mode === "create" ? "Add note" : "Edit note";

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
        className="relative z-[1] w-full max-w-[480px] overflow-hidden rounded-[12px] border border-warm-border bg-white shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]"
      >
        <div className="border-b border-warm-border bg-linear-to-b from-yellow-lemon to-orange-amber px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <h2
              id={titleId}
              className="font-inter text-[14px] font-bold leading-[21px] text-warm-black"
            >
              {heading}
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
            onSubmit({ title: title.trim(), content: content.trim() });
          }}
        >
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
              disabled={saving}
              className="w-full rounded-lg border border-warm-border bg-cream-50 px-3 py-2 font-dm-sans text-sm text-warm-ink outline-none focus:border-brand-blue"
              placeholder="Note title"
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
              disabled={saving}
              rows={6}
              className="w-full resize-y rounded-lg border border-warm-border bg-cream-50 px-3 py-2 font-dm-sans text-sm text-warm-ink outline-none focus:border-brand-blue"
              placeholder="Write your note..."
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
              disabled={saving || !title.trim() || !content.trim()}
              className="rounded-lg bg-linear-to-b from-yellow-lemon to-orange-amber px-4 py-2 font-dm-sans text-sm font-bold uppercase tracking-wide text-warm-black hover:opacity-95 disabled:opacity-60"
            >
              {saving ? "Saving…" : mode === "create" ? "Submit" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

export function InstallerHomeNotesPanel({
  customerId,
  nodeId,
  notes,
  loading,
  loadError,
  onNoteUpsert,
  onNoteRemove,
}: Props) {
  const selectedCustomerId =
    customerId && !customerId.startsWith("fallback-") ? customerId : null;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingNote, setEditingNote] = useState<InstallerNote | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const displayError = actionError ?? loadError;

  const openCreateModal = () => {
    setModalMode("create");
    setEditingNote(null);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (note: InstallerNote) => {
    setModalMode("edit");
    setEditingNote(note);
    setFormError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setEditingNote(null);
    setFormError(null);
  };

  const handleSubmit = async (values: NoteFormState) => {
    if (!selectedCustomerId) return;

    setSaving(true);
    setFormError(null);
    try {
      let saved: InstallerNote;
      if (modalMode === "create") {
        saved = await createInstallerNote({
          customerId: selectedCustomerId,
          title: values.title,
          content: values.content,
        });
      } else if (editingNote) {
        saved = await updateInstallerNote(editingNote.id, {
          title: values.title,
          content: values.content,
        });
      } else {
        return;
      }
      onNoteUpsert(saved);
      setModalOpen(false);
      setEditingNote(null);
      setActionError(null);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Could not save note");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (note: InstallerNote) => {
    if (!window.confirm(`Delete note "${note.title}"?`)) return;

    setDeletingId(note.id);
    setActionError(null);
    try {
      await deleteInstallerNote(note.id);
      onNoteRemove(note.id);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Failed to delete note");
    } finally {
      setDeletingId(null);
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
              <Icon name="MessageSquare" />
            </span>
            <h3 className="truncate font-inter text-[13.25px] font-bold uppercase leading-[19.875px] tracking-[0.3313px] text-warm-ink">
              Notes
            </h3>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            disabled={addDisabled}
            className="inline-flex h-[24.288px] min-w-[61.453px] shrink-0 items-center gap-[8px] rounded-[6.625px] bg-linear-to-b from-yellow-lemon to-orange-amber px-[11.03px] font-dm-sans text-[9.938px] font-bold uppercase leading-[14.906px] tracking-[0.3313px] text-warm-black hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            <IconPanelPlus className="size-[13.238px] shrink-0" />
            Add
          </button>
        </div>

        <div className="min-h-[72.864px] px-[17.65px] py-3">
          {!selectedCustomerId ? (
            <p className="py-4 text-center font-dm-sans text-[13.25px] text-warm-gray">
              Select a customer to view notes.
            </p>
          ) : loading ? (
            <p className="py-4 text-center font-dm-sans text-[13.25px] text-warm-gray">
              Loading notes…
            </p>
          ) : displayError ? (
            <p className="py-4 text-center font-dm-sans text-[13.25px] text-red-600">
              {displayError}
            </p>
          ) : notes.length === 0 ? (
            <p className="py-4 text-center font-dm-sans text-[13.25px] text-warm-gray">
              No notes added yet
            </p>
          ) : (
            <ul className="divide-y divide-warm-border">
              {notes.map((note) => (
                <li
                  key={note.id}
                  className="flex min-w-0 items-start justify-between gap-3 py-3 first:pt-1 last:pb-1"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-inter text-sm font-semibold text-warm-ink">
                      {note.title}
                    </p>
                    <p className="mt-0.5 font-dm-sans text-xs text-warm-gray">
                      Updated {formatNoteDate(note.updatedAt)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(note)}
                      className="inline-flex h-8 items-center gap-1 rounded-md border border-warm-border px-2 font-dm-sans text-xs font-medium text-warm-ink hover:bg-white"
                      aria-label={`Edit ${note.title}`}
                    >
                      <Icon name="Pencil" className="size-3.5" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(note)}
                      disabled={deletingId === note.id}
                      className="inline-flex h-8 items-center gap-1 rounded-md border border-red-200 px-2 font-dm-sans text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                      aria-label={`Delete ${note.title}`}
                    >
                      <Icon name="Trash2" className="size-3.5" />
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <NoteFormModal
        open={modalOpen}
        mode={modalMode}
        initial={{
          title: editingNote?.title ?? "",
          content: editingNote?.content ?? "",
        }}
        saving={saving}
        error={formError}
        onClose={closeModal}
        onSubmit={(values) => void handleSubmit(values)}
      />
    </>
  );
}
