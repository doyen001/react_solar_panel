"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  sendInstallerAppointmentConfirmationEmail,
  sendInstallerWelcomeFollowupEmail,
} from "@/lib/installers/communications";
import {
  fetchInstallerLeads,
  type InstallerLeadSummary,
} from "@/lib/installers/leads";

function formatSentAt(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export function InstallerWelcomeFollowupEmailAction({
  leadId,
  leadName,
  hasEmail,
  variant,
}: {
  leadId: string;
  leadName: string;
  /** When false, lead has no resolved email on record — backend would reject. */
  hasEmail: boolean;
  variant: "inline" | "panel";
}) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sentAt, setSentAt] = useState<string | null>(null);

  async function onSend() {
    if (!hasEmail) {
      toast.error("This lead has no email on file. Update the lead first.");
      return;
    }
    setSending(true);
    try {
      await sendInstallerWelcomeFollowupEmail({
        leadId,
        recipientName: leadName,
        message: message.trim() || undefined,
      });
      const at = new Date().toISOString();
      setSentAt(at);
      toast.success(`Welcome email sent to ${leadName}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Email failed to send");
    } finally {
      setSending(false);
    }
  }

  const disabled = sending || !hasEmail;

  if (variant === "inline") {
    return (
      <div className="flex flex-col items-end gap-1">
        <button
          type="button"
          disabled={disabled}
          title={
            hasEmail
              ? "Send welcome / contact follow-up email"
              : "Add an email to this lead before sending"
          }
          onClick={() => void onSend()}
          className="rounded-md border border-warm-border bg-white px-2.5 py-1.5 font-inter text-xs font-medium text-warm-ink hover:bg-cream-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sending ? "Sending…" : "Email follow-up"}
        </button>
        {sentAt ? (
          <span className="font-inter text-[10px] text-warm-gray">
            Sent {formatSentAt(sentAt)}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-warm-border bg-white p-3 md:col-span-2">
      <p className="font-inter text-xs font-semibold text-warm-ink">
        Email customer (welcome / follow-up)
      </p>
      <p className="mt-1 font-inter text-[11px] text-warm-gray">
        Sends the installer welcome follow-up template to the lead&apos;s email
        on file.
      </p>
      <label className="mt-2 flex flex-col gap-1">
        <span className="font-inter text-[11px] text-warm-gray">
          Optional personal note (included in the email)
        </span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={2}
          maxLength={2000}
          className="rounded-md border border-warm-border px-3 py-2 font-inter text-sm text-warm-ink"
        />
      </label>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => void onSend()}
          className="rounded-lg bg-linear-to-b from-yellow-lemon to-orange-amber px-3 py-1.5 font-inter text-xs font-semibold text-warm-black disabled:opacity-50"
        >
          {sending ? "Sending…" : "Send follow-up email"}
        </button>
        {sentAt ? (
          <span className="font-inter text-[11px] text-warm-gray">
            Last sent {formatSentAt(sentAt)}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function InstallerAppointmentConfirmationEmailAction({
  appointmentId,
  title,
  disabled,
}: {
  appointmentId: string;
  title: string;
  disabled?: boolean;
}) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sentAt, setSentAt] = useState<string | null>(null);

  async function onSend() {
    setSending(true);
    try {
      await sendInstallerAppointmentConfirmationEmail({
        appointmentId,
        message: message.trim() || undefined,
      });
      const at = new Date().toISOString();
      setSentAt(at);
      toast.success(`Confirmation email sent for “${title}”`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Email failed to send");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="rounded-lg border border-warm-border bg-white p-3 md:col-span-2">
      <p className="font-inter text-xs font-semibold text-warm-ink">
        Appointment confirmation email
      </p>
      <p className="mt-1 font-inter text-[11px] text-warm-gray">
        Sends the appointment confirmation template using this booking&apos;s
        times and linked customer email.
      </p>
      <label className="mt-2 flex flex-col gap-1">
        <span className="font-inter text-[11px] text-warm-gray">
          Optional message for the customer
        </span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={2}
          maxLength={2000}
          disabled={Boolean(disabled)}
          className="rounded-md border border-warm-border px-3 py-2 font-inter text-sm text-warm-ink disabled:opacity-60"
        />
      </label>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={disabled || sending}
          onClick={() => void onSend()}
          className="rounded-lg bg-linear-to-b from-yellow-lemon to-orange-amber px-3 py-1.5 font-inter text-xs font-semibold text-warm-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sending ? "Sending…" : "Send confirmation email"}
        </button>
        {sentAt ? (
          <span className="font-inter text-[11px] text-warm-gray">
            Last sent {formatSentAt(sentAt)}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function InstallerPipelineLeadOutreachSection() {
  const [leads, setLeads] = useState<InstallerLeadSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchInstallerLeads({ page: 1, limit: 50 });
        if (!cancelled) {
          setLeads(result.leads);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load leads");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="overflow-hidden rounded-lg border border-warm-border bg-white shadow-sm">
      <div className="yellow-gradient-header">
        <h3 className="font-inter text-[13px] font-bold uppercase tracking-[0.06em] text-brown-muted">
          Lead outreach
        </h3>
      </div>
      <div className="px-4 py-3">
        <p className="font-inter text-xs text-warm-gray">
          Send the welcome / contact follow-up email to assigned leads. Email
          uses the address stored on each lead.
        </p>
        {loading ? (
          <p className="mt-3 font-inter text-sm text-warm-gray">Loading leads…</p>
        ) : error ? (
          <p className="mt-3 font-inter text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : leads.length === 0 ? (
          <p className="mt-3 font-inter text-sm text-warm-gray">No leads yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-warm-border">
            {leads.map((lead) => {
              const email = lead.customerEmail?.trim();
              const hasEmail = Boolean(email);
              return (
                <li
                  key={lead.id}
                  className="flex flex-col gap-2 py-3 first:pt-0 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate font-inter text-sm font-semibold text-warm-ink">
                      {lead.customerName}
                    </p>
                    <p className="font-inter text-xs text-warm-gray">
                      {hasEmail ? email : "No email on file"}
                      {lead.status ? ` · ${lead.status}` : ""}
                    </p>
                  </div>
                  <InstallerWelcomeFollowupEmailAction
                    leadId={lead.id}
                    leadName={lead.customerName}
                    hasEmail={hasEmail}
                    variant="inline"
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
