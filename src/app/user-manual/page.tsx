import { ReadingColumnLayout } from "@/components/layouts/ReadingColumnLayout";
import { FooterSection } from "@/components/modules/LandingFooter";
import { Header } from "@/components/modules/LandingHero";
import { UserManualPageSection } from "@/components/pages/user-manual/UserManualPageSection";

export default function UserManualPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen -mb-20">
        <ReadingColumnLayout backgroundClassName="min-h-screen bg-user-manual-page-bg">
          <UserManualPageSection />
        </ReadingColumnLayout>
      </main>
      <FooterSection />
    </>
  );
}
