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
  { id: "overview", label: "Overview", href: "/master/dashboard" },
  { id: "installers", label: "Installers", href: "/master/dashboard" },
  {
    id: "products",
    label: "Products & Pricing",
    href: "/master/products-pricing",
  },
  { id: "invoices", label: "Invoices", href: "/master/dashboard" },
] as const;

/** Products & Pricing (Figma 3:14281) */
export const MASTER_PRODUCTS_PRICING_PAGE = {
  title: "Products & Pricing",
  subtitle:
    "Manage wholesale prices, special deals, and installer tiers",
} as const;

export const MASTER_PRODUCTS_L1_TABS = [
  { id: "catalog", label: "Product Catalog", icon: "Package" as const },
  { id: "special", label: "Special Pricing", icon: "Dollar" as const },
  { id: "tiers", label: "Installer Tiers", icon: "Users" as const },
] as const;

export type MasterProductCategoryId =
  | "all"
  | "panels"
  | "inverters"
  | "batteries"
  | "racking"
  | "equipment";

export const MASTER_PRODUCT_CATEGORIES: {
  id: MasterProductCategoryId;
  label: string;
}[] = [
  { id: "all", label: "All" },
  { id: "panels", label: "Panels" },
  { id: "inverters", label: "Inverters" },
  { id: "batteries", label: "Batteries" },
  { id: "racking", label: "Racking" },
  { id: "equipment", label: "Equipment" },
];

export type MasterProductRowIcon =
  | "Sun"
  | "Cpu"
  | "Battery"
  | "Wrench"
  | "Package";

export type MasterProductCatalogRow = {
  id: string;
  category: Exclude<MasterProductCategoryId, "all">;
  name: string;
  subtitle: string;
  sku: string;
  brand: string;
  retail: string;
  wholesale: string;
  margin: string;
  rowIcon: MasterProductRowIcon;
};

export const MASTER_PRODUCT_CATALOG_ROWS: MasterProductCatalogRow[] = [
  {
    id: "p1",
    category: "panels",
    name: "LONGi Hi-MO 6 450W",
    subtitle: "Panels · per panel",
    sku: "LG-HM6-450",
    brand: "LONGi",
    retail: "$285",
    wholesale: "$195",
    margin: "31.6%",
    rowIcon: "Sun",
  },
  {
    id: "p2",
    category: "panels",
    name: "Jinko Tiger Neo 440W",
    subtitle: "Panels · per panel",
    sku: "JK-TN-440",
    brand: "Jinko",
    retail: "$265",
    wholesale: "$180",
    margin: "32.1%",
    rowIcon: "Sun",
  },
  {
    id: "p3",
    category: "panels",
    name: "Canadian Solar 455W",
    subtitle: "Panels · per panel",
    sku: "CS-455-HiDM",
    brand: "Canadian Solar",
    retail: "$275",
    wholesale: "$188",
    margin: "31.6%",
    rowIcon: "Sun",
  },
  {
    id: "p4",
    category: "panels",
    name: "Trina Vertex S+ 445W",
    subtitle: "Panels · per panel",
    sku: "TR-VS445",
    brand: "Trina",
    retail: "$270",
    wholesale: "$185",
    margin: "31.5%",
    rowIcon: "Sun",
  },
  {
    id: "i1",
    category: "inverters",
    name: "Fronius Primo GEN24 5kW",
    subtitle: "Inverters · per unit",
    sku: "FR-P24-5",
    brand: "Fronius",
    retail: "$2,450",
    wholesale: "$1,890",
    margin: "22.9%",
    rowIcon: "Cpu",
  },
  {
    id: "i2",
    category: "inverters",
    name: "SolarEdge SE5000H",
    subtitle: "Inverters · per unit",
    sku: "SE-5000H",
    brand: "SolarEdge",
    retail: "$2,200",
    wholesale: "$1,680",
    margin: "23.6%",
    rowIcon: "Cpu",
  },
  {
    id: "i3",
    category: "inverters",
    name: "Enphase IQ8+ Micro",
    subtitle: "Inverters · per unit",
    sku: "EN-IQ8P",
    brand: "Enphase",
    retail: "$265",
    wholesale: "$198",
    margin: "25.3%",
    rowIcon: "Cpu",
  },
  {
    id: "i4",
    category: "inverters",
    name: "Sungrow SG5.0RS",
    subtitle: "Inverters · per unit",
    sku: "SG-5RS",
    brand: "Sungrow",
    retail: "$1,350",
    wholesale: "$980",
    margin: "27.4%",
    rowIcon: "Cpu",
  },
  {
    id: "b1",
    category: "batteries",
    name: "Tesla Powerwall 3",
    subtitle: "Batteries · per unit",
    sku: "TP-PW3",
    brand: "Tesla",
    retail: "$12,500",
    wholesale: "$9,800",
    margin: "21.6%",
    rowIcon: "Battery",
  },
  {
    id: "b2",
    category: "batteries",
    name: "BYD HVS 10.2kWh",
    subtitle: "Batteries · per unit",
    sku: "BYD-HVS102",
    brand: "BYD",
    retail: "$8,900",
    wholesale: "$6,800",
    margin: "23.6%",
    rowIcon: "Battery",
  },
  {
    id: "b3",
    category: "batteries",
    name: "Enphase IQ Battery 10T",
    subtitle: "Batteries · per unit",
    sku: "EN-IQB10T",
    brand: "Enphase",
    retail: "$9,200",
    wholesale: "$7,100",
    margin: "22.8%",
    rowIcon: "Battery",
  },
  {
    id: "r1",
    category: "racking",
    name: "K2 D-Dome Flat Roof",
    subtitle: "Racking · per set",
    sku: "K2-DDOME",
    brand: "K2 Systems",
    retail: "$85",
    wholesale: "$58",
    margin: "31.8%",
    rowIcon: "Wrench",
  },
  {
    id: "r2",
    category: "racking",
    name: "Clenergy TinRoof Kit",
    subtitle: "Racking · per set",
    sku: "CL-TRK",
    brand: "Clenergy",
    retail: "$45",
    wholesale: "$32",
    margin: "28.9%",
    rowIcon: "Wrench",
  },
  {
    id: "e1",
    category: "equipment",
    name: "DC Isolator 1000V",
    subtitle: "Equipment · per unit",
    sku: "DCI-1000V",
    brand: "Generic",
    retail: "$42",
    wholesale: "$28",
    margin: "33.3%",
    rowIcon: "Package",
  },
  {
    id: "e2",
    category: "equipment",
    name: "MC4 Connector Pair",
    subtitle: "Equipment · per pair",
    sku: "MC4-PAIR",
    brand: "Generic",
    retail: "$8",
    wholesale: "$4.5",
    margin: "43.8%",
    rowIcon: "Package",
  },
];

export const MASTER_PRODUCT_TABLE_COLUMNS = [
  { id: "product", label: "Product", align: "left" as const },
  { id: "sku", label: "SKU", align: "left" as const },
  { id: "brand", label: "Brand", align: "left" as const },
  { id: "retail", label: "Retail Price", align: "right" as const },
  { id: "wholesale", label: "Wholesale Price", align: "right" as const },
  { id: "margin", label: "Margin", align: "right" as const },
  { id: "actions", label: "Actions", align: "right" as const },
] as const;

export const MASTER_PRODUCT_SEARCH_PLACEHOLDER = "Search products..." as const;
export const MASTER_PRODUCT_ADD_LABEL = "Add Product" as const;

/** Special Pricing tab (Figma 3:16372) */
export const MASTER_SPECIAL_PRICING_INTRO =
  "Set custom wholesale prices for specific installers. These override the default wholesale price." as const;

export const MASTER_SPECIAL_PRICING_ADD_LABEL = "Add Special Price" as const;

export const MASTER_SPECIAL_PRICING_TABLE_COLUMNS = [
  { id: "installer", label: "Installer", align: "left" as const },
  { id: "product", label: "Product", align: "left" as const },
  { id: "wholesale", label: "Wholesale Price", align: "right" as const },
  { id: "special", label: "Special Price", align: "right" as const },
  { id: "discount", label: "Discount", align: "right" as const },
  { id: "validUntil", label: "Valid Until", align: "left" as const },
  { id: "actions", label: "Actions", align: "center" as const },
] as const;

export type MasterSpecialPricingRow = {
  id: string;
  installerName: string;
  installerInitials: string;
  productName: string;
  wholesale: string;
  specialPrice: string;
  discount: string;
  validUntil: string;
};

export const MASTER_SPECIAL_PRICING_ROWS: MasterSpecialPricingRow[] = [
  {
    id: "sp1",
    installerName: "SolarMax Pro",
    installerInitials: "SP",
    productName: "LONGi Hi-MO 6 450W",
    wholesale: "$195",
    specialPrice: "$175",
    discount: "-10.3%",
    validUntil: "2026-06-30",
  },
  {
    id: "sp2",
    installerName: "SolarMax Pro",
    installerInitials: "SP",
    productName: "Tesla Powerwall 3",
    wholesale: "$9,800",
    specialPrice: "$9,200",
    discount: "-6.1%",
    validUntil: "2026-06-30",
  },
  {
    id: "sp3",
    installerName: "GreenGrid Energy",
    installerInitials: "GE",
    productName: "Fronius Primo GEN24 5kW",
    wholesale: "$1,890",
    specialPrice: "$1,750",
    discount: "-7.4%",
    validUntil: "2026-05-15",
  },
  {
    id: "sp4",
    installerName: "SunPeak Solutions",
    installerInitials: "SS",
    productName: "Jinko Tiger Neo 440W",
    wholesale: "$180",
    specialPrice: "$165",
    discount: "-8.3%",
    validUntil: "2026-04-30",
  },
];

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
