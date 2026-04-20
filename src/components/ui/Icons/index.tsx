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
  | "ArrowRight"
  | "UserPlus"
  | "CircleQuestion"
  | "LocationPin"
  | "Pencil"
  | "Trash"
  | "LayoutGrid"
  | "Menu";

type IconProps = {
  name: IconType | undefined;
  className?: string;
};

const Icon: React.FC<IconProps> = ({ name, className }) => {
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
    Eye,
    ArrowRight,
    UserPlus,
    CircleQuestion,
    LocationPin,
    Pencil,
    Trash,
    LayoutGrid,
    Menu,
  };

  const CurrentIcon = icons[name];

  return <CurrentIcon className={classNames(className)} />;
};

export default Icon;
