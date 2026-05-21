import { FooterSection } from "@/components/modules/LandingFooter";
import { Header } from "@/components/modules/LandingHero";
import { FaqsPageSection } from "@/components/pages/faqs/FaqsPageSection";
import { FAQS_PAGE } from "@/utils/constant";

export default function FaqsPage() {
  return (
    <>
      <Header />
      <main className="overflow-x-hidden bg-faqs-page-bg">
        <FaqsPageSection />
      </main>
      <FooterSection
        showReadyToControlCta={false}
        customCta={FAQS_PAGE.supportCta}
      />
    </>
  );
}
