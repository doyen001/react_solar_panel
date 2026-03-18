import { BusinessAssociatesSection } from "@/components/pages/contact/BusinessAssociatesSection";
import { DesignSystemSection } from "@/components/pages/contact/DesignSystemSection";
import { FooterSection } from "@/components/modules/LandingFooter";
import { HeroSection } from "@/components/pages/contact/HeroSection";
import { SendUsAndPartnerSection } from "@/components/pages/contact/SendUsAndPartnerSection";

export default function ContactUsPage() {
  return (
    <main className="min-h-screen bg-[#f8c532]">
      <HeroSection />
      <SendUsAndPartnerSection />
      <BusinessAssociatesSection />
      <DesignSystemSection />
      <FooterSection />
    </main>
  );
}
