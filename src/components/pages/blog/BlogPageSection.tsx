import { BlogHeroSection } from "@/components/pages/blog/BlogHeroSection";
import { BlogPostGrid } from "@/components/pages/blog/BlogPostGrid";

export function BlogPageSection() {
  return (
    <section className="blog-page-surface pb-16 pt-28 sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-36">
      <div className="mx-auto w-full max-w-[1261px] px-4 sm:px-6 lg:px-[90px]">
        <BlogHeroSection />
        <div className="mt-[75px]">
          <BlogPostGrid />
        </div>
      </div>
    </section>
  );
}
