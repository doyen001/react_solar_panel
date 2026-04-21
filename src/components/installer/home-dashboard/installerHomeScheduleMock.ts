/** Demo events for installer project schedule (Figma 31:27399 — March 2026) */

export type InstallerCalEventVariant =
  | "survey"
  | "install"
  | "inspect"
  | "consult";

export type InstallerCalEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  variant: InstallerCalEventVariant;
};

/** End dates are exclusive (react-big-calendar all-day convention). */
export const INSTALLER_SCHEDULE_EVENTS: InstallerCalEvent[] = [
  {
    id: "e1",
    title: "Site Survey – Ethan Salvi",
    start: new Date(2026, 2, 13),
    end: new Date(2026, 2, 14),
    allDay: true,
    variant: "survey",
  },
  {
    id: "e2",
    title: "Installation – Marcus Ch",
    start: new Date(2026, 2, 14),
    end: new Date(2026, 2, 15),
    allDay: true,
    variant: "install",
  },
  {
    id: "e3",
    title: "Inspection – Sarah John",
    start: new Date(2026, 2, 15),
    end: new Date(2026, 2, 16),
    allDay: true,
    variant: "inspect",
  },
  {
    id: "e4",
    title: "Consultation – David Pa",
    start: new Date(2026, 2, 15),
    end: new Date(2026, 2, 16),
    allDay: true,
    variant: "consult",
  },
  {
    id: "e5",
    title: "Consultation – David Pa",
    start: new Date(2026, 2, 16),
    end: new Date(2026, 2, 17),
    allDay: true,
    variant: "consult",
  },
];
