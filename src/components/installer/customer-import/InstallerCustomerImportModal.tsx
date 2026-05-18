"use client";

import classNames from "classnames";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";

import Icon from "@/components/ui/Icons";
import {
  importInstallerCustomers,
  type CustomerImportResult,
  type CustomerImportRowInput,
} from "@/lib/installers/customers";
import { parseSpreadsheet } from "@/lib/installers/customer-import/parseSpreadsheet";
import { CUSTOMER_IMPORT_TEMPLATE_PATH } from "@/lib/installers/customer-import/template";
import {
  validateRows,
  type ValidateRowsResult,
} from "@/lib/installers/customer-import/validateRows";

export type CustomerImportSource = "excel" | "sheets" | "file";

export type InstallerCustomerImportModalProps = {
  open: boolean;
  source: CustomerImportSource;
  onClose: () => void;
  onImported?: () => void;
};

type Step = "upload" | "preview" | "summary";

type PreviewRowStatus =
  | "ready"
  | "invalid"
  | "skipped_file"
  | "skipped_db"
  | "failed";

type PreviewRow = {
  rowNumber: number;
  email: string;
  firstName: string;
  lastName: string;
  status: PreviewRowStatus;
  message?: string;
};

const ACCEPT =
  ".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv";

const SOURCE_META: Record<
  CustomerImportSource,
  { title: string; headerClass: string }
> = {
  excel: {
    title: "Import customers from Excel",
    headerClass: "bg-[#217346] text-white",
  },
  sheets: {
    title: "Import customers from Google Sheets",
    headerClass: "bg-[#0f9d58] text-white",
  },
  file: {
    title: "Import customers",
    headerClass: "bg-linear-to-b from-[#2094F3] to-[#17CFCF] text-white",
  },
};

function sourceIntro(source: CustomerImportSource): string | null {
  if (source === "sheets") {
    return "Use our template in Google Sheets, fill one row per customer, then File → Download as .xlsx or .csv and upload here.";
  }
  if (source === "excel") {
    return "Download our Excel template, fill one row per customer, then upload the file below.";
  }
  return "Upload a spreadsheet (.xlsx, .xls, or .csv) with customer details. For best results, start from our template.";
}

function previewStatusLabel(status: PreviewRowStatus): string {
  switch (status) {
    case "ready":
      return "Ready to import";
    case "invalid":
      return "Invalid";
    case "skipped_file":
      return "Duplicate in file";
    case "skipped_db":
      return "Already registered";
    case "failed":
      return "Failed";
    default:
      return status;
  }
}

function previewStatusClasses(status: PreviewRowStatus): string {
  switch (status) {
    case "ready":
      return "bg-emerald-50 text-emerald-800";
    case "invalid":
    case "failed":
      return "bg-red-50 text-red-800";
    case "skipped_file":
    case "skipped_db":
      return "bg-amber-50 text-amber-900";
    default:
      return "bg-cream-200 text-warm-ink";
  }
}

function buildPreviewRows(
  validation: ValidateRowsResult,
  apiPreview: CustomerImportResult | null,
): PreviewRow[] {
  const rows: PreviewRow[] = [];

  for (const row of validation.invalid) {
    rows.push({
      rowNumber: row.rowNumber,
      email: row.email ?? "—",
      firstName: "—",
      lastName: "—",
      status: "invalid",
      message: row.message,
    });
  }

  for (const row of validation.skipped) {
    rows.push({
      rowNumber: row.rowNumber,
      email: row.email,
      firstName: "—",
      lastName: "—",
      status: "skipped_file",
      message: row.message,
    });
  }

  validation.valid.forEach((row, index) => {
    const apiRow = apiPreview?.rows[index];
    let status: PreviewRowStatus = "ready";
    let message: string | undefined;

    if (apiRow?.status === "skipped") {
      status = "skipped_db";
      message = apiRow.message;
    } else if (apiRow?.status === "failed") {
      status = "failed";
      message = apiRow.message;
    }

    rows.push({
      rowNumber: row.rowNumber,
      email: row.data.email,
      firstName: row.data.firstName,
      lastName: row.data.lastName,
      status,
      message,
    });
  });

  rows.sort((a, b) => a.rowNumber - b.rowNumber);
  return rows;
}

function rowsToImport(validation: ValidateRowsResult): CustomerImportRowInput[] {
  return validation.valid.map((row) => row.data);
}

function downloadFailuresCsv(rows: CustomerImportResult["rows"]) {
  const lines = ["row,email,status,message"];
  for (const row of rows) {
    if (row.status === "created") continue;
    const email = (row.email ?? "").replace(/"/g, '""');
    const message = (row.message ?? "").replace(/"/g, '""');
    lines.push(
      `${row.rowNumber},"${email}",${row.status},"${message}"`,
    );
  }
  if (lines.length <= 1) return;

  const blob = new Blob([lines.join("\n")], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "customer-import-failures.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

function SummaryStatCard({
  label,
  value,
  toneClass,
}: {
  label: string;
  value: number;
  toneClass: string;
}) {
  return (
    <div className="rounded-lg border border-warm-border bg-cream-50 px-3 py-2 text-center">
      <p
        className={classNames(
          "font-dm-sans text-[20px] font-bold leading-none",
          toneClass,
        )}
        style={{ fontVariationSettings: "'opsz' 14" }}
      >
        {value}
      </p>
      <p
        className="mt-1 font-dm-sans text-[10px] font-semibold uppercase tracking-wide text-warm-gray"
        style={{ fontVariationSettings: "'opsz' 14" }}
      >
        {label}
      </p>
    </div>
  );
}

export function InstallerCustomerImportModal({
  open,
  source,
  onClose,
  onImported,
}: InstallerCustomerImportModalProps) {
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();

  const [step, setStep] = useState<Step>("upload");
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [importing, setImporting] = useState(false);

  const [validation, setValidation] = useState<ValidateRowsResult | null>(null);
  const [previewRows, setPreviewRows] = useState<PreviewRow[]>([]);
  const [importResult, setImportResult] = useState<CustomerImportResult | null>(
    null,
  );
  const [excludedInvalidCount, setExcludedInvalidCount] = useState(0);

  const resetState = useCallback(() => {
    setStep("upload");
    setFileName(null);
    setFileError(null);
    setDragActive(false);
    setParsing(false);
    setPreviewLoading(false);
    setImporting(false);
    setValidation(null);
    setPreviewRows([]);
    setImportResult(null);
    setExcludedInvalidCount(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [onClose, resetState]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !importing) handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, handleClose, importing]);

  useEffect(() => {
    if (!open) resetState();
  }, [open, source, resetState]);

  const processFile = useCallback(async (file: File) => {
    setFileError(null);
    setParsing(true);
    setFileName(file.name);

    try {
      const parsed = await parseSpreadsheet(file);
      if (parsed.errors.length > 0) {
        setFileError(parsed.errors.map((e) => e.message).join(" "));
        return;
      }

      if (parsed.rows.length === 0) {
        setFileError("No customer rows found. Add data below the header row.");
        return;
      }

      const validated = validateRows(parsed.rows);
      setValidation(validated);

      const toPreview = rowsToImport(validated);
      if (toPreview.length === 0) {
        setPreviewRows(buildPreviewRows(validated, null));
        setStep("preview");
        return;
      }

      setPreviewLoading(true);
      try {
        const apiPreview = await importInstallerCustomers(toPreview, {
          dryRun: true,
        });
        setPreviewRows(buildPreviewRows(validated, apiPreview));
        setStep("preview");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Could not preview import";
        toast.error(message);
        setFileError(message);
      } finally {
        setPreviewLoading(false);
      }
    } catch {
      setFileError("Could not read the file. Try again or use the template.");
    } finally {
      setParsing(false);
    }
  }, []);

  const onFileSelected = useCallback(
    (fileList: FileList | null) => {
      const file = fileList?.[0];
      if (!file) return;
      void processFile(file);
    },
    [processFile],
  );

  const readyCount = previewRows.filter((r) => r.status === "ready").length;
  const busy = parsing || previewLoading;

  const handleConfirmImport = useCallback(async () => {
    if (!validation) return;
    const rows = rowsToImport(validation);
    if (rows.length === 0) {
      toast.error("No valid rows to import.");
      return;
    }

    setImporting(true);
    try {
      const result = await importInstallerCustomers(rows, { dryRun: false });
      setImportResult(result);
      setExcludedInvalidCount(
        validation.invalid.length + validation.skipped.length,
      );
      setStep("summary");
      if (result.created > 0) {
        toast.success(
          `Imported ${result.created} customer${result.created === 1 ? "" : "s"}.`,
        );
        onImported?.();
      } else {
        toast.info("No new customers were created.");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Import failed. Try again.",
      );
    } finally {
      setImporting(false);
    }
  }, [onImported, validation]);

  if (!open || typeof document === "undefined") return null;

  const meta = SOURCE_META[source];
  const intro = sourceIntro(source);
  const hasFailureExport =
    importResult?.rows.some((r) => r.status !== "created") ?? false;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-[rgba(47,47,47,0.67)] backdrop-blur-[1px]"
        onClick={handleClose}
      />
      <ImportDialogPanel
        titleId={titleId}
        title={meta.title}
        headerClass={meta.headerClass}
        onClose={handleClose}
      >
        {step === "upload" ? (
          <div className="flex flex-col gap-4">
            {intro ? (
              <p
                className="font-dm-sans text-[12px] leading-[18px] text-warm-gray"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                {intro}
              </p>
            ) : null}

            <a
              href={CUSTOMER_IMPORT_TEMPLATE_PATH}
              download
              className="inline-flex items-center gap-2 self-start rounded-lg border border-warm-border bg-cream-50 px-3 py-2 font-dm-sans text-[11px] font-semibold text-warm-ink hover:bg-cream-200"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              <Icon name="Download" className="size-4 shrink-0" />
              Download template (.xlsx)
            </a>

            <label
              htmlFor={fileInputId}
              className={classNames(
                "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 transition-colors",
                dragActive
                  ? "border-[#2094F3] bg-cream-100"
                  : "border-warm-border bg-cream-50 hover:bg-cream-100",
                busy && "pointer-events-none opacity-70",
              )}
              onDragEnter={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                setDragActive(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                onFileSelected(e.dataTransfer.files);
              }}
            >
              <Icon name="ArrowUpRight" className="size-6 text-warm-gray" />
              <span
                className="text-center font-dm-sans text-[12px] font-semibold text-warm-ink"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                {busy
                  ? parsing
                    ? "Reading spreadsheet…"
                    : "Checking rows…"
                  : "Drop file here or click to browse"}
              </span>
              <span
                className="font-dm-sans text-[10px] text-warm-gray"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                .xlsx, .xls, or .csv — max 5 MB, 500 rows
              </span>
              {fileName && !busy ? (
                <span
                  className="mt-1 font-dm-sans text-[11px] font-medium text-[#2094F3]"
                  style={{ fontVariationSettings: "'opsz' 14" }}
                >
                  {fileName}
                </span>
              ) : null}
            </label>
            <input
              ref={fileInputRef}
              id={fileInputId}
              type="file"
              accept={ACCEPT}
              className="sr-only"
              disabled={busy}
              onChange={(e) => onFileSelected(e.target.files)}
            />

            {fileError ? (
              <p
                className="rounded-lg bg-red-50 px-3 py-2 font-dm-sans text-[11px] text-red-800"
                role="alert"
              >
                {fileError}
              </p>
            ) : null}
          </div>
        ) : null}

        {step === "preview" ? (
          <div className="flex flex-col gap-3">
            <PreviewHeader
              fileName={fileName}
              rowCount={previewRows.length}
              readyCount={readyCount}
              importing={importing}
              onChooseAnother={() => {
                setStep("upload");
                setFileName(null);
                setValidation(null);
                setPreviewRows([]);
                setFileError(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            />

            <PreviewTable rows={previewRows} />

            <DialogActions>
              <button
                type="button"
                className="h-9 min-w-[80px] rounded-lg border border-warm-border bg-white font-dm-sans text-[11px] font-bold text-warm-gray hover:bg-cream-50"
                style={{ fontVariationSettings: "'opsz' 14" }}
                onClick={handleClose}
                disabled={importing}
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex h-9 min-w-[120px] items-center justify-center gap-2 rounded-lg bg-linear-to-b from-yellow-lemon to-orange-amber px-4 font-dm-sans text-[11px] font-bold text-warm-black hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                style={{ fontVariationSettings: "'opsz' 14" }}
                disabled={importing || readyCount === 0}
                onClick={() => void handleConfirmImport()}
              >
                {importing
                  ? "Importing…"
                  : `Import ${readyCount} customer${readyCount === 1 ? "" : "s"}`}
              </button>
            </DialogActions>
          </div>
        ) : null}

        {step === "summary" && importResult ? (
          <div className="flex flex-col gap-4">
            <p
              className="font-dm-sans text-[13px] font-semibold text-warm-ink"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              Import complete
            </p>
            <div className="grid grid-cols-3 gap-2">
              <SummaryStatCard
                label="Created"
                value={importResult.created}
                toneClass="text-emerald-700"
              />
              <SummaryStatCard
                label="Skipped"
                value={importResult.skipped}
                toneClass="text-amber-800"
              />
              <SummaryStatCard
                label="Failed"
                value={importResult.failed}
                toneClass="text-red-700"
              />
            </div>
            {excludedInvalidCount > 0 ? (
              <p
                className="font-dm-sans text-[11px] text-warm-gray"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                {excludedInvalidCount} row
                {excludedInvalidCount === 1 ? "" : "s"} excluded before import
                due to validation errors or duplicate emails in the file.
              </p>
            ) : null}
            <DialogActions>
              {hasFailureExport ? (
                <button
                  type="button"
                  className="h-9 rounded-lg border border-warm-border bg-white px-3 font-dm-sans text-[11px] font-bold text-warm-gray hover:bg-cream-50"
                  style={{ fontVariationSettings: "'opsz' 14" }}
                  onClick={() => downloadFailuresCsv(importResult.rows)}
                >
                  Download issues (.csv)
                </button>
              ) : null}
              <button
                type="button"
                className="inline-flex h-9 min-w-[80px] items-center justify-center rounded-lg bg-linear-to-b from-yellow-lemon to-orange-amber px-4 font-dm-sans text-[11px] font-bold text-warm-black hover:opacity-95"
                style={{ fontVariationSettings: "'opsz' 14" }}
                onClick={handleClose}
              >
                Done
              </button>
            </DialogActions>
          </div>
        ) : null}

        {step === "upload" ? (
          <DialogActions>
            <button
              type="button"
              className="h-9 min-w-[80px] rounded-lg border border-warm-border bg-white font-dm-sans text-[11px] font-bold text-warm-gray hover:bg-cream-50"
              style={{ fontVariationSettings: "'opsz' 14" }}
              onClick={handleClose}
              disabled={busy}
            >
              Cancel
            </button>
          </DialogActions>
        ) : null}
      </ImportDialogPanel>
    </div>,
    document.body,
  );
}

function ImportDialogPanel({
  titleId,
  title,
  headerClass,
  onClose,
  children,
}: {
  titleId: string;
  title: string;
  headerClass: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="relative z-[1] flex max-h-[min(90vh,640px)] w-full max-w-[560px] flex-col overflow-hidden rounded-[12px] border border-warm-border bg-white shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]"
    >
      <div className={classNames("relative px-4 py-3", headerClass)}>
        <h2
          id={titleId}
          className="pr-8 font-inter text-[14px] font-bold leading-[21px]"
        >
          {title}
        </h2>
        <button
          type="button"
          className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.35)]"
          onClick={onClose}
          aria-label="Close"
        >
          <svg
            className="size-[14px]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 pb-5 pt-4">
        {children}
      </div>
    </div>
  );
}

function DialogActions({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-auto flex flex-wrap justify-end gap-2 border-t border-warm-border/60 pt-3">
      {children}
    </div>
  );
}

function PreviewTable({ rows }: { rows: PreviewRow[] }) {
  return (
    <div className="max-h-[min(40vh,320px)] overflow-auto rounded-lg border border-warm-border">
      <table className="w-full min-w-[480px] border-collapse text-left font-dm-sans text-[11px]">
        <thead className="sticky top-0 bg-cream-100">
          <tr>
            <th className="px-2 py-2 font-semibold text-warm-gray">Row</th>
            <th className="px-2 py-2 font-semibold text-warm-gray">Email</th>
            <th className="px-2 py-2 font-semibold text-warm-gray">Name</th>
            <th className="px-2 py-2 font-semibold text-warm-gray">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={`${row.rowNumber}-${row.email}-${row.status}`}
              className="border-t border-warm-border/60"
            >
              <td className="px-2 py-1.5 text-warm-gray">{row.rowNumber}</td>
              <td className="max-w-[140px] truncate px-2 py-1.5 text-warm-ink">
                {row.email}
              </td>
              <td className="max-w-[120px] truncate px-2 py-1.5 text-warm-ink">
                {row.firstName !== "—"
                  ? `${row.firstName} ${row.lastName}`
                  : "—"}
              </td>
              <td className="px-2 py-1.5">
                <span
                  className={classNames(
                    "inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold",
                    previewStatusClasses(row.status),
                  )}
                >
                  {previewStatusLabel(row.status)}
                </span>
                {row.message ? (
                  <p className="mt-0.5 text-[10px] leading-snug text-warm-gray">
                    {row.message}
                  </p>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PreviewHeader({
  fileName,
  rowCount,
  readyCount,
  importing,
  onChooseAnother,
}: {
  fileName: string | null;
  rowCount: number;
  readyCount: number;
  importing: boolean;
  onChooseAnother: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p
        className="font-dm-sans text-[12px] text-warm-gray"
        style={{ fontVariationSettings: "'opsz' 14" }}
      >
        {fileName ? (
          <>
            <span className="font-semibold text-warm-ink">{fileName}</span>
            {" · "}
          </>
        ) : null}
        {rowCount} row{rowCount === 1 ? "" : "s"}
        {readyCount > 0 ? (
          <>
            {" · "}
            <span className="font-semibold text-emerald-700">
              {readyCount} ready
            </span>
          </>
        ) : null}
      </p>
      <button
        type="button"
        className="font-dm-sans text-[11px] font-semibold text-[#2094F3] hover:underline"
        style={{ fontVariationSettings: "'opsz' 14" }}
        disabled={importing}
        onClick={onChooseAnother}
      >
        Choose another file
      </button>
    </div>
  );
}
