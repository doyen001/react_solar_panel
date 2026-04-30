import { fetchWithInstallerSession } from "@/lib/installers/installer-fetch-client";

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

export type InstallerEmailSendResult = {
  sent: boolean;
  templateKey: "WELCOME_FOLLOWUP" | "APPOINTMENT_CONFIRMATION";
  toEmail: string;
  provider?: { providerName?: string; providerRef?: string };
  context?: {
    leadId?: string;
    customerId?: string;
    appointmentId?: string;
  };
};

export type WelcomeFollowupEmailInput = {
  leadId?: string;
  customerId?: string;
  toEmail?: string;
  recipientName?: string;
  message?: string;
};

export type AppointmentConfirmationEmailInput = {
  appointmentId: string;
  toEmail?: string;
  recipientName?: string;
  message?: string;
};

async function parseInstallerJson<T>(res: Response): Promise<{
  ok: boolean;
  data?: T;
  message?: string;
}> {
  const json = (await res.json()) as ApiEnvelope<T>;
  return { ok: res.ok, data: json.data, message: json.message };
}

export async function sendInstallerWelcomeFollowupEmail(
  body: WelcomeFollowupEmailInput,
): Promise<InstallerEmailSendResult> {
  const res = await fetchWithInstallerSession(
    "/api/installers/communications/email/welcome-followup",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  const { ok, data, message } =
    await parseInstallerJson<InstallerEmailSendResult>(res);
  if (!ok || !data) {
    throw new Error(message || "Failed to send welcome follow-up email");
  }
  return data;
}

export async function sendInstallerAppointmentConfirmationEmail(
  body: AppointmentConfirmationEmailInput,
): Promise<InstallerEmailSendResult> {
  const res = await fetchWithInstallerSession(
    "/api/installers/communications/email/appointment-confirmation",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  const { ok, data, message } =
    await parseInstallerJson<InstallerEmailSendResult>(res);
  if (!ok || !data) {
    throw new Error(message || "Failed to send appointment confirmation email");
  }
  return data;
}
