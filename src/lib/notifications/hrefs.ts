export type NotificationPortal = "installer" | "customer";

export function dashboardNotificationHref(
  portal: NotificationPortal,
  entityType: string,
  entityId: string,
): string | null {
  const t = entityType.toUpperCase();
  if (portal === "installer") {
    if (t === "LEAD") {
      return `/installers/dashboard/home?leadId=${encodeURIComponent(entityId)}`;
    }
    if (t === "APPOINTMENT") {
      return `/installers/dashboard/schedule`;
    }
    return null;
  }
  if (t === "LEAD") {
    return `/customers/dashboard`;
  }
  if (t === "APPOINTMENT") {
    return `/customers/dashboard`;
  }
  return null;
}
