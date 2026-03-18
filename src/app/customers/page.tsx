import { FooterSection } from "@/components/modules/LandingFooter";
import { Header } from "@/components/modules/LandingHero";
import { AcrossAustraliaSection } from "@/components/pages/home/AcrossAustraliaSection";
import { BluettiProductsSection } from "@/components/pages/home/BluettiProductsSection";
import { CustomerReviewsSection } from "@/components/pages/home/CustomerReviewsSection";
import { PaymentOptionsSection } from "@/components/pages/home/PaymentOptionsSection";
import { ProductsSection } from "@/components/pages/home/ProductsSection";
import { SpecialDealsSection } from "@/components/pages/home/SpecialDealsSection";
import { TechnologySection } from "@/components/pages/home/TechnologySection";
import { VideoShowcaseSection } from "@/components/pages/home/VideoShowcaseSection";
import { CustomerHeroSection } from "../../components/pages/customer/HeroSection";
import { CustomerPlatformSection } from "../../components/pages/customer/PlatformSection";

export default function Home() {
  return (
    <>
      <Header />
      <main className="overflow-x-hidden bg-white">
        <CustomerHeroSection />
        <CustomerPlatformSection />
        <ProductsSection />
        <SpecialDealsSection />
        <BluettiProductsSection />
        <VideoShowcaseSection />
        <AcrossAustraliaSection />
        <TechnologySection />
        <CustomerReviewsSection />
        <PaymentOptionsSection />
      </main>
      <FooterSection />
    </>
  );
}
