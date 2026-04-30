/** Mock data for Pipeline Dashboard (Figma 3:10267) */

import { IconType } from "@/components/ui/Icons";

export type MonthlyMetricMode = "revenue" | "profit" | "installs";

export const TITLE = {
  headline: "Pipeline Dashboard",
  subtitle: "Real-time overview of your solar CRM performance",
} as const;

export const OVERVIEW_KPIS = [
  { label: "Active Deals", value: "47" },
  { label: "Installers", value: "12" },
  { label: "Win Rate", value: "68%" },
  { label: "Avg. Cycle", value: "23 days" },
];

/** Copy + order match Figma `3:10389` stat strip */
export const STAT_STRIP = [
  { label: "STAFF AT HAND", value: "222" },
  { label: "STCs Claimed", value: "342" },
  { label: "Avg System Size", value: "8.4 kW" },
  { label: "Active Installs", value: "18" },
  { label: "avg BATTERY size", value: "23" },
  { label: "Close Rate", value: "28.6%" },
];

export type PrimaryKpi = {
  title: string;
  subtitle: string;
  value: string;
  delta: string;
  deltaLabel: string;
  sparkColor: string;
  sparkline: number[];
  icon?: IconType;
};

export const PRIMARY_KPIS: PrimaryKpi[] = [
  {
    title: "Total Pipeline Value",
    subtitle: "Weighted by probability",
    value: "$2,487,000",
    delta: "+12.4%",
    deltaLabel: "vs last qtr",
    sparkColor: "#2094f3",
    sparkline: [42, 48, 45, 52, 58, 55, 62, 68, 72, 70, 75, 78],
    icon: "Dollar",
  },
  {
    title: "Conversion Rate",
    subtitle: "Lead to close",
    value: "28.6%",
    delta: "+3.2%",
    deltaLabel: "vs last qtr",
    sparkColor: "#f78d00",
    sparkline: [22, 24, 23, 26, 28, 27, 29, 28, 30, 29, 28, 29],
    icon: "TrendingUp",
  },
  {
    title: "Average Cycle Time",
    subtitle: "Days to close",
    value: "23 days",
    delta: "-4 days",
    deltaLabel: "vs last qtr",
    sparkColor: "#0369a1",
    sparkline: [28, 27, 26, 25, 24, 24, 23, 23, 23, 23, 23, 23],
    icon: "Clock",
  },
  {
    title: "Avg. System Size",
    subtitle: "Per installation",
    value: "8.4 kW",
    delta: "+0.6 kW",
    deltaLabel: "vs last qtr",
    sparkColor: "#ea580c",
    sparkline: [7.2, 7.4, 7.6, 7.8, 8.0, 8.1, 8.2, 8.3, 8.35, 8.4, 8.4, 8.4],
    icon: "Light",
  },
];

export const SECONDARY_KPIS = [
  { title: "Average Deal Size", value: "$12,500", delta: "+8.3%", icon: "Dollar", iconColor: "#09234A", iconBackgroundColor: "#09234A14" },
  { title: "Net Profit", value: "$41,040", delta: "+$6,200", icon: "BarChart3", iconColor: "#16A34A", iconBackgroundColor: "#16A34A14" },
  { title: "Installs This Month", value: "18", delta: "+5", icon: "Light", iconColor: "#F78D00", iconBackgroundColor: "#F78D0014" },
  { title: "Pending Proposals", value: "23", delta: "", icon: "Target", iconColor: "#09234A", iconBackgroundColor: "#09234A14" },
];

export const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const MONTHLY_REVENUE = [
  100000, 140000, 200000, 250000, 380000, 420000, 550000, 460000, 400000, 300000, 400000, 440000,
];
export const MONTHLY_PROFIT = [
  90, 100, 95, 110, 115, 120, 118, 125, 122, 130, 135, 140,
];
export const MONTHLY_INSTALLS = [
  12, 14, 13, 15, 16, 17, 16, 18, 17, 19, 20, 21,
];

export const MONTHLY_HEADLINE = {
  total: "$3,950,000",
  sub: "total this year",
  yoy: "+18.2% YoY",
};

export const STC_PIPELINE = {
  badge: "333 STCs",
  sub: "total value",
  columns: [
    {
      label: "Created",
      count: 125,
      valueK: 1500,
      valueLabel: "$1.5M",
      color: "#09234a",
    },
    {
      label: "Submitted",
      count: 100,
      valueK: 1200,
      valueLabel: "$1.2M",
      color: "#304566",
    },
    {
      label: "Approved",
      count: 67,
      valueK: 800,
      valueLabel: "$800K",
      color: "#f78d00",
    },
    {
      label: "Paid",
      count: 41,
      valueK: 487,
      valueLabel: "$487K",
      color: "#ffbf47",
    },
  ],
};

/** Figma `3:10769` — widest bar; other rows are % of this for centered funnel */
export const FUNNEL_BAR_MAX = 514.279;

export type FunnelStage = {
  label: string;
  deals: number;
  /** Horizontal bar span for stacked funnel (≤ FUNNEL_BAR_MAX) */
  barUnits: number;
  color: string;
  /** White text on navy bars vs dark ink on orange/yellow */
  inkOnBar: "light" | "dark";
  revenueK?: string;
  /** Conversion from prior stage (first row omitted in design) */
  convFromPrev?: string;
};

/** Numbers, colors, widths, and copy aligned to Figma `3:10769` */
export const FUNNEL_STAGES: FunnelStage[] = [
  {
    label: "Leads",
    deals: 120,
    barUnits: 514.279,
    color: "#09234a",
    inkOnBar: "light",
    revenueK: "$2487K",
  },
  {
    label: "Site Visit",
    deals: 85,
    barUnits: 411.42,
    color: "#1a3a6a",
    inkOnBar: "light",
    revenueK: "$1763K",
    convFromPrev: "71%",
  },
  {
    label: "Proposal Sent",
    deals: 62,
    barUnits: 318.847,
    color: "#304566",
    inkOnBar: "light",
    revenueK: "$1287K",
    convFromPrev: "73%",
  },
  {
    label: "Deposit Paid",
    deals: 38,
    barUnits: 226.274,
    color: "#f78d00",
    inkOnBar: "dark",
    revenueK: "$789K",
    convFromPrev: "61%",
  },
  {
    label: "Contracted",
    deals: 28,
    barUnits: 154.272,
    color: "#ffbf47",
    inkOnBar: "dark",
    convFromPrev: "74%",
  },
  {
    label: "Installation",
    deals: 18,
    barUnits: 102.843,
    color: "#ffef62",
    inkOnBar: "dark",
    convFromPrev: "64%",
  },
];

export const SALES_FUNNEL_HEADER = {
  leadToInstallPct: "15%",
} as const;

export type TeamMember = {
  rank: number;
  name: string;
  initials: string;
  dealsPct: number;
  conv: string;
  revenue: string;
};

export const TEAM_ROWS: TeamMember[] = [
  {
    rank: 1,
    name: "John Smith",
    initials: "JS",
    dealsPct: 92,
    conv: "34%",
    revenue: "$1,500,000",
  },
  {
    rank: 2,
    name: "Amy Lee",
    initials: "AL",
    dealsPct: 78,
    conv: "31%",
    revenue: "$980,000",
  },
  {
    rank: 3,
    name: "Marcus Chen",
    initials: "MC",
    dealsPct: 71,
    conv: "29%",
    revenue: "$820,000",
  },
  {
    rank: 4,
    name: "Sarah Johnson",
    initials: "SJ",
    dealsPct: 65,
    conv: "27%",
    revenue: "$640,000",
  },
];

export type RegionRow = {
  region: string;
  installs: number;
  avgSize: string;
  trend: string;
  revenue: string;
  /** Width of the small gradient meter under region name */
  meterPct: number;
};

export const REGIONAL_ROWS: RegionRow[] = [
  {
    region: "Sydney Metro",
    installs: 78,
    avgSize: "8.8 kW",
    trend: "+12%",
    revenue: "$975K",
    meterPct: 100,
  },
  {
    region: "Melbourne",
    installs: 62,
    avgSize: "8.2 kW",
    trend: "+8%",
    revenue: "$775K",
    meterPct: 80,
  },
  {
    region: "Brisbane / QLD",
    installs: 45,
    avgSize: "9.1 kW",
    trend: "+22%",
    revenue: "$563K",
    meterPct: 58,
  },
  {
    region: "Perth / WA",
    installs: 34,
    avgSize: "7.6 kW",
    trend: "-3%",
    revenue: "$425K",
    meterPct: 44,
  },
  {
    region: "Adelaide / SA",
    installs: 28,
    avgSize: "7.2 kW",
    trend: "+5%",
    revenue: "$350K",
    meterPct: 36,
  },
  {
    region: "Regional / Other",
    installs: 16,
    avgSize: "6.4 kW",
    trend: "-8%",
    revenue: "$200K",
    meterPct: 21,
  },
];

export type LeadSource = {
  source: string;
  leads: number;
  conv: string;
  revenue: string;
  color: string;
  /** Width of inline meter in each row */
  meterPct: number;
  convTone?: "success" | "muted";
};

export const LEAD_SOURCES: LeadSource[] = [
  {
    source: "Google Ads",
    leads: 45,
    conv: "40%",
    revenue: "$675K",
    color: "#09234a",
    meterPct: 40,
  },
  {
    source: "Facebook",
    leads: 38,
    conv: "32%",
    revenue: "$450K",
    color: "#304566",
    meterPct: 36,
  },
  {
    source: "Referral",
    leads: 28,
    conv: "57%",
    revenue: "$600K",
    color: "#f78d00",
    meterPct: 30,
    convTone: "success",
  },
  {
    source: "Website",
    leads: 22,
    conv: "36%",
    revenue: "$300K",
    color: "#ffbf47",
    meterPct: 26,
  },
  {
    source: "Solar Wizard",
    leads: 15,
    conv: "33%",
    revenue: "$188K",
    color: "#dfd5c3",
    meterPct: 22,
  },
];

/** Figma `3:11171` top stacked bar segment shares */
export const LEAD_MIX_PCTS = [30.4, 25.7, 18.9, 14.9, 10.1];

export const LEAD_SOURCE_SUMMARY = {
  totalLeads: "148 leads",
} as const;

export const OPERATIONAL = {
  forecastRatio: "3.2 months",
  forecastTarget: "Target: 4 months",
  forecastCoveragePct: 80,
  winRate: "34%",
  winRateDelta: "+2.1%",
  variance: "±8.2%",
  varianceDelta: "-1.5%",
  installTime: "1.8 days",
  installTimeDelta: "-0.3 days",
  firstFix: "91%",
  firstFixDelta: "+4%",
  rework: "3.2%",
  reworkDelta: "-1.1%",
  crewUtilisation: "87%",
  crewUtilisationDelta: "+5%",
  weeklyInstalls: [5, 4, 6, 5, 7, 6, 8, 7],
};

export const BUSINESS_HEALTH = {
  nps: 78,
  npsLabel: "NPS Score",
  industryAvg: "Industry Avg: 68",
  npsDelta: "+10 above avg",
  csat: "94%",
  csatDelta: "+1.2%",
  reviews: "4.8",
  reviewsSuffix: "/ 5.0 (312 reviews)",
  cashFlowRows: [
    {
      label: "Accounts Receivable",
      value: "$342,000",
      delta: "+$48K",
      meterPct: 69,
      tone: "success" as const,
      icon: "$",
    },
    {
      label: "Outstanding Invoices",
      value: "$128,500",
      delta: "-$12K",
      meterPct: 33,
      tone: "amber" as const,
      icon: "◷",
    },
    {
      label: "Overdue Payments",
      value: "$23,400",
      delta: "-$8K",
      meterPct: 12,
      tone: "danger" as const,
      icon: "⚠",
    },
  ],
  dso: "28",
  dsoUnit: "days",
  dsoDelta: "-3 days",
  deposit: "94%",
  depositDelta: "+2%",
};
