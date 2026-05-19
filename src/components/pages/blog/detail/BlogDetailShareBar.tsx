import Icon from "@/components/ui/Icons";
import type { IconType } from "@/components/ui/Icons";

type ShareLink = {
  label: string;
  href: string;
  icon: IconType;
};

const SHARE_LINKS: ShareLink[] = [
  { label: "Copy link", href: "#", icon: "BlogDetailShareLink" },
  { label: "Share on LinkedIn", href: "#", icon: "BlogDetailShareLinkedin" },
  { label: "Share on X", href: "#", icon: "BlogDetailShareX" },
  { label: "Share on Facebook", href: "#", icon: "BlogDetailShareFacebook" },
];

type Props = {
  label: string;
};

export function BlogDetailShareBar({ label }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-[19.98px]">
      <p className="font-source-sans text-[14px] font-normal leading-normal tracking-[-0.1504px] text-blog-detail-body">
        {label}
      </p>
      <ul className="flex flex-wrap items-center gap-[12px]">
        {SHARE_LINKS.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              aria-label={item.label}
              className="inline-flex size-[33.97px] items-center justify-center rounded-full bg-blog-detail-share-bg text-blog-detail-share-icon transition-opacity hover:opacity-80"
            >
              <Icon name={item.icon} className="size-[17.984px]" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
