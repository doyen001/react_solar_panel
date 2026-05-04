import type { DashboardNotificationItem } from "@/lib/notifications/types";

/** Converts backend WS `notification` frame payload to dashboard list shape. */
export function wsPayloadToDashboardItem(
  payload: unknown,
): DashboardNotificationItem | null {
  if (!payload || typeof payload !== "object") return null;
  const p = payload as Record<string, unknown>;
  if (typeof p.id !== "string" || typeof p.userId !== "string") return null;
  if (typeof p.type !== "string") return null;
  if (typeof p.title !== "string" || typeof p.body !== "string") return null;
  if (typeof p.createdAt !== "string") return null;

  const entityType =
    p.entityType === null || p.entityType === undefined
      ? ""
      : String(p.entityType);
  const entityId =
    p.entityId === null || p.entityId === undefined ? "" : String(p.entityId);

  let readAt: string | null = null;
  if (p.readAt === null || p.readAt === undefined) {
    readAt = null;
  } else if (typeof p.readAt === "string") {
    readAt = p.readAt;
  } else {
    return null;
  }

  return {
    id: p.id,
    userId: p.userId,
    type: p.type,
    title: p.title,
    body: p.body,
    entityType,
    entityId,
    readAt,
    createdAt: p.createdAt,
  };
}
