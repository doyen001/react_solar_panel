import { ForgotPasswordForm } from "@/components/pages/forgot-password/ForgotPasswordForm";
import { FooterSection } from "@/components/modules/LandingFooter";
import { Header } from "@/components/modules/LandingHero";

export default function ForgotPasswordPage() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen items-center justify-center bg-solar-gold px-4 py-24">
        <ForgotPasswordForm />
      </main>
      <FooterSection showReadyToControlCta={false} />
    </>
  );
}
