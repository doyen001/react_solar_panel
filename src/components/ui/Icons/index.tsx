"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import classNames from "classnames";

import authUser from "@/components/ui/Icons/auth-user.svg";
import authLock from "@/components/ui/Icons/auth-lock.svg";
import authPhone from "@/components/ui/Icons/auth-phone.svg";
import authMail from "@/components/ui/Icons/auth-mail.svg";
import authPin from "@/components/ui/Icons/auth-pin.svg";
import authEye from "@/components/ui/Icons/auth-eye.svg";
import authArrowIn from "@/components/ui/Icons/auth-arrow-in.svg";
import authUserPlus from "@/components/ui/Icons/auth-user-plus.svg";
import circleQuestion from "@/components/ui/Icons/circle-question.svg";
const Search = dynamic<{ className?: string }>(
  () => import("@/components/ui/Icons/search.svg"),
);
const CheckCircle = dynamic<{ className?: string }>(
  () => import("@/components/ui/Icons/check-circle.svg"),
);
const Bell = dynamic<{ className?: string }>(
  () => import("@/components/ui/Icons/bell.svg"),
);
const Sun = dynamic<{ className?: string }>(
  () => import("@/components/ui/Icons/sun.svg"),
);
const Check = dynamic<{ className?: string }>(
  () => import("@/components/ui/Icons/check.svg"),
);
const MessageSquare = dynamic<{ className?: string }>(
  () => import("@/components/ui/Icons/messageSquare.svg"),
);
const Doc = dynamic<{ className?: string }>(
  () => import("@/components/ui/Icons/doc.svg"),
);
const Calendar = dynamic<{ className?: string }>(
  () => import("@/components/ui/Icons/calendar.svg"),
);
const QuestionCircle = dynamic<{ className?: string }>(
  () => import("@/components/ui/Icons/question-circle.svg"),
);
const Dollar = dynamic<{ className?: string }>(
  () => import("@/components/ui/Icons/dollar.svg"),
);
const Light = dynamic<{ className?: string }>(
  () => import("@/components/ui/Icons/light.svg"),
);
const LightCheck = dynamic<{ className?: string }>(
  () => import("@/components/ui/Icons/light-check.svg"),
);
const Shop = dynamic<{ className?: string }>(
  () => import("@/components/ui/Icons/shop.svg"),
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
  | "Shop";

type IconProps = {
  name: IconType | undefined;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLInputElement> | undefined;
};

function SvgIcon({
  src,
  size,
  className,
}: {
  src: unknown;
  size: number;
  className?: string;
}) {
  return (
    <Image
      src={src as never}
      alt=""
      width={size}
      height={size}
      className={className}
    />
  );
}

export function IconUser(props: { className?: string }) {
  return <SvgIcon src={authUser} size={16} className={props.className} />;
}

export function IconLock(props: { className?: string }) {
  return <SvgIcon src={authLock} size={16} className={props.className} />;
}

export function IconPhone(props: { className?: string }) {
  return <SvgIcon src={authPhone} size={16} className={props.className} />;
}

export function IconMail(props: { className?: string }) {
  return <SvgIcon src={authMail} size={16} className={props.className} />;
}

export function IconPin(props: { className?: string }) {
  return <SvgIcon src={authPin} size={16} className={props.className} />;
}

export function IconEye(props: { className?: string }) {
  return <SvgIcon src={authEye} size={16} className={props.className} />;
}

export function IconArrowIn(props: { className?: string }) {
  return <SvgIcon src={authArrowIn} size={18} className={props.className} />;
}

export function IconUserPlus(props: { className?: string }) {
  return <SvgIcon src={authUserPlus} size={18} className={props.className} />;
}

export function IconCircleQuestion(props: { className?: string }) {
  return <SvgIcon src={circleQuestion} size={20} className={props.className} />;
}

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
  };

  const CurrentIcon = icons[name];

  return <CurrentIcon className={classNames(className)} />;
};

export default Icon;
