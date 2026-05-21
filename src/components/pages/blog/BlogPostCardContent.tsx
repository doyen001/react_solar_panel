import Image from "next/image";
import Icon from "@/components/ui/Icons";
import type { BlogPost } from "@/utils/constant";

type Props = {
  post: BlogPost;
};

export function BlogPostCardContent({ post }: Props) {
  return (
    <div className="absolute left-[7px] right-[7px] top-[257.36px] h-[271.399px] overflow-hidden rounded-bl-[12px] rounded-br-[12px] bg-blog-card-body-bg">
      <BlogPostCardContentInner post={post} />
    </div>
  );
}

function BlogPostCardContentInner({ post }: Props) {
  return (
    <div className="mx-auto flex w-full max-w-[349.583px] flex-col gap-[15.562px] px-[22px] pb-6 pt-[40.2px]">
      <h2 className="font-source-sans text-[23.941px] font-bold leading-normal tracking-[-1.1971px] text-blog-card-title truncate">
        {post.title}
      </h2>
      <div className="flex flex-col gap-[26.335px]">
        <p className="line-clamp-4 h-[81.4px] max-w-[324.403px] font-source-sans text-[19.153px] font-normal leading-normal tracking-[-1.1971px] text-blog-card-excerpt">
          {post.excerpt}
        </p>
        <div className="flex flex-col gap-[19.153px]">
          <div className="h-[1.196px] w-full bg-blog-card-divider" />
          <BlogPostCardAuthorRow post={post} />
        </div>
      </div>
    </div>
  );
}

function BlogPostCardAuthorRow({ post }: Props) {
  return (
    <div className="flex h-[38.291px] items-center justify-between">
      <div className="flex items-center gap-[14.352px]">
        <div className="relative size-[38.291px] shrink-0 overflow-hidden rounded-[11.971px] bg-blog-card-avatar-fallback">
          <Image
            src={post.authorAvatarSrc}
            alt={post.authorAvatarAlt}
            fill
            className="object-cover"
            sizes="38px"
          />
        </div>
        <span className="font-inter text-[16.759px] font-medium leading-[23.941px] tracking-[-0.18px] text-blog-card-author">
          {post.authorName}
        </span>
      </div>
      <span
        aria-hidden
        className="inline-flex size-4 shrink-0 items-center justify-center text-blog-card-arrow"
      >
        <Icon name="BlogCardArrow" className="size-3" />
      </span>
    </div>
  );
}
