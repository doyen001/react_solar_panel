export type DesignsPropertyType = {
  id: "residential" | "commercial" | "apartments";
  label: string;
  imageSrc: string;
  imageAlt: string;
};

export const DESIGNS_PROPERTY_TYPES: DesignsPropertyType[] = [
  {
    id: "residential",
    label: "Residential",
    imageSrc: "/images/home/solar-panel-design.png",
    imageAlt: "Residential solar panels on a house roof",
  },
  {
    id: "commercial",
    label: "Commercial",
    imageSrc: "/images/home/solar-panel-design-2.png",
    imageAlt: "Commercial building rooftop with solar panels",
  },
  {
    id: "apartments",
    label: "Apartments",
    imageSrc: "/images/home/solar-panel-design-3.png",
    imageAlt: "Apartment rooftop solar installation",
  },
];

export type DesignsAddressField = {
  id: "name" | "email";
  label: string;
  type: "text" | "email";
};

export type DesignsMapLocation = {
  lat: number;
  lng: number;
};

export const DESIGNS_REGISTER_STEP = {
  title: "Let's Design your Solar and battery system",
  summaryLines: [
    "This helps us to send your design",
    "and quote free of cost.",
  ],
  description:
    "This allows to us to start our first step towards a complete peace of mind and dedicated service towards our customers.",
  fields: [
    { id: "name", label: "Name", type: "text" },
    { id: "email", label: "Email", type: "email" },
  ] satisfies DesignsAddressField[],
  defaultValues: {
    name: "Charli Abdo",
    email: "charl23772@gmail.com",
    phone: "61451503035",
  },
  phoneLabel: "Phone number",
  phoneCountry: "au",
  phonePlaceholder: "0451 503 035",
} as const;

export const DESIGNS_LOCATION_STEP = {
  title: "Lets Design your System, enter your address",
  inputLabel: "Enter your address",
  inputPlaceholder: "e.g. 42 Bondi Rd, Bondi, NSW 2026",
  defaultZoom: 20,
  defaultCenter: { lat: -33.8688, lng: 151.2093 },
  mapType: "satellite" as const,
} as const;

export type DesignsSolarPanelMetric = {
  id: "total-roof-area" | "usable-roof-area" | "panels-fit";
  label: string;
  actionLabel: string;
};

/**
 * Map overlays: only draw panels/outlines near the user’s pin so a large
 * Solar “building” footprint does not flood the whole viewport.
 */
export const DESIGNS_SOLAR_PANEL_MAP = {
  /** Haversine distance from selected pin → panel center (meters). */
  maxPanelDistanceFromPinMeters: 65,
} as const;

export const DESIGNS_SOLAR_PANEL_STEP = {
  title: "Our AI has found your roof",
  descriptionLines: [
    "You can change the roof area. Select the",
    "roof and edit the roof. Add new roof and edit to",
    "allow a perfect selection.",
  ],
  metrics: [
    {
      id: "total-roof-area",
      label: "Total Roof Area",
      actionLabel: "Edit",
    },
    {
      id: "usable-roof-area",
      label: "Usable Roof Area",
      actionLabel: "Edit",
    },
    {
      id: "panels-fit",
      label: "Panels that can fit on your roof",
      actionLabel: "Edit",
    },
  ] satisfies DesignsSolarPanelMetric[],
  mapActions: {
    primary: "Edit",
    secondary: "ADD New Roof",
  },
} as const;
