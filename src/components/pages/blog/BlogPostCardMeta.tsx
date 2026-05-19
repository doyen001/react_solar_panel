import Icon from "@/components/ui/Icons";
import type { BlogPost } from "@/utils/constant";

type Props = {
  post: BlogPost;
};

export function BlogPostCardMeta({ post }: Props) {
  return (
    <>
      <div className="absolute left-[14.36px] top-[14.37px] flex items-center gap-[16.759px]">
        <div className="flex w-[21.527px] items-center justify-between">
          <span className="size-[7.176px] rounded-full bg-blog-card-meta-dot" />
          <span className="size-[7.176px] rounded-full bg-blog-card-meta-dot" />
        </div>
        <BlogPostCardCategoryLabel category={post.category} />
      </div>
      <span className="absolute right-[14.36px] top-[12.82px] inline-flex h-6 min-w-[56px] items-center justify-center rounded bg-blog-card-date-bg px-2 font-inter text-xs font-bold leading-4 text-blog-card-date-text">
        {post.dateLabel}
      </span>
    </>
  );
}

function BlogPostCardCategoryLabel({ category }: { category: string }) {
  return (
    <div className="flex items-center gap-[9.576px]">
      <Icon
        name="BlogCardFile"
        className="size-[16.744px] shrink-0 text-blog-card-category-text"
      />
      <span className="font-inter text-[14.365px] font-medium leading-[19.153px] tracking-[0.3591px] text-blog-card-category-text">
        {category}
      </span>
    </div>
  );
}
