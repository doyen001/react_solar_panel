import classNames from "classnames";

import Search from "./search.svg?component";
import CheckCircle from "./check-circle.svg?component";
import Shield from "./shield.svg?component";
import Bell from "./bell.svg?component";
import Sun from "./sun.svg?component";
import Check from "./check.svg?component";
import MessageSquare from "./messageSquare.svg?component";
import Doc from "./doc.svg?component";
import Calendar from "./calendar.svg?component";
import QuestionCircle from "./question-circle.svg?component";
import Dollar from "./dollar.svg?component";
import Light from "./light.svg?component";
import LightCheck from "./light-check.svg?component";
import Shop from "./shop.svg?component";
import User from "./user.svg?component";
import Lock from "./lock.svg?component";
import Phone from "./phone.svg?component";
import Mail from "./mail.svg?component";
import Copy from "./copy.svg?component";
import Pin from "./pin.svg?component";
import Eye from "./eye.svg?component";
import ProductCart from "./product-cart.svg?component";
import MyDesignsBattery from "./my-designs-battery.svg?component";
import MyDesignsInverter from "./my-designs-inverter.svg?component";
import Link from "./link.svg?component";
import Image from "./image.svg?component";
import Emoji from "./emoji.svg?component";
import Sparkles from "./sparkles.svg?component";
import Bold from "./bold.svg?component";
import Italic from "./italic.svg?component";
import Attach from "./attach.svg?component";
import Download from "./download.svg?component";
import ArrowRight from "./arrow-right.svg?component";
import UserPlus from "./user-plus.svg?component";
import CircleQuestion from "./circle-question.svg?component";
import LocationPin from "./location-pin.svg?component";
import Pencil from "./pencil.svg?component";
import Trash from "./trash.svg?component";
import RotateCw from "./rotate-cw.svg?component";
import LayoutGrid from "./layout-grid.svg?component";
import Menu from "./menu.svg?component";
import Zap from "./zap.svg?component";
import ArrowUpRight from "./arrow-up-right.svg?component";
import ChevronRight from "./chevron-right.svg?component";
import Building2 from "./building-2.svg?component";
import Users from "./users.svg?component";
import TrendingUp from "./trending-up.svg?component";
import BarChart3 from "./bar-chart-3.svg?component";
import Clock from "./clock.svg?component";
import Target from "./target.svg?component";
import Tag from "./tag.svg?component";
import Package from "./package.svg?component";
import Plus from "./plus.svg?component";
import Cpu from "./cpu.svg?component";
import Battery from "./battery.svg?component";
import Wrench from "./wrench.svg?component";
import Trash2 from "./trash-2.svg?component";
import Info from "./info.svg?component";
import FileText from "./file-text.svg?component";
import Send from "./send.svg?component";
import AlertTriangle from "./alert-triangle.svg?component";
import Star from "./product-star.svg?component";
import ExternalLink from "./product-external-link.svg?component";
import Funnel from "./funnel.svg?component";
import ChevronDown from "./chevron-down.svg?component";
import ChevronLeft from "./chevron-left.svg?component";
import X from "./x.svg?component";
import BulletDot from "./bullet-dot.svg?component";
import Globe from "./globe.svg?component";
import MaintCalendar from "./maint-calendar.svg?component";
import BlogCategoryDots from "./blog-category-dots.svg?component";
import BlogCardFile from "./blog-card-file.svg?component";
import BlogCardArrow from "./blog-card-arrow.svg?component";
import BlogDetailQuote from "./blog-detail-quote.svg?component";
import BlogDetailViewAllArrow from "./blog-detail-view-all-arrow.svg?component";
import BlogDetailShareLink from "./blog-detail-share-link.svg?component";
import BlogDetailShareLinkedin from "./blog-detail-share-linkedin.svg?component";
import BlogDetailShareX from "./blog-detail-share-x.svg?component";
import BlogDetailShareFacebook from "./blog-detail-share-facebook.svg?component";
import AboutUsStar from "./about-us-star.svg?component";
import AboutUsHeroSun from "./hero-feature-sun.svg?component";
import AboutUsHeroBolt from "./hero-feature-bolt.svg?component";
import AboutUsHeroHome from "./hero-feature-home.svg?component";
import AboutUsHeroEv from "./hero-feature-ev.svg?component";
import AboutUsHeroShield from "./hero-feature-shield.svg?component";
import AboutUsPortfolioCategory from "./about-us-portfolio-category.svg?component";
import FaqCategoryGeneral from "./faq-category-general.svg?component";
import FaqCategoryInstallation from "./faq-category-installation.svg?component";
import FaqCategoryRebates from "./faq-category-rebates.svg?component";
import FaqCategoryProducts from "./faq-category-products.svg?component";
import FaqDownload from "./faq-download.svg?component";
import MyDesignSun from "./sun.svg?component";
import MyDesignGift from "./my-designs-gift.svg?component";
import ProductHeart from "./product-heart.svg?component";
import HeatPump from "./heat-pump.svg?component";

export type IconType =
  | "Search"
  | "Shield"
  | "ProductHeart"
  | "CheckCircle"
  | "Bell"
  | "Copy"
  | "ProductCart"
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
  | "ExternalLink"
  | "Funnel"
  | "ChevronDown"
  | "ChevronLeft"
  | "X"
  | "BulletDot"
  | "Globe"
  | "MaintCalendar"
  | "BlogCategoryDots"
  | "BlogCardFile"
  | "BlogCardArrow"
  | "BlogDetailQuote"
  | "BlogDetailViewAllArrow"
  | "BlogDetailShareLink"
  | "BlogDetailShareLinkedin"
  | "BlogDetailShareX"
  | "BlogDetailShareFacebook"
  | "AboutUsStar"
  | "AboutUsHeroSun"
  | "AboutUsHeroBolt"
  | "AboutUsHeroHome"
  | "AboutUsHeroEv"
  | "AboutUsHeroShield"
  | "AboutUsPortfolioCategory"
  | "FaqCategoryGeneral"
  | "FaqCategoryInstallation"
  | "FaqCategoryRebates"
  | "FaqCategoryProducts"
  | "FaqDownload"
  | "MyDesignSun"
  | "MyDesignsBattery"
  | "MyDesignsInverter"
  | "MyDesignGift"
  | "HeatPump"
  | "RotateCw";

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
    RotateCw,
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
    Copy,
    ProductHeart,
    ProductCart,
    Battery,
    Wrench,
    Trash2,
    Info,
    FileText,
    Send,
    AlertTriangle,
    Star,
    ExternalLink,
    Funnel,
    ChevronDown,
    ChevronLeft,
    X,
    BulletDot,
    Globe,
    MaintCalendar,
    BlogCategoryDots,
    BlogCardFile,
    BlogCardArrow,
    BlogDetailQuote,
    BlogDetailViewAllArrow,
    BlogDetailShareLink,
    BlogDetailShareLinkedin,
    BlogDetailShareX,
    BlogDetailShareFacebook,
    AboutUsStar,
    AboutUsHeroSun,
    AboutUsHeroBolt,
    AboutUsHeroHome,
    AboutUsHeroEv,
    AboutUsHeroShield,
    AboutUsPortfolioCategory,
    FaqCategoryGeneral,
    FaqCategoryInstallation,
    FaqCategoryRebates,
    FaqCategoryProducts,
    FaqDownload,
    MyDesignSun,
    MyDesignsBattery,
    MyDesignsInverter,
    MyDesignGift,
    Shield,
    HeatPump,
  };

  const CurrentIcon = icons[name];

  return <CurrentIcon className={classNames(className)} style={style} />;
};

export default Icon;
