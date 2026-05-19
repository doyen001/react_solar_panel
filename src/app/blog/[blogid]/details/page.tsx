import { notFound } from "next/navigation";

import { BlogDetailPageSection } from "@/components/pages/blog/detail/BlogDetailPageSection";
import { FooterSection } from "@/components/modules/LandingFooter";
import { Header } from "@/components/modules/LandingHero";
import { getBlogDetailContent } from "@/utils/constant";

type Props = {
  params: Promise<{ blogid: string }>;
};

export default async function BlogDetailPage({ params }: Props) {
  const { blogid } = await params;
  const content = getBlogDetailContent(blogid);

  if (!content) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="bg-blog-detail-page-bg">
        <BlogDetailPageSection blogId={blogid} />
      </main>
      <FooterSection />
    </>
  );
}
