import { AcrossAustraliaSection } from "@/components/pages/home/AcrossAustraliaSection";
import { CustomerReviewsSection } from "@/components/pages/home/CustomerReviewsSection";
import { PaymentOptionsSection } from "@/components/pages/home/PaymentOptionsSection";
import { TechnologySection } from "@/components/pages/home/TechnologySection";
import { VideoShowcaseSection } from "@/components/pages/home/VideoShowcaseSection";
import { InstallerHeroSection } from "@/components/pages/installer/InstallerHeroSection";
import { InstallerLeadMarketplaceSection } from "@/components/pages/installer/InstallerLeadMarketplaceSection";
import {
  INSTALLER_LANDING_BANDS_AFTER_PRODUCTS,
  INSTALLER_LANDING_BANDS_BEFORE_PRODUCTS,
} from "@/components/pages/installer/installerLandingBands";
import { InstallerValueBands } from "@/components/pages/installer/InstallerValueBands";

export function InstallerLandingContent() {
  return (
    <main className="overflow-x-hidden bg-white">
      <InstallerHeroSection />
      <InstallerValueBands bands={INSTALLER_LANDING_BANDS_BEFORE_PRODUCTS} />
      <InstallerLeadMarketplaceSection />
      <InstallerValueBands bands={INSTALLER_LANDING_BANDS_AFTER_PRODUCTS} />
      <VideoShowcaseSection />
      <AcrossAustraliaSection />
      <TechnologySection />
      <CustomerReviewsSection />
      <PaymentOptionsSection />
    </main>
  );
}
