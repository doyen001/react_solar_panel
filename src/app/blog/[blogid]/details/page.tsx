import { notFound } from "next/navigation";

import { BlogDetailPageSection } from "@/components/pages/blog/detail/BlogDetailPageSection";
import { FooterSection } from "@/components/modules/LandingFooter";
import { Header } from "@/components/modules/LandingHero";
import { fetchPublicBlog, fetchPublicBlogs } from "@/lib/public/blogs";

type Props = {
  params: Promise<{ blogid: string }>;
};

export default async function BlogDetailPage({ params }: Props) {
  const { blogid } = await params;
  const [detail, posts] = await Promise.all([
    fetchPublicBlog(blogid).catch(() => null),
    fetchPublicBlogs().catch(() => []),
  ]);

  if (!detail) {
    notFound();
  }

  const relatedPosts = posts.filter((post) => post.id !== detail.post.id).slice(0, 3);

  return (
    <>
      <Header />
      <main className="bg-blog-detail-page-bg">
        <BlogDetailPageSection content={detail.content} relatedPosts={relatedPosts} />
      </main>
      <FooterSection />
    </>
  );
}
