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
export const MASTER_DASHBOARD_TITLE = "Distributor Dashboard" as const;

export const MASTER_DASHBOARD_NAV = [
  { id: "overview", label: "Overview", href: "/master/dashboard" },
  { id: "installers", label: "Installers", href: "/master/installers" },
  {
    id: "products",
    label: "Products & Pricing",
    href: "/master/products-pricing",
  },
  { id: "invoices", label: "Invoices", href: "/master/invoices" },
] as const;

/** Master — Installers (Figma 3:13117) */
export const MASTER_INSTALLERS_PAGE = {
  title: "Member Installers",
  subtitle: "20 registered installers hosting Easylink Designer",
} as const;

export type MasterInstallersFilterId =
  | "all"
  | "active"
  | "pending"
  | "suspended";

export const MASTER_INSTALLERS_FILTERS = [
  { id: "all" as const, label: "All", count: 20 },
  { id: "active" as const, label: "Active", count: 15 },
  { id: "pending" as const, label: "Pending", count: 3 },
  { id: "suspended" as const, label: "Suspended", count: 2 },
] as const;

export type MasterInstallerStatus = Exclude<MasterInstallersFilterId, "all">;

export type MasterInstallerLocation = {
  city: string;
  state: "NSW" | "VIC" | "QLD" | "SA" | "WA";
};

export type MasterInstallerEntry = {
  id: string;
  initials: string;
  name: string;
  status: MasterInstallerStatus;
  rating: string;
  location: MasterInstallerLocation;
  customers: number;
  pipeline: string;
  installsMtd: number;
  conversion: string;
  conversionDelta: string;
  revenue: string;
  revenueDelta: string;
  avatarClass:
    | "master-avatar-yellow"
    | "master-avatar-orange"
    | "master-avatar-slate"
    | "master-avatar-warm-border"
    | "master-avatar-amber-funnel"
    | "master-avatar-navy"
    | "master-avatar-orange-2";
};

export const MASTER_INSTALLERS_ROWS: MasterInstallerEntry[] = [
  {
    id: "sm",
    initials: "SM",
    name: "SolarMax Pro",
    status: "active",
    rating: "4.9",
    location: { city: "Sydney", state: "NSW" },
    customers: 98,
    pipeline: "$4.2M",
    installsMtd: 22,
    conversion: "34.2%",
    conversionDelta: "+3.1%",
    revenue: "$4.2M",
    revenueDelta: "+18%",
    avatarClass: "master-avatar-yellow",
  },
  {
    id: "gg",
    initials: "GG",
    name: "GreenGrid Energy",
    status: "active",
    rating: "4.8",
    location: { city: "Melbourne", state: "VIC" },
    customers: 87,
    pipeline: "$3.8M",
    installsMtd: 19,
    conversion: "31.5%",
    conversionDelta: "+2.4%",
    revenue: "$3.8M",
    revenueDelta: "+14%",
    avatarClass: "master-avatar-orange",
  },
  {
    id: "sp",
    initials: "SP",
    name: "SunPeak Solutions",
    status: "active",
    rating: "4.7",
    location: { city: "Brisbane", state: "QLD" },
    customers: 76,
    pipeline: "$3.4M",
    installsMtd: 17,
    conversion: "29.8%",
    conversionDelta: "+1.9%",
    revenue: "$3.4M",
    revenueDelta: "+11%",
    avatarClass: "master-avatar-slate",
  },
  {
    id: "bs",
    initials: "BS",
    name: "BrightStar Solar",
    status: "active",
    rating: "4.6",
    location: { city: "Adelaide", state: "SA" },
    customers: 71,
    pipeline: "$3.1M",
    installsMtd: 15,
    conversion: "28.3%",
    conversionDelta: "-0.5%",
    revenue: "$3.1M",
    revenueDelta: "+9%",
    avatarClass: "master-avatar-warm-border",
  },
  {
    id: "ew",
    initials: "EW",
    name: "EcoWatt Installs",
    status: "active",
    rating: "4.5",
    location: { city: "Perth", state: "WA" },
    customers: 65,
    pipeline: "$2.9M",
    installsMtd: 14,
    conversion: "27.1%",
    conversionDelta: "+2.2%",
    revenue: "$2.9M",
    revenueDelta: "+12%",
    avatarClass: "master-avatar-amber-funnel",
  },
  {
    id: "pe",
    initials: "PE",
    name: "PureEnergy Co",
    status: "active",
    rating: "4.7",
    location: { city: "Gold Coast", state: "QLD" },
    customers: 61,
    pipeline: "$2.7M",
    installsMtd: 13,
    conversion: "26.9%",
    conversionDelta: "+1.6%",
    revenue: "$2.7M",
    revenueDelta: "+8%",
    avatarClass: "master-avatar-navy",
  },
  {
    id: "se",
    initials: "SE",
    name: "SolarEdge AU",
    status: "pending",
    rating: "4.4",
    location: { city: "Canberra", state: "NSW" },
    customers: 58,
    pipeline: "$2.5M",
    installsMtd: 12,
    conversion: "25.8%",
    conversionDelta: "+0.9%",
    revenue: "$2.5M",
    revenueDelta: "+6%",
    avatarClass: "master-avatar-slate",
  },
  {
    id: "ph",
    initials: "PH",
    name: "PowerHouse Solar",
    status: "suspended",
    rating: "4.2",
    location: { city: "Hobart", state: "VIC" },
    customers: 52,
    pipeline: "$2.3M",
    installsMtd: 10,
    conversion: "24.5%",
    conversionDelta: "-1.2%",
    revenue: "$2.3M",
    revenueDelta: "+3%",
    avatarClass: "master-avatar-orange-2",
  },
];

/** Expanded installer row — customer table (Figma 3:14925) */
export type MasterInstallerCustomerStage =
  | "Completed"
  | "Negotiation"
  | "Closed Won"
  | "Site Visit";

export type MasterInstallerCustomer = {
  id: string;
  initials: string;
  name: string;
  email: string;
  phone: string;
  systemSize: string;
  stage: MasterInstallerCustomerStage;
  price: string;
  address: string;
  date: string;
};

export type MasterInstallerDetail = {
  phone: string;
  email: string;
  websiteLabel: string;
  websiteHref: string;
};

export const MASTER_INSTALLER_EXPAND_ACTIONS = {
  viewPortal: "View Full Portal",
  pipelineStats: "Pipeline Stats",
  viewAllCustomers: "View All Customers",
} as const;

export const MASTER_INSTALLER_DETAILS: Record<string, MasterInstallerDetail> = {
  sm: {
    phone: "02 9876 5432",
    email: "admin@solarmax.com.au",
    websiteLabel: "solarmax.com.au",
    websiteHref: "https://solarmax.com.au",
  },
  gg: {
    phone: "03 9123 4500",
    email: "contact@greengridenergy.com.au",
    websiteLabel: "greengridenergy.com.au",
    websiteHref: "https://greengridenergy.com.au",
  },
  sp: {
    phone: "07 3344 8899",
    email: "support@sunpeak.au",
    websiteLabel: "sunpeak.au",
    websiteHref: "https://sunpeak.au",
  },
  bs: {
    phone: "08 8455 1100",
    email: "hello@brightstarsolar.au",
    websiteLabel: "brightstarsolar.au",
    websiteHref: "https://brightstarsolar.au",
  },
  ew: {
    phone: "08 9555 2200",
    email: "office@ecowattinstalls.au",
    websiteLabel: "ecowattinstalls.au",
    websiteHref: "https://ecowattinstalls.au",
  },
  pe: {
    phone: "07 5566 3300",
    email: "team@pureenergy.au",
    websiteLabel: "pureenergy.au",
    websiteHref: "https://pureenergy.au",
  },
  se: {
    phone: "02 6110 7700",
    email: "sales@solaredge.au",
    websiteLabel: "solaredge.au",
    websiteHref: "https://solaredge.au",
  },
  ph: {
    phone: "03 7000 8800",
    email: "accounts@powerhousesolar.au",
    websiteLabel: "powerhousesolar.au",
    websiteHref: "https://powerhousesolar.au",
  },
};

export const MASTER_INSTALLER_CUSTOMERS: Record<
  string,
  MasterInstallerCustomer[]
> = {
  sm: [
    {
      id: "sm-c1",
      initials: "JW",
      name: "James Wilson",
      email: "james.wilson@email.com",
      phone: "0467742723",
      systemSize: "6.6kW",
      stage: "Completed",
      price: "$22,000",
      address: "153 Chatswood Rd",
      date: "2026-01-25",
    },
    {
      id: "sm-c2",
      initials: "ET",
      name: "Emma Thompson",
      email: "emma.thompson@email.com",
      phone: "0479082544",
      systemSize: "8.8kW",
      stage: "Completed",
      price: "$16,800",
      address: "18 Ryde Rd",
      date: "2026-03-04",
    },
    {
      id: "sm-c3",
      initials: "LN",
      name: "Liam Nguyen",
      email: "liam.nguyen@email.com",
      phone: "0464512637",
      systemSize: "8.8kW",
      stage: "Negotiation",
      price: "$14,500",
      address: "116 Chatswood Rd",
      date: "2026-03-23",
    },
    {
      id: "sm-c4",
      initials: "OM",
      name: "Olivia Martinez",
      email: "olivia.martinez@email.com",
      phone: "0454575049",
      systemSize: "20kW",
      stage: "Negotiation",
      price: "$12,400",
      address: "50 Surry Hills Rd",
      date: "2026-01-12",
    },
    {
      id: "sm-c5",
      initials: "NA",
      name: "Noah Anderson",
      email: "noah.anderson@email.com",
      phone: "0433859372",
      systemSize: "8.8kW",
      stage: "Closed Won",
      price: "$19,200",
      address: "22 Manly Rd",
      date: "2026-03-27",
    },
    {
      id: "sm-c6",
      initials: "AR",
      name: "Ava Robinson",
      email: "ava.robinson@email.com",
      phone: "0473704694",
      systemSize: "13.2kW",
      stage: "Closed Won",
      price: "$19,200",
      address: "96 Chatswood Rd",
      date: "2026-01-10",
    },
    {
      id: "sm-c7",
      initials: "ML",
      name: "Mason Lee",
      email: "mason.lee@email.com",
      phone: "0428902566",
      systemSize: "20kW",
      stage: "Closed Won",
      price: "$8,500",
      address: "103 Bondi Rd",
      date: "2026-02-02",
    },
    {
      id: "sm-c8",
      initials: "SW",
      name: "Sophia Walker",
      email: "sophia.walker@email.com",
      phone: "0486354773",
      systemSize: "13.2kW",
      stage: "Negotiation",
      price: "$22,000",
      address: "77 Parramatta Rd",
      date: "2026-03-11",
    },
    {
      id: "sm-c9",
      initials: "EH",
      name: "Ethan Harris",
      email: "ethan.harris@email.com",
      phone: "0412970841",
      systemSize: "6.6kW",
      stage: "Completed",
      price: "$16,800",
      address: "58 Penrith Rd",
      date: "2026-02-24",
    },
    {
      id: "sm-c10",
      initials: "IC",
      name: "Isabella Clark",
      email: "isabella.clark@email.com",
      phone: "0472923016",
      systemSize: "20kW",
      stage: "Site Visit",
      price: "$22,000",
      address: "159 Liverpool Rd",
      date: "2026-01-20",
    },
    {
      id: "sm-c11",
      initials: "LY",
      name: "Lucas Young",
      email: "lucas.young@email.com",
      phone: "0431923544",
      systemSize: "15kW",
      stage: "Completed",
      price: "$14,500",
      address: "135 Surry Hills Rd",
      date: "2026-02-19",
    },
    {
      id: "sm-c12",
      initials: "MK",
      name: "Mia King",
      email: "mia.king@email.com",
      phone: "0466487674",
      systemSize: "10kW",
      stage: "Completed",
      price: "$12,400",
      address: "122 Surry Hills Rd",
      date: "2026-03-04",
    },
  ],
  gg: [
    {
      id: "gg-c1",
      initials: "TC",
      name: "Tom Chen",
      email: "tom.chen@email.com",
      phone: "0411223344",
      systemSize: "10kW",
      stage: "Negotiation",
      price: "$18,200",
      address: "22 Collins St",
      date: "2026-02-11",
    },
    {
      id: "gg-c2",
      initials: "RK",
      name: "Rachel Kim",
      email: "rachel.kim@email.com",
      phone: "0422334455",
      systemSize: "8.8kW",
      stage: "Completed",
      price: "$15,400",
      address: "9 Fitzroy St",
      date: "2026-01-18",
    },
    {
      id: "gg-c3",
      initials: "DP",
      name: "Daniel Park",
      email: "daniel.park@email.com",
      phone: "0433445566",
      systemSize: "13.2kW",
      stage: "Closed Won",
      price: "$21,000",
      address: "41 Richmond Rd",
      date: "2026-03-02",
    },
    {
      id: "gg-c4",
      initials: "SL",
      name: "Sarah Lee",
      email: "sarah.lee@email.com",
      phone: "0444556677",
      systemSize: "6.6kW",
      stage: "Site Visit",
      price: "$12,900",
      address: "5 Bridge Rd",
      date: "2026-03-20",
    },
  ],
  sp: [
    {
      id: "sp-c1",
      initials: "AH",
      name: "Andrew Hughes",
      email: "andrew.h@email.com",
      phone: "0455667788",
      systemSize: "20kW",
      stage: "Negotiation",
      price: "$24,500",
      address: "88 Queen St",
      date: "2026-02-05",
    },
    {
      id: "sp-c2",
      initials: "KW",
      name: "Kate Wong",
      email: "kate.wong@email.com",
      phone: "0466778899",
      systemSize: "10kW",
      stage: "Completed",
      price: "$17,800",
      address: "15 Logan Rd",
      date: "2026-01-29",
    },
    {
      id: "sp-c3",
      initials: "JB",
      name: "Josh Brown",
      email: "josh.brown@email.com",
      phone: "0477889900",
      systemSize: "8.8kW",
      stage: "Closed Won",
      price: "$14,200",
      address: "30 Wickham St",
      date: "2026-03-08",
    },
    {
      id: "sp-c4",
      initials: "NP",
      name: "Nina Patel",
      email: "nina.patel@email.com",
      phone: "0488990011",
      systemSize: "13.2kW",
      stage: "Site Visit",
      price: "$19,600",
      address: "12 Gregory Tce",
      date: "2026-03-25",
    },
  ],
  bs: [
    {
      id: "bs-c1",
      initials: "GW",
      name: "Grace White",
      email: "grace.white@email.com",
      phone: "0499001122",
      systemSize: "8.8kW",
      stage: "Completed",
      price: "$16,400",
      address: "44 King William St",
      date: "2026-02-14",
    },
    {
      id: "bs-c2",
      initials: "HM",
      name: "Harry Mills",
      email: "harry.mills@email.com",
      phone: "0410112233",
      systemSize: "6.6kW",
      stage: "Negotiation",
      price: "$13,800",
      address: "7 Jetty Rd",
      date: "2026-03-12",
    },
    {
      id: "bs-c3",
      initials: "VB",
      name: "Victoria Blake",
      email: "v.blake@email.com",
      phone: "0421223344",
      systemSize: "15kW",
      stage: "Closed Won",
      price: "$20,300",
      address: "18 Unley Rd",
      date: "2026-01-22",
    },
    {
      id: "bs-c4",
      initials: "CF",
      name: "Chris Ford",
      email: "chris.ford@email.com",
      phone: "0432334455",
      systemSize: "20kW",
      stage: "Site Visit",
      price: "$23,100",
      address: "3 Glen Osmond Rd",
      date: "2026-03-18",
    },
  ],
  ew: [
    {
      id: "ew-c1",
      initials: "ZT",
      name: "Zoe Taylor",
      email: "zoe.taylor@email.com",
      phone: "0443445566",
      systemSize: "10kW",
      stage: "Negotiation",
      price: "$17,200",
      address: "200 St Georges Tce",
      date: "2026-02-08",
    },
    {
      id: "ew-c2",
      initials: "PB",
      name: "Peter Barnes",
      email: "peter.barnes@email.com",
      phone: "0454556677",
      systemSize: "8.8kW",
      stage: "Completed",
      price: "$15,900",
      address: "66 Scarborough Beach Rd",
      date: "2026-01-30",
    },
    {
      id: "ew-c3",
      initials: "LW",
      name: "Laura West",
      email: "laura.west@email.com",
      phone: "0465667788",
      systemSize: "13.2kW",
      stage: "Closed Won",
      price: "$18,700",
      address: "14 Hay St",
      date: "2026-03-06",
    },
    {
      id: "ew-c4",
      initials: "DJ",
      name: "David Jones",
      email: "david.jones@email.com",
      phone: "0476778899",
      systemSize: "6.6kW",
      stage: "Site Visit",
      price: "$12,400",
      address: "9 Oxford St",
      date: "2026-03-22",
    },
  ],
  pe: [
    {
      id: "pe-c1",
      initials: "AF",
      name: "Amy Foster",
      email: "amy.foster@email.com",
      phone: "0487889900",
      systemSize: "20kW",
      stage: "Negotiation",
      price: "$22,800",
      address: "55 Cavill Ave",
      date: "2026-02-01",
    },
    {
      id: "pe-c2",
      initials: "RG",
      name: "Ryan Gibson",
      email: "ryan.gibson@email.com",
      phone: "0498990011",
      systemSize: "10kW",
      stage: "Completed",
      price: "$16,600",
      address: "12 Palm Beach Ave",
      date: "2026-01-17",
    },
    {
      id: "pe-c3",
      initials: "HC",
      name: "Hannah Cox",
      email: "hannah.cox@email.com",
      phone: "0419001122",
      systemSize: "8.8kW",
      stage: "Closed Won",
      price: "$14,900",
      address: "8 Kirra Rd",
      date: "2026-03-09",
    },
    {
      id: "pe-c4",
      initials: "MW",
      name: "Marcus Webb",
      email: "marcus.webb@email.com",
      phone: "0420112233",
      systemSize: "13.2kW",
      stage: "Site Visit",
      price: "$19,400",
      address: "27 Broadbeach Blvd",
      date: "2026-03-24",
    },
  ],
  se: [
    {
      id: "se-c1",
      initials: "LB",
      name: "Luke Bennett",
      email: "luke.bennett@email.com",
      phone: "0431223344",
      systemSize: "10kW",
      stage: "Negotiation",
      price: "$17,500",
      address: "5 Constitution Ave",
      date: "2026-02-16",
    },
    {
      id: "se-c2",
      initials: "GD",
      name: "Georgia Dean",
      email: "georgia.dean@email.com",
      phone: "0442334455",
      systemSize: "8.8kW",
      stage: "Site Visit",
      price: "$14,100",
      address: "14 Northbourne Ave",
      date: "2026-03-14",
    },
    {
      id: "se-c3",
      initials: "TK",
      name: "Tim Kelly",
      email: "tim.kelly@email.com",
      phone: "0453445566",
      systemSize: "6.6kW",
      stage: "Completed",
      price: "$13,200",
      address: "22 Civic Pl",
      date: "2026-01-26",
    },
    {
      id: "se-c4",
      initials: "SN",
      name: "Steph Ng",
      email: "steph.ng@email.com",
      phone: "0464556677",
      systemSize: "15kW",
      stage: "Closed Won",
      price: "$20,600",
      address: "40 London Circuit",
      date: "2026-03-03",
    },
  ],
  ph: [
    {
      id: "ph-c1",
      initials: "JR",
      name: "Jack Reed",
      email: "jack.reed@email.com",
      phone: "0475667788",
      systemSize: "8.8kW",
      stage: "Negotiation",
      price: "$15,300",
      address: "11 Sandy Bay Rd",
      date: "2026-02-20",
    },
    {
      id: "ph-c2",
      initials: "MS",
      name: "Mel Scott",
      email: "mel.scott@email.com",
      phone: "0486778899",
      systemSize: "10kW",
      stage: "Site Visit",
      price: "$16,900",
      address: "6 Battery Point",
      date: "2026-03-17",
    },
    {
      id: "ph-c3",
      initials: "BF",
      name: "Ben Fox",
      email: "ben.fox@email.com",
      phone: "0497889900",
      systemSize: "13.2kW",
      stage: "Completed",
      price: "$18,400",
      address: "19 Elizabeth St",
      date: "2026-01-13",
    },
    {
      id: "ph-c4",
      initials: "CO",
      name: "Chloe O'Neil",
      email: "chloe.oneil@email.com",
      phone: "0408990011",
      systemSize: "6.6kW",
      stage: "Closed Won",
      price: "$12,800",
      address: "3 Davey St",
      date: "2026-03-29",
    },
  ],
};

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

/** Master — Invoices (Figma 3:16747) */
export const MASTER_INVOICES_PAGE = {
  title: "Invoices",
  subtitle:
    "Manage customer and internal invoices across all installers",
} as const;

export const MASTER_INVOICES_CREATE_LABEL = "Create Invoice" as const;

export const MASTER_INVOICES_SEARCH_PLACEHOLDER = "Search invoices..." as const;

export const MASTER_INVOICE_STAT_CARDS = [
  {
    id: "total",
    label: "Total Invoices",
    icon: "FileText" as const,
    value: "8",
  },
  {
    id: "pending",
    label: "Pending",
    icon: "Clock" as const,
    value: "$61.6K",
    footnote: "3 invoices",
  },
  {
    id: "paid",
    label: "Paid",
    icon: "CheckCircle" as const,
    value: "$51.1K",
    footnote: "3 invoices",
  },
  {
    id: "overdue",
    label: "Overdue",
    icon: "AlertTriangle" as const,
    value: "$9.6K",
    footnote: "1 invoices",
  },
] as const;

export type MasterInvoiceTypeTabId = "all" | "customer" | "internal";

export const MASTER_INVOICE_TYPE_TABS = [
  { id: "all" as const, label: "All", icon: "FileText" as const },
  { id: "customer" as const, label: "Customer", icon: "User" as const },
  { id: "internal" as const, label: "Internal", icon: "Building2" as const },
] as const;

export type MasterInvoiceRowStatus = "draft" | "sent" | "paid" | "overdue";

export type MasterInvoiceStatusFilterId = "all" | MasterInvoiceRowStatus;

export const MASTER_INVOICE_STATUS_FILTERS = [
  { id: "all" as const, label: "All" },
  { id: "draft" as const, label: "Draft" },
  { id: "sent" as const, label: "Sent" },
  { id: "paid" as const, label: "Paid" },
  { id: "overdue" as const, label: "Overdue" },
] as const;

export type MasterInvoiceKind = "internal" | "customer";

export type MasterInvoiceActionId = "check" | "send" | "eye" | "trash";

export type MasterInvoiceToAvatarTone = "navy" | "warm";

export type MasterInvoiceRow = {
  id: string;
  invoiceNumber: string;
  kind: MasterInvoiceKind;
  fromName: string;
  to: {
    initials: string;
    name: string;
    avatarTone: MasterInvoiceToAvatarTone;
  };
  issueDate: string;
  dueDate: string;
  total: string;
  status: MasterInvoiceRowStatus;
  actions: MasterInvoiceActionId[];
};

export const MASTER_INVOICE_TABLE_COLUMNS = [
  { id: "invoice", label: "Invoice #", align: "left" as const },
  { id: "type", label: "Type", align: "left" as const },
  { id: "from", label: "From", align: "left" as const },
  { id: "to", label: "To", align: "left" as const },
  { id: "date", label: "Date", align: "left" as const },
  { id: "due", label: "Due Date", align: "left" as const },
  { id: "total", label: "Total", align: "right" as const },
  { id: "status", label: "Status", align: "center" as const },
  { id: "actions", label: "Actions", align: "center" as const },
] as const;

export const MASTER_INVOICE_ROWS: MasterInvoiceRow[] = [
  {
    id: "1",
    invoiceNumber: "INV-2026-001",
    kind: "internal",
    fromName: "Easylink HQ",
    to: { initials: "SP", name: "SolarMax Pro", avatarTone: "navy" },
    issueDate: "2026-02-15",
    dueDate: "2026-03-15",
    total: "$17,149",
    status: "sent",
    actions: ["check", "eye", "trash"],
  },
  {
    id: "2",
    invoiceNumber: "INV-2026-002",
    kind: "customer",
    fromName: "SolarMax Pro",
    to: { initials: "ES", name: "Ethan Salvi", avatarTone: "warm" },
    issueDate: "2026-02-10",
    dueDate: "2026-03-10",
    total: "$15,950",
    status: "paid",
    actions: ["eye", "trash"],
  },
  {
    id: "3",
    invoiceNumber: "INV-2026-003",
    kind: "internal",
    fromName: "Easylink HQ",
    to: { initials: "GE", name: "GreenGrid Energy", avatarTone: "navy" },
    issueDate: "2026-01-20",
    dueDate: "2026-02-20",
    total: "$9,636",
    status: "overdue",
    actions: ["check", "eye", "trash"],
  },
  {
    id: "4",
    invoiceNumber: "INV-2026-004",
    kind: "customer",
    fromName: "GreenGrid Energy",
    to: { initials: "MC", name: "Marcus Chen", avatarTone: "warm" },
    issueDate: "2026-02-28",
    dueDate: "2026-03-28",
    total: "$27,610",
    status: "sent",
    actions: ["check", "eye", "trash"],
  },
  {
    id: "5",
    invoiceNumber: "INV-2026-005",
    kind: "internal",
    fromName: "Easylink HQ",
    to: { initials: "SS", name: "SunPeak Solutions", avatarTone: "navy" },
    issueDate: "2026-02-05",
    dueDate: "2026-03-05",
    total: "$8,206",
    status: "paid",
    actions: ["eye", "trash"],
  },
  {
    id: "6",
    invoiceNumber: "INV-2026-006",
    kind: "customer",
    fromName: "BrightStar Solar",
    to: { initials: "SJ", name: "Sarah Johnson", avatarTone: "warm" },
    issueDate: "2026-03-01",
    dueDate: "2026-03-31",
    total: "$22,000",
    status: "draft",
    actions: ["send", "eye", "trash"],
  },
  {
    id: "7",
    invoiceNumber: "INV-2026-007",
    kind: "internal",
    fromName: "Easylink HQ",
    to: { initials: "EI", name: "EcoWatt Installs", avatarTone: "navy" },
    issueDate: "2026-03-01",
    dueDate: "2026-03-31",
    total: "$16,852",
    status: "sent",
    actions: ["check", "eye", "trash"],
  },
  {
    id: "8",
    invoiceNumber: "INV-2026-008",
    kind: "customer",
    fromName: "SolarMax Pro",
    to: { initials: "DP", name: "David Park", avatarTone: "warm" },
    issueDate: "2026-01-15",
    dueDate: "2026-02-15",
    total: "$26,950",
    status: "paid",
    actions: ["eye", "trash"],
  },
];

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

/** Installer Tiers tab — monthly (Figma 3:17265) & yearly (Figma 3:17632) */
export type MasterInstallerTierBilling = "monthly" | "yearly";

export const MASTER_INSTALLER_TIER_BILLING_OPTIONS = [
  { id: "monthly" as const, label: "Monthly" },
  { id: "yearly" as const, label: "Yearly" },
] as const;

export const MASTER_INSTALLER_TIERS_YEARLY_SAVE_LABEL = "Save 20%" as const;

export const MASTER_INSTALLER_TIER_VOLUME_LABELS = [
  "30",
  "60",
  "120",
  "500",
  "2K",
  "5K",
  "10K",
] as const;

export const MASTER_INSTALLER_TIER_STANDARD_CARD = {
  title: "Standard",
  tagline: "Core tools to capture and convert leads",
  planSubtitle: "Standard",
  priceSuffix: "/Month",
} as const;

export const MASTER_INSTALLER_TIER_PRO_CARD = {
  title: "PRO",
  tagline: "Advanced tools to maximize lead quality and business growth.",
  planSubtitle: "Standard PRO",
  priceSuffix: "/Month",
  mostPopularLabel: "Most Popular",
  upgradeLabel: "Upgrade",
} as const;

export const MASTER_INSTALLER_TIER_STANDARD_FEATURES = [
  "120 measurements/month",
  "AI roof measurements and solar potential analysis",
  "Access to built-in CRM",
  "Leads export to CSV",
  "Lead conversion analytics",
  "Unlimited SunnyForms",
  "Unlimited websites integrations",
  "Full SunnyForm customization",
  "AI Datasheet Reader",
  "Multilingual SunnyForms",
  "Real-time appointment bookings",
  "Access to pro tips",
  "Email notifications",
] as const;

export type MasterInstallerTierProFeature = {
  label: string;
  multiline?: boolean;
};

export const MASTER_INSTALLER_TIER_PRO_FEATURES: MasterInstallerTierProFeature[] =
  [
    { label: "500 measurements/month" },
    { label: "Everything in Standard, plus:" },
    { label: "Remove Solarise logo in SunnyForms" },
    { label: "Advanced lead verification" },
    {
      label:
        "Integrations with 3rd-party tools (CRMs, Zapier, project management tools, solar design, automation, marketing platforms, etc.)",
      multiline: true,
    },
    { label: "Email and WhatsApp notifications" },
    { label: "Dedicated support manager" },
  ];

export type MasterInstallerTiersPricing = {
  standardPrice: string;
  proPrice: string;
  standardSliderFillPct: number;
  proSliderFillPct: number;
  standardActiveVolumeLabel: string;
  proActiveVolumeLabel: string;
};

export const MASTER_INSTALLER_TIERS_PRICING: Record<
  MasterInstallerTierBilling,
  MasterInstallerTiersPricing
> = {
  monthly: {
    standardPrice: "$717",
    proPrice: "$1797",
    standardSliderFillPct: 33.333,
    proSliderFillPct: 50,
    standardActiveVolumeLabel: "120",
    proActiveVolumeLabel: "500",
  },
  yearly: {
    standardPrice: "$574",
    proPrice: "$1438",
    standardSliderFillPct: 33.333,
    proSliderFillPct: 50,
    standardActiveVolumeLabel: "120",
    proActiveVolumeLabel: "500",
  },
};

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

export type MasterDashboardInvoiceMetric = {
  id: string;
  label: string;
  countLabel: string;
  amount: string;
  icon: "Clock" | "Dollar" | "Target";
  /** 0–1 portion of track filled (Figma proportions) */
  progress: number;
  progressClass: "master-invoice-pending" | "master-invoice-paid" | "master-invoice-overdue";
};

export const MASTER_DASHBOARD_INVOICE_METRICS: MasterDashboardInvoiceMetric[] = [
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

/** Installer landing — Lead marketplace (Figma Final Designs 3:2206) */
export type InstallerLeadMarketplaceBadgeVariant = "cyan" | "yellow";

export type InstallerLeadMarketplaceCard = {
  id: string;
  badge: string;
  badgeVariant: InstallerLeadMarketplaceBadgeVariant;
  title: string;
  system: string;
  panels: string;
  battery: string;
  inverter: string;
  city: string;
  buildingType: string;
  price: string;
  postcode?: string;
};

export const INSTALLER_LEAD_MARKETPLACE_SECTION = {
  heading: "Lead Marketplace",
  filterByLabel: "Filter by:",
  filters: {
    buildingType: "Building Type",
    systemType: "System Type",
    city: "City",
    postcode: "Lead Postcode",
  },
  filterAllLabel: "All",
  signUpCta: "Sign Up to Buy",
  signUpHref: "/installers/auth",
  apiFallbackNotice:
    "Showing sample leads while we connect to the marketplace.",
} as const;

/** Used when the public leads API is unreachable (offline / misconfigured). */
export const INSTALLER_LEAD_MARKETPLACE_FALLBACK: InstallerLeadMarketplaceCard[] =
  [
    {
      id: "fallback-melbourne",
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
      postcode: "3000",
    },
    {
      id: "fallback-sydney",
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
      postcode: "2000",
    },
    {
      id: "fallback-brisbane",
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
      postcode: "4000",
    },
    {
      id: "fallback-perth",
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
      postcode: "6000",
    },
  ];

/** Installer schedule dashboard */
export const INSTALLER_SCHEDULE_VIEW_MODES = [
  "month",
  "week",
  "day",
  "agenda",
] as const;

export const INSTALLER_SCHEDULE_DEFAULTS = {
  appointmentsPage: 1,
  appointmentsLimit: 100,
  createDurationMs: 60 * 60 * 1000,
  calendarHeightPx: 620,
} as const;

/** Landing footer columns — labels + routes */
export type LandingFooterLink = {
  label: string;
  href: string;
};

export type LandingFooterColumn = {
  title: string;
  items: LandingFooterLink[];
};

export const LANDING_FOOTER_COLUMNS: LandingFooterColumn[] = [
  {
    title: "Products",
    items: [
      { label: "EP2000", href: "#" },
      { label: "AC500", href: "#" },
      { label: "AC300", href: "#" },
      { label: "Solar Panels", href: "#" },
      { label: "Accessories", href: "#" },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "FAQs", href: "#" },
      { label: "Warranty", href: "/warranty" },
      { label: "Contact Us", href: "/contact-us" },
      { label: "User Manual", href: "/user-manual" },
      { label: "Firmware", href: "/firmware" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Projects", href: "#" },
      { label: "Partners", href: "#" },
      { label: "Blog", href: "#" },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
  },
];

/** Shared hero-style CTA block (footer + firmware page) */
export const LANDING_ENERGY_CTA = {
  title: "Ready to Take Control of Your Energy?",
  description:
    "Join thousands of homeowners already saving with EasyLink Solar and BLUETTI products.",
  primary: { label: "Get Your Quote", href: "/designs" },
  secondary: { label: "Contact Sales", href: "/contact-us" },
} as const;

/** Public User Manual page (`/user-manual`) */
export type UserManualBlock =
  | { type: "paragraph"; text: string }
  | { type: "list_intro"; text: string }
  | { type: "bullet_list"; items: readonly string[] };

export const USER_MANUAL_PAGE = {
  title: "User Manual",
  blocks: [
    {
      type: "paragraph",
      text: "All systems are designed to operate automatically under normal conditions.",
    },
    {
      type: "paragraph",
      text: "Basic components include solar panels, inverters, battery packs (if applicable), and monitoring systems.",
    },
    {
      type: "list_intro",
      text: "For safe and efficient use:",
    },
    {
      type: "bullet_list",
      items: [
        "Keep panels clean and free from dust or debris",
        "Avoid any physical damage or obstruction to the system",
        "Do not attempt to repair or modify any components",
      ],
    },
    {
      type: "paragraph",
      text: "Each product comes with its own data sheet and documentation, which will be provided by the company at the time of installation.",
    },
    {
      type: "paragraph",
      text: "For detailed instructions and specifications, please refer to the respective manufacturer's manual or website.",
    },
  ],
} as const;

/** Public Warranty page (`/warranty`) */
export const WARRANTY_PAGE = {
  title: "Warranty",
  paragraphs: [
    "All warranties are provided and covered by the respective manufacturers of the products supplied.",
    "Customers are advised to refer to the manufacturer's warranty terms and conditions for detailed coverage.",
    "For any warranty-related queries or claims, please contact the respective manufacturer directly or reach out to our support team for assistance in connecting with the concerned company.",
  ],
} as const;

/** Public firmware information page (`/firmware`) */
export const FIRMWARE_PAGE = {
  title: "Firmware",
  paragraphs: [
    "We continuously work with our manufacturing partners to ensure that your solar system operates efficiently and reliably.",
    "System updates and improvements are managed by the respective manufacturers and are designed to enhance performance, safety, and overall system efficiency.",
    "Most updates are carried out automatically or during routine maintenance, and do not require any action from the user.",
    "Each product may also have its own data sheet and documentation, which will be provided at the time of installation for your reference.",
    "For any update-related queries or assistance, please contact our support team or refer to the respective manufacturer's website.",
  ],
} as const;
