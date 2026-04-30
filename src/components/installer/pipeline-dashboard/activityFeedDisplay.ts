import { formatDistanceToNow } from "date-fns";
import type { InstallerActivityActor } from "@/lib/installers/activity";

const EVENT_TYPE_LABEL: Record<string, string> = {
  LEAD_CREATED: "Lead created",
  LEAD_STATUS_CHANGED: "Status",
  LEAD_ASSIGNMENT_CHANGED: "Assignment",
  LEAD_LINKED_TO_CUSTOMER: "Customer link",
  APPOINTMENT_CREATED: "Scheduled",
  APPOINTMENT_UPDATED: "Updated",
  APPOINTMENT_CANCELLED: "Cancelled",
};

export function activityEventTypeLabel(eventType: string) {
  return EVENT_TYPE_LABEL[eventType] ?? eventType.replaceAll("_", " ");
}

export type ActivityTone = "success" | "warning" | "info" | "danger" | "muted";

export function activityEventTypeTone(eventType: string): ActivityTone {
  switch (eventType) {
    case "LEAD_CREATED":
    case "APPOINTMENT_CREATED":
      return "success";
    case "LEAD_STATUS_CHANGED":
    case "LEAD_LINKED_TO_CUSTOMER":
      return "info";
    case "LEAD_ASSIGNMENT_CHANGED":
    case "APPOINTMENT_UPDATED":
      return "warning";
    case "APPOINTMENT_CANCELLED":
      return "danger";
    default:
      return "muted";
  }
}

export function formatActivityCreatedAt(iso: string) {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true });
  } catch {
    return "";
  }
}

export function activityActorName(actor: InstallerActivityActor | null) {
  if (!actor) return "System";
  const n = `${actor.firstName ?? ""} ${actor.lastName ?? ""}`.trim();
  if (n) return n;
  return actor.email ?? "Unknown";
}

export function activityActorInitials(actor: InstallerActivityActor | null) {
  if (!actor) return "•";
  const f = actor.firstName?.trim().charAt(0) ?? "";
  const l = actor.lastName?.trim().charAt(0) ?? "";
  const pair = `${f}${l}`.toUpperCase();
  if (pair.length >= 2) return pair;
  const email = actor.email?.trim();
  if (email && email.length >= 2) return email.slice(0, 2).toUpperCase();
  if (email && email.length === 1) return email.toUpperCase();
  return "?";
}
