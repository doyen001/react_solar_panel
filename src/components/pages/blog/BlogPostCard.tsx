import Link from "next/link";

import { BlogPostCardContent } from "@/components/pages/blog/BlogPostCardContent";
import { BlogPostCardVisual } from "@/components/pages/blog/BlogPostCardVisual";
import { getBlogPostDetailHref, type BlogPost } from "@/utils/constant";

type Props = {
  post: BlogPost;
  /**
   * "light" is only used by the About Us portfolio grid: a spinning
   * yellow-to-amber ring instead of the shell's static dark gradient, and a
   * white body panel with dark text instead of the default black/white one.
   * Everywhere else (the real /blog page, related posts) stays "dark".
   */
  variant?: "dark" | "light";
};

/**
 * The visible border is just the shell's own background showing through the
 * ~7px gap the visual/content panels leave uncovered — both of those panels
 * are fully opaque, so the shell never needs oversizing or masking the way
 * an animated ring over a translucent surface would.
 */
const GOLD_RING_GRADIENT =
  "conic-gradient(from var(--rainbow-angle), #FFEF62, #F78D00, #FFEF62)";

export function BlogPostCard({ post, variant = "dark" }: Props) {
  const isLight = variant === "light";

  return (
    <article className="mx-auto w-full max-w-[407px]">
      <Link
        href={getBlogPostDetailHref(post.id)}
        className="block p-[7px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blog-card-shell-from"
      >
        <div
          className={
            isLight
              ? "relative h-[536.818px] w-full overflow-hidden rounded-[16.759px] motion-reduce:animate-none [animation:rainbow-angle-spin_5s_linear_infinite]"
              : "blog-post-card-shell relative h-[536.818px] w-full overflow-hidden rounded-[16.759px]"
          }
          style={isLight ? { backgroundImage: GOLD_RING_GRADIENT } : undefined}
        >
          <BlogPostCardVisual post={post} />
          <BlogPostCardContent post={post} variant={variant} />
        </div>
      </Link>
    </article>
  );
}
