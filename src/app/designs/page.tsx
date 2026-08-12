import { Suspense } from "react";
import { DesignsHeroSection } from "@/components/designs/DesignsHeroSection";

export default function DesignsPage() {
  return (
    <main className="overflow-x-hidden">
      {/*
        The builder reads `?designId=` to switch between create and update mode,
        so it needs a Suspense boundary for static rendering.
      */}
      <Suspense fallback={null}>
        <DesignsHeroSection />
      </Suspense>
    </main>
  );
}
