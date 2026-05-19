import { AboutUsPageSection } from "@/components/pages/about-us/AboutUsPageSection";
import { FooterSection } from "@/components/modules/LandingFooter";
import { Header } from "@/components/modules/LandingHero";

export default function AboutUsPage() {
  return (
    <>
      <Header />
      <main className="overflow-x-hidden bg-white">
        <AboutUsPageSection />
      </main>
      <FooterSection />
    </>
  );
}
