import { FirmwarePageSection } from "@/components/pages/firmware/FirmwarePageSection";
import { FooterSection } from "@/components/modules/LandingFooter";
import { Header } from "@/components/modules/LandingHero";

export default function FirmwarePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-firmware-page-bg">
        <FirmwarePageSection />
      </main>
      <FooterSection />
    </>
  );
}
