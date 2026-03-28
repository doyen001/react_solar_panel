import { dashboardAssets } from "./assets";
import type { DesignOption } from "./types";

export const DASHBOARD_DESIGN_OPTIONS: DesignOption[] = [
  {
    id: "a",
    title: "Design A – Standard",
    badge: "approved",
    kw: "6.6 kW",
    panels: "16 panels",
    price: "$8,500",
    savingsPerYr: "$1,840/yr",
    outputKwh: "9,636 kWh",
    imageSrc: dashboardAssets.designImageA,
  },
  {
    id: "b",
    title: "Design B – Premium",
    badge: "draft",
    kw: "10.0 kW",
    panels: "24 panels",
    price: "$18,200",
    savingsPerYr: "$2,950/yr",
    outputKwh: "14,600 kWh",
    imageSrc: dashboardAssets.designImageB,
  },
  {
    id: "c",
    title: "Design C – Battery Add-on",
    badge: "draft",
    kw: "6.6 kW",
    panels: "16 panels",
    price: "$19,800",
    savingsPerYr: "$2,580/yr",
    outputKwh: "9,636 kWh",
    imageSrc: dashboardAssets.designImageA,
  },
  {
    id: "d",
    title: "Design D – Max Output",
    badge: "draft",
    kw: "13.2 kW",
    panels: "32 panels",
    price: "$28,500",
    savingsPerYr: "$3,740/yr",
    outputKwh: "19,272 kWh",
    imageSrc: dashboardAssets.designImageB,
  },
];

export const DASHBOARD_TIMELINE_TEMPLATE = [
  { id: "t1", title: "Lead Created", dateLabel: "15 Jan 2026" },
  { id: "t2", title: "Site Visit Completed", dateLabel: "22 Jan 2026" },
  { id: "t3", title: "Design Approved", dateLabel: "28 Jan 2026" },
  { id: "t4", title: "Deposit Paid", dateLabel: "5 Feb 2026" },
  { id: "t5", title: "Installation Scheduled", dateLabel: "12 Mar 2026" },
  { id: "t6", title: "System Live", dateLabel: null },
] as const;

/** Default matches Figma: “Installation Scheduled” is current. */
export const DEFAULT_TIMELINE_ACTIVE_INDEX = 4;

export const DASHBOARD_TIMELINE_STEPS = DASHBOARD_TIMELINE_TEMPLATE.map((s) => ({
  ...s,
}));
