import { FooterSection } from "@/components/modules/LandingFooter";
import { Header } from "@/components/modules/LandingHero";
import { InstallerLandingContent } from "@/components/pages/installer/InstallerLandingContent";

export default function InstallersLandingPage() {
  return (
    <>
      <Header />
      <InstallerLandingContent />
      <FooterSection />
    </>
  );
}
