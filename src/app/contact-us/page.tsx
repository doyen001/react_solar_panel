import { BusinessAssociatesSection } from "@/components/contact/BusinessAssociatesSection";
import { DesignSystemSection } from "@/components/contact/DesignSystemSection";
import { FooterSection } from "@/components/contact/FooterSection";
import { HeroSection } from "@/components/contact/HeroSection";
import { SendUsAndPartnerSection } from "@/components/contact/SendUsAndPartnerSection";

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
