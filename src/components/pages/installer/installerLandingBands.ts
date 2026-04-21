/** Figma 3:1834 — yellow value proposition bands (split around product grid in page). */

export type InstallerLandingBand = {
  id: string;
  imageSide: "left" | "right";
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  bullets: string[];
};

export const INSTALLER_LANDING_BANDS_BEFORE_PRODUCTS: InstallerLandingBand[] = [
  {
    id: "installations",
    imageSide: "left",
    imageSrc: "/images/home/product-solar-panels.png",
    imageAlt: "Solar installation",
    title: "Close more Installations",
    description:
      "Access our marketplace of pre-qualified leads ready to install. Our platform connects you directly with customers who have already designed their system and are ready to proceed with installation.",
    bullets: [
      "Pre-qualified leads with system designs ready",
      "Direct customer communication tools",
      "Streamlined project management",
    ],
  },
  {
    id: "sales",
    imageSide: "right",
    imageSrc: "/images/home/hero-slide-3.png",
    imageAlt: "Business consultation",
    title: "Close more Sales",
    description:
      "Access our marketplace of pre-qualified leads ready to install. Our platform connects you directly with customers who have already designed their system and are ready to proceed with installation.",
    bullets: [
      "Pre-qualified leads with system designs ready",
      "Direct customer communication tools",
      "Streamlined project management",
    ],
  },
];

export const INSTALLER_LANDING_BANDS_AFTER_PRODUCTS: InstallerLandingBand[] = [
  {
    id: "leads",
    imageSide: "left",
    imageSrc: "/images/home/product-ev-chargers.png",
    imageAlt: "EV charging and solar",
    title: "Generate more Leads",
    description:
      "Expand your customer base with our lead generation tools. Get access to homeowners and businesses actively searching for solar solutions in your service area.",
    bullets: [
      "Targeted leads in your service area",
      "Real-time lead notifications",
      "Lead scoring and prioritization",
    ],
  },
  {
    id: "wholesale",
    imageSide: "right",
    imageSrc: "/images/home/hero-slide-2.png",
    imageAlt: "Solar installation aerial view",
    title: "Partner Wholesale Rates",
    description:
      "Access exclusive wholesale pricing on premium solar equipment. As a partner, you'll get competitive rates on panels, inverters, batteries, and accessories from top manufacturers.",
    bullets: [
      "Exclusive partner pricing",
      "Direct manufacturer relationships",
      "Fast shipping across Australia",
    ],
  },
];
