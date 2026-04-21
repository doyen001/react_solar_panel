/** Figma 3:2206 — lead marketplace filter + card row */

export type InstallerLeadCardBadgeVariant = "cyan" | "yellow";

export type InstallerLeadCardData = {
  badge: string;
  badgeVariant: InstallerLeadCardBadgeVariant;
  title: string;
  system: string;
  panels: string;
  battery: string;
  inverter: string;
  city: string;
  buildingType: string;
  price: string;
};

export const INSTALLER_LEAD_MARKETPLACE_CARDS: InstallerLeadCardData[] = [
  {
    badge: "RESIDENTIAL",
    badgeVariant: "cyan",
    title: "Lead from Melbourne",
    system: "6.6kW System",
    panels: "16 Panels",
    battery: "No",
    inverter: "Yes",
    city: "Melbourne",
    buildingType: "Brick House",
    price: "$16,000",
  },
  {
    badge: "RESIDENTIAL",
    badgeVariant: "yellow",
    title: "Lead from Sydney",
    system: "10kW System",
    panels: "24 Panels",
    battery: "Yes",
    inverter: "Yes",
    city: "Sydney",
    buildingType: "Tile Roof",
    price: "$45,000",
  },
  {
    badge: "COMMERCIAL",
    badgeVariant: "cyan",
    title: "Lead from Brisbane",
    system: "30kW System",
    panels: "72 Panels",
    battery: "Yes",
    inverter: "Yes",
    city: "Brisbane",
    buildingType: "Warehouse",
    price: "$52,000",
  },
  {
    badge: "RESIDENTIAL",
    badgeVariant: "cyan",
    title: "Lead from Perth",
    system: "8kW System",
    panels: "20 Panels",
    battery: "No",
    inverter: "Yes",
    city: "Perth",
    buildingType: "New Build",
    price: "$50,000",
  },
];
