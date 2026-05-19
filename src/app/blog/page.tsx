import { BlogPageSection } from "@/components/pages/blog/BlogPageSection";
import { FooterSection } from "@/components/modules/LandingFooter";
import { Header } from "@/components/modules/LandingHero";

export default function BlogPage() {
  return (
    <>
      <Header />
      <main>
        <BlogPageSection />
      </main>
      <FooterSection />
    </>
  );
}
