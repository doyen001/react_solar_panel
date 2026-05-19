import Image from "next/image";

import { BlogPostCardMeta } from "@/components/pages/blog/BlogPostCardMeta";
import type { BlogPost } from "@/utils/constant";

type Props = {
  post: BlogPost;
};

export function BlogPostCardVisual({ post }: Props) {
  return (
    <div className="absolute left-[7px] right-[7px] top-[6.94px] h-[266.651px] overflow-hidden rounded-[12px]">
      <Image
        src={post.heroImageSrc}
        alt={post.heroImageAlt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 393px"
      />
      <BlogPostCardMeta post={post} />
      <BlogPostCardThumbnail post={post} />
    </div>
  );
}

function BlogPostCardThumbnail({ post }: Props) {
  return (
    <div className="absolute left-[calc(50%+0.6px)] top-[calc(50%+2.34px)] flex size-[140.056px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[26.26px] border-[1.629px] border-blog-card-thumbnail-border bg-blog-card-thumbnail-backdrop">
      <div className="relative size-[120.903px] overflow-hidden rounded-[16.967px] border-[0.729px] border-blog-card-thumbnail-border-inner bg-blog-card-thumbnail-placeholder">
        <Image
          src={post.thumbnailImageSrc}
          alt={post.thumbnailImageAlt}
          fill
          className="object-cover"
          sizes="121px"
        />
      </div>
    </div>
  );
}

