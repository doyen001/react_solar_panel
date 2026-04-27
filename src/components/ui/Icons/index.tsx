"use client";

import dynamic from "next/dynamic";
import classNames from "classnames";

type SvgComponentModule = {
  default: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

function createDynamicSvgIcon(loader: () => Promise<SvgComponentModule>) {
  return dynamic(async () => {
    const mod = await loader();
    return mod.default;
  });
}

const Search = createDynamicSvgIcon(() => import("./search.svg?component"));
const CheckCircle = createDynamicSvgIcon(
  () => import("./check-circle.svg?component"),
);
const Bell = createDynamicSvgIcon(() => import("./bell.svg?component"));
const Sun = createDynamicSvgIcon(() => import("./sun.svg?component"));
const Check = createDynamicSvgIcon(() => import("./check.svg?component"));
const MessageSquare = createDynamicSvgIcon(
  () => import("./messageSquare.svg?component"),
);
const Doc = createDynamicSvgIcon(() => import("./doc.svg?component"));
const Calendar = createDynamicSvgIcon(() => import("./calendar.svg?component"));
const QuestionCircle = createDynamicSvgIcon(
  () => import("./question-circle.svg?component"),
);
const Dollar = createDynamicSvgIcon(() => import("./dollar.svg?component"));
const Light = createDynamicSvgIcon(() => import("./light.svg?component"));
const LightCheck = createDynamicSvgIcon(
  () => import("./light-check.svg?component"),
);
const Shop = createDynamicSvgIcon(() => import("./shop.svg?component"));
const User = createDynamicSvgIcon(() => import("./user.svg?component"));
const Lock = createDynamicSvgIcon(() => import("./lock.svg?component"));
const Phone = createDynamicSvgIcon(() => import("./phone.svg?component"));
const Mail = createDynamicSvgIcon(() => import("./mail.svg?component"));
const Pin = createDynamicSvgIcon(() => import("./pin.svg?component"));
const Eye = createDynamicSvgIcon(() => import("./eye.svg?component"));
const Link = createDynamicSvgIcon(() => import("./link.svg?component"));
const Image = createDynamicSvgIcon(() => import("./image.svg?component"));
const Emoji = createDynamicSvgIcon(() => import("./emoji.svg?component"));
const Sparkles = createDynamicSvgIcon(() => import("./sparkles.svg?component"));
const Bold = createDynamicSvgIcon(() => import("./bold.svg?component"));
const Italic = createDynamicSvgIcon(() => import("./italic.svg?component"));
const Attach = createDynamicSvgIcon(() => import("./attach.svg?component"));
const Download = createDynamicSvgIcon(() => import("./download.svg?component"));
const ArrowRight = createDynamicSvgIcon(
  () => import("./arrow-right.svg?component"),
);
const UserPlus = createDynamicSvgIcon(
  () => import("./user-plus.svg?component"),
);
const CircleQuestion = createDynamicSvgIcon(
  () => import("./circle-question.svg?component"),
);
const LocationPin = createDynamicSvgIcon(
  () => import("./location-pin.svg?component"),
);
const Pencil = createDynamicSvgIcon(() => import("./pencil.svg?component"));
const Trash = createDynamicSvgIcon(() => import("./trash.svg?component"));
const LayoutGrid = createDynamicSvgIcon(
  () => import("./layout-grid.svg?component"),
);
const Menu = createDynamicSvgIcon(() => import("./menu.svg?component"));
const Zap = createDynamicSvgIcon(() => import("./zap.svg?component"));
const ArrowUpRight = createDynamicSvgIcon(
  () => import("./arrow-up-right.svg?component"),
);
const ChevronRight = createDynamicSvgIcon(
  () => import("./chevron-right.svg?component"),
);
const Building2 = createDynamicSvgIcon(
  () => import("./building-2.svg?component"),
);
const Users = createDynamicSvgIcon(() => import("./users.svg?component"));
const TrendingUp = createDynamicSvgIcon(
  () => import("./trending-up.svg?component"),
);
const BarChart3 = createDynamicSvgIcon(
  () => import("./bar-chart-3.svg?component"),
);
const Clock = createDynamicSvgIcon(() => import("./clock.svg?component"));
const Target = createDynamicSvgIcon(() => import("./target.svg?component"));
const Tag = createDynamicSvgIcon(() => import("./tag.svg?component"));
const Package = createDynamicSvgIcon(() => import("./package.svg?component"));
const Plus = createDynamicSvgIcon(() => import("./plus.svg?component"));
const Cpu = createDynamicSvgIcon(() => import("./cpu.svg?component"));
const Battery = createDynamicSvgIcon(() => import("./battery.svg?component"));
const Wrench = createDynamicSvgIcon(() => import("./wrench.svg?component"));
const Trash2 = createDynamicSvgIcon(() => import("./trash-2.svg?component"));
const Info = createDynamicSvgIcon(() => import("./info.svg?component"));
const FileText = createDynamicSvgIcon(() => import("./file-text.svg?component"));
const Send = createDynamicSvgIcon(() => import("./send.svg?component"));
const AlertTriangle = createDynamicSvgIcon(
  () => import("./alert-triangle.svg?component"),
);
const Star = createDynamicSvgIcon(() => import("./product-star.svg?component"));
const ExternalLink = createDynamicSvgIcon(
  () => import("./product-external-link.svg?component"),
);
export type IconType =
  | "Search"
  | "CheckCircle"
  | "Bell"
  | "Sun"
  | "Check"
  | "MessageSquare"
  | "Doc"
  | "Calendar"
  | "QuestionCircle"
  | "Dollar"
  | "Light"
  | "LightCheck"
  | "Shop"
  | "User"
  | "Lock"
  | "Phone"
  | "Mail"
  | "Pin"
  | "Eye"
  | "Emoji"
  | "Bold"
  | "Italic"
  | "Link"
  | "Image"
  | "Attach"
  | "Sparkles"
  | "Download"
  | "ArrowRight"
  | "UserPlus"
  | "CircleQuestion"
  | "LocationPin"
  | "Pencil"
  | "Trash"
  | "LayoutGrid"
  | "Menu"
  | "Zap"
  | "ArrowUpRight"
  | "ChevronRight"
  | "Building2"
  | "Users"
  | "TrendingUp"
  | "BarChart3"
  | "Clock"
  | "Target"
  | "Tag"
  | "Package"
  | "Plus"
  | "Cpu"
  | "Battery"
  | "Wrench"
  | "Trash2"
  | "Info"
  | "FileText"
  | "Send"
  | "AlertTriangle"
  | "Star"
  | "ExternalLink";

type IconProps = {
  name: IconType | undefined;
  className?: string;
  style?: React.CSSProperties;
};

const Icon: React.FC<IconProps> = ({ name, className, style }) => {
  if (!name) {
    return null;
  }

  const icons = {
    Search,
    CheckCircle,
    Bell,
    Sun,
    Check,
    MessageSquare,
    Doc,
    Calendar,
    QuestionCircle,
    Dollar,
    Light,
    LightCheck,
    Shop,
    User,
    Lock,
    Phone,
    Mail,
    Pin,
    Download,
    Eye,
    Bold,
    Italic,
    Emoji,
    Link,
    Image,
    Attach,
    Sparkles,
    ArrowRight,
    UserPlus,
    CircleQuestion,
    LocationPin,
    Pencil,
    Trash,
    LayoutGrid,
    Menu,
    Zap,
    ArrowUpRight,
    ChevronRight,
    Building2,
    Users,
    TrendingUp,
    BarChart3,
    Clock,
    Target,
    Tag,
    Package,
    Plus,
    Cpu,
    Battery,
    Wrench,
    Trash2,
    Info,
    FileText,
    Send,
    AlertTriangle,
    Star,
    ExternalLink,
  };

  const CurrentIcon = icons[name];

  return <CurrentIcon className={classNames(className)} style={style} />;
};

export default Icon;
