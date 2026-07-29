import { BlogDetailArticleSection } from "@/components/pages/blog/detail/BlogDetailArticleSection";
import { BlogDetailHeroSection } from "@/components/pages/blog/detail/BlogDetailHeroSection";
import { BlogDetailRelatedPostsSection } from "@/components/pages/blog/detail/BlogDetailRelatedPostsSection";
import type { BlogDetailContent, BlogPost } from "@/utils/constant";

type Props = {
  content: BlogDetailContent;
  relatedPosts: readonly BlogPost[];
};

export function BlogDetailPageSection({ content, relatedPosts }: Props) {
  return (
    <>
      <BlogDetailHeroSection content={content} />
      <div className="bg-blog-detail-page-bg pb-16 pt-[26px] sm:pb-20 lg:pb-24">
        <BlogDetailArticleSection content={content} />
      </div>
      <BlogDetailRelatedPostsSection content={content} posts={relatedPosts} />
    </>
  );
}
