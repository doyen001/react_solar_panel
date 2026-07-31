export function toDateTimeInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function fromDateTimeInputValue(value: string) {
  return new Date(value).toISOString();
}

export function appointmentCustomerDisplayName(customer: {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
}) {
  const full = `${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim();
  if (full) return full;
  return customer.email?.trim() || "Unnamed customer";
}

export function defaultCreateAppointmentRange(durationMs: number) {
  const start = new Date();
  start.setMinutes(0, 0, 0);
  start.setHours(start.getHours() + 1);
  const end = new Date(start.getTime() + durationMs);
  return { start, end };
}
