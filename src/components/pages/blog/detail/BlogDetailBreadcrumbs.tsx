import Link from "next/link";

import Icon from "@/components/ui/Icons";

type Props = {
  currentTitle: string;
};

export function BlogDetailBreadcrumbs({ currentTitle }: Props) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-[7.993px]">
        <li>
          <Link
            href="/"
            className="font-source-sans text-[14px] font-medium leading-normal tracking-[-0.1504px] text-blog-detail-breadcrumb transition-opacity hover:opacity-80"
          >
            Home
          </Link>
        </li>
        <li aria-hidden className="text-blog-detail-breadcrumb">
          <Icon name="ChevronRight" className="size-[11.989px]" />
        </li>
        <li>
          <Link
            href="/blog"
            className="font-source-sans text-[14px] font-medium leading-normal tracking-[-0.1504px] text-blog-detail-breadcrumb transition-opacity hover:opacity-80"
          >
            Blog
          </Link>
        </li>
        <li aria-hidden className="text-blog-detail-breadcrumb">
          <Icon name="ChevronRight" className="size-[11.989px]" />
        </li>
        <li>
          <span className="font-source-sans text-[14px] font-medium leading-normal tracking-[-0.1504px] text-blog-detail-breadcrumb-active">
            {currentTitle}
          </span>
        </li>
      </ol>
    </nav>
  );
}
