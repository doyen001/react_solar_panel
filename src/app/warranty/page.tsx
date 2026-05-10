import { ReadingColumnLayout } from "@/components/layouts/ReadingColumnLayout";
import { FooterSection } from "@/components/modules/LandingFooter";
import { Header } from "@/components/modules/LandingHero";
import { WarrantyPageSection } from "@/components/pages/warranty/WarrantyPageSection";

export default function WarrantyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <ReadingColumnLayout backgroundClassName="min-h-screen bg-warranty-page-bg">
          <WarrantyPageSection />
        </ReadingColumnLayout>
      </main>
      <FooterSection />
    </>
  );
}
