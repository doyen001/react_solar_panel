import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/pages/reset-password/ResetPasswordForm";
import { FooterSection } from "@/components/modules/LandingFooter";
import { Header } from "@/components/modules/LandingHero";

export default function ResetPasswordPage() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen items-center justify-center bg-solar-gold px-4 py-24">
        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>
      </main>
      <FooterSection showReadyToControlCta={false} />
    </>
  );
}
