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

export const DESIGNS_ADDRESS_STEP = {
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
