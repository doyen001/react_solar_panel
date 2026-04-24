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

/** Master dashboard (Figma Final Designs 3:11526) */
export const MASTER_DASHBOARD_TITLE = "Master Dashboard" as const;

export const MASTER_DASHBOARD_NAV = [
  { id: "overview", label: "Overview" },
  { id: "installers", label: "Installers" },
  { id: "products", label: "Products & Pricing" },
  { id: "invoices", label: "Invoices" },
] as const;

export type MasterKpiIconName =
  | "Dollar"
  | "Building2"
  | "Users"
  | "Zap"
  | "TrendingUp"
  | "BarChart3";

export type MasterKpiTint = "navy" | "orange";

export type MasterDashboardKpi = {
  id: string;
  label: string;
  value: string;
  delta: string;
  footnote: string;
  icon: MasterKpiIconName;
  tint: MasterKpiTint;
};

export const MASTER_DASHBOARD_KPIS: MasterDashboardKpi[] = [
  {
    id: "pipeline-value",
    label: "Total Pipeline Value",
    value: "$48.2M",
    delta: "+18.6%",
    footnote: "Across 20 installers",
    icon: "Dollar",
    tint: "navy",
  },
  {
    id: "active-installers",
    label: "Active Installers",
    value: "20",
    delta: "+3",
    footnote: "4 joined this quarter",
    icon: "Building2",
    tint: "orange",
  },
  {
    id: "total-customers",
    label: "Total Customers",
    value: "1,247",
    delta: "+142",
    footnote: "Across all portals",
    icon: "Users",
    tint: "navy",
  },
  {
    id: "installs-mtd",
    label: "Total Installs MTD",
    value: "312",
    delta: "+67",
    footnote: "15.6 avg per installer",
    icon: "Zap",
    tint: "orange",
  },
  {
    id: "conversion",
    label: "Avg. Conversion Rate",
    value: "31.4%",
    delta: "+4.1%",
    footnote: "Platform-wide",
    icon: "TrendingUp",
    tint: "navy",
  },
  {
    id: "revenue-month",
    label: "Revenue This Month",
    value: "$4.8M",
    delta: "+22.3%",
    footnote: "vs $3.92M last month",
    icon: "BarChart3",
    tint: "orange",
  },
];

export const MASTER_REVENUE_TREND = {
  title: "Platform Revenue Trend",
  totalLabel: "$31.5M",
  totalHint: "9-month total",
  months: [
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
  ] as const,
  /** Values in millions (USD) for spline chart */
  valuesMillions: [2.2, 2.6, 3.0, 3.5, 4.0, 4.4, 4.9, 5.4, 5.8] as const,
} as const;

export type MasterInvoiceRow = {
  id: string;
  label: string;
  countLabel: string;
  amount: string;
  icon: "Clock" | "Dollar" | "Target";
  /** 0–1 portion of track filled (Figma proportions) */
  progress: number;
  progressClass: "master-invoice-pending" | "master-invoice-paid" | "master-invoice-overdue";
};

export const MASTER_INVOICE_ROWS: MasterInvoiceRow[] = [
  {
    id: "pending",
    label: "Pending Invoices",
    countLabel: "147 invoices",
    amount: "$892K",
    icon: "Clock",
    progress: 0.32,
    progressClass: "master-invoice-pending",
  },
  {
    id: "paid",
    label: "Paid This Month",
    countLabel: "312 invoices",
    amount: "$3.2M",
    icon: "Dollar",
    progress: 0.72,
    progressClass: "master-invoice-paid",
  },
  {
    id: "overdue",
    label: "Overdue",
    countLabel: "23 invoices",
    amount: "$156K",
    icon: "Target",
    progress: 0.08,
    progressClass: "master-invoice-overdue",
  },
];

export type MasterTopInstaller = {
  rank: number;
  name: string;
  revenue: string;
  clientsLabel: string;
  initials: string;
  avatarClass:
    | "master-avatar-yellow"
    | "master-avatar-orange"
    | "master-avatar-slate"
    | "master-avatar-warm-border"
    | "master-avatar-amber-funnel"
    | "master-avatar-navy"
    | "master-avatar-orange-2";
  /** 0–1 relative bar vs #1 */
  volumeRatio: number;
};

export const MASTER_TOP_INSTALLERS: MasterTopInstaller[] = [
  {
    rank: 1,
    name: "SolarMax Pro",
    revenue: "$4.2M",
    clientsLabel: "98 clients",
    initials: "SM",
    avatarClass: "master-avatar-yellow",
    volumeRatio: 1,
  },
  {
    rank: 2,
    name: "GreenGrid Energy",
    revenue: "$3.8M",
    clientsLabel: "87 clients",
    initials: "GG",
    avatarClass: "master-avatar-orange",
    volumeRatio: 0.9,
  },
  {
    rank: 3,
    name: "SunPeak Solutions",
    revenue: "$3.4M",
    clientsLabel: "76 clients",
    initials: "SP",
    avatarClass: "master-avatar-slate",
    volumeRatio: 0.81,
  },
  {
    rank: 4,
    name: "BrightStar Solar",
    revenue: "$3.1M",
    clientsLabel: "71 clients",
    initials: "BS",
    avatarClass: "master-avatar-warm-border",
    volumeRatio: 0.74,
  },
  {
    rank: 5,
    name: "EcoWatt Installs",
    revenue: "$2.9M",
    clientsLabel: "65 clients",
    initials: "EW",
    avatarClass: "master-avatar-amber-funnel",
    volumeRatio: 0.69,
  },
  {
    rank: 6,
    name: "PureEnergy Co",
    revenue: "$2.7M",
    clientsLabel: "61 clients",
    initials: "PE",
    avatarClass: "master-avatar-navy",
    volumeRatio: 0.64,
  },
  {
    rank: 7,
    name: "SolarEdge AU",
    revenue: "$2.5M",
    clientsLabel: "58 clients",
    initials: "SE",
    avatarClass: "master-avatar-slate",
    volumeRatio: 0.6,
  },
  {
    rank: 8,
    name: "PowerHouse Solar",
    revenue: "$2.3M",
    clientsLabel: "52 clients",
    initials: "PH",
    avatarClass: "master-avatar-orange-2",
    volumeRatio: 0.55,
  },
];

export type MasterFunnelStage = {
  id: string;
  label: string;
  value: number;
  barClass:
    | "master-funnel-leads"
    | "master-funnel-site"
    | "master-funnel-proposal"
    | "master-funnel-negotiation"
    | "master-funnel-won";
};

export const MASTER_FUNNEL_STAGES: MasterFunnelStage[] = [
  { id: "leads", label: "Leads", value: 2400, barClass: "master-funnel-leads" },
  {
    id: "site",
    label: "Site Visit",
    value: 1700,
    barClass: "master-funnel-site",
  },
  {
    id: "proposal",
    label: "Proposal",
    value: 1240,
    barClass: "master-funnel-proposal",
  },
  {
    id: "negotiation",
    label: "Negotiation",
    value: 760,
    barClass: "master-funnel-negotiation",
  },
  {
    id: "won",
    label: "Closed Won",
    value: 360,
    barClass: "master-funnel-won",
  },
];

export type MasterRegionSlice = {
  id: string;
  label: string;
  percent: number;
  swatchClass:
    | "master-region-nsw"
    | "master-region-vic"
    | "master-region-qld"
    | "master-region-sa"
    | "master-region-wa";
};

export const MASTER_REGION_SLICES: MasterRegionSlice[] = [
  { id: "nsw", label: "NSW", percent: 35, swatchClass: "master-region-nsw" },
  { id: "vic", label: "VIC", percent: 28, swatchClass: "master-region-vic" },
  { id: "qld", label: "QLD", percent: 20, swatchClass: "master-region-qld" },
  { id: "sa", label: "SA", percent: 10, swatchClass: "master-region-sa" },
  { id: "wa", label: "WA", percent: 7, swatchClass: "master-region-wa" },
];
