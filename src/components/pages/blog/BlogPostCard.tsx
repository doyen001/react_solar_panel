import Link from "next/link";

import { BlogPostCardContent } from "@/components/pages/blog/BlogPostCardContent";
import { BlogPostCardVisual } from "@/components/pages/blog/BlogPostCardVisual";
import type { BlogPost } from "@/utils/constant";

type Props = {
  post: BlogPost;
};

export function BlogPostCard({ post }: Props) {
  return (
    <article className="mx-auto w-full max-w-[407px]">
      <Link
        href={post.href}
        className="block p-[7px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blog-card-shell-from"
      >
        <div className="blog-post-card-shell relative h-[536.818px] w-full overflow-hidden rounded-[16.759px]">
          <BlogPostCardVisual post={post} />
          <BlogPostCardContent post={post} />
        </div>
      </Link>
    </article>
  );
}
