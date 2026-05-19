import Link from "next/link";

import { BlogPostCard } from "@/components/pages/blog/BlogPostCard";
import Icon from "@/components/ui/Icons";
import type { BlogDetailContent, BlogPost } from "@/utils/constant";

type Props = {
  content: BlogDetailContent;
  posts: readonly BlogPost[];
};

export function BlogDetailRelatedPostsSection({ content, posts }: Props) {
  return (
    <section className="bg-blog-detail-page-bg py-16 sm:py-20 lg:py-[90px]">
      <div className="mx-auto w-full max-w-[1263px] px-4 sm:px-6 lg:px-[89px]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-[7.992px]">
            <h2 className="font-source-sans text-[26px] font-bold leading-[36px] text-blog-detail-related-title sm:text-[30px]">
              {content.relatedHeading}
            </h2>
            <p className="font-source-sans text-[16px] font-normal leading-[24px] tracking-[-0.3125px] text-blog-detail-related-subtitle">
              {content.relatedSubtitle}
            </p>
          </div>
          <Link
            href={content.relatedViewAllHref}
            className="inline-flex items-center gap-[8px] font-source-sans text-[14px] font-bold leading-[20px] tracking-[-0.1504px] text-blog-detail-related-link"
          >
            {content.relatedViewAllLabel}
            <Icon name="BlogDetailViewAllArrow" className="size-[15.986px]" />
          </Link>
        </div>

        <ul className="mt-[45px] grid grid-cols-1 justify-items-center gap-5 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <li key={post.id} className="w-full">
              <BlogPostCard post={post} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
