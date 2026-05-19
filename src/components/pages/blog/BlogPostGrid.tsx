import { BlogPostCard } from "@/components/pages/blog/BlogPostCard";
import { BLOG_PAGE } from "@/utils/constant";

export function BlogPostGrid() {
  return (
    <ul className="grid grid-cols-1 justify-items-center gap-x-5 gap-y-[21px] md:grid-cols-2 xl:grid-cols-3">
      {BLOG_PAGE.posts.map((post) => (
        <li key={post.id} className="w-full">
          <BlogPostCard post={post} />
        </li>
      ))}
    </ul>
  );
}
