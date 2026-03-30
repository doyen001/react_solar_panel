"use client";

import { useState } from "react";
import { DesignTopBar } from "../modules/DesignTopBar";
import { DesignsHeroBackground } from "./components/DesignsHeroBackground";
import { DesignsHeroFooter } from "./components/DesignsHeroFooter";
import { DesignsHeroImagePanel } from "./components/DesignsHeroImagePanel";
import { DesignsHeroTagline } from "./components/DesignsHeroTagline";
import { DesignsSavingsPromoCard } from "./components/DesignsSavingsPromoCard";

type DesignsHeroSectionProps = {
  showNext?: boolean;
};

/**
 * Designs flow hero — dual cards + tagline + progress (optional Next).
 */
export function DesignsHeroSection({
  showNext = true,
}: DesignsHeroSectionProps) {
  const [activeScreen, setActiveScreen] = useState<
    "start" | "second" | "address" | "end"
  >("start");
  const [fillPercent, setFillPercent] = useState(10);
  const onNext = () => {
    setActiveScreen((prev) => {
      if (prev === "start") return "second";
      if (prev === "second") return "address";
      if (prev === "address") return "end";
      return prev;
    });
    setFillPercent((prev) => {
      if (prev === 10) return 30;
      if (prev === 30) return 60;
      if (prev === 60) return 90;
      return prev;
    });
  };

  return (
    <section className="relative flex min-h-dvh flex-col overflow-hidden">
      <DesignsHeroBackground />
      <DesignTopBar />
      {activeScreen === "start" ? (
        <div className="relative z-10 mx-auto flex w-full max-w-[1446px] flex-1 flex-col gap-[29px] px-4 pt-24 sm:px-8 sm:pt-28 lg:px-[81px] lg:pt-[155px]">
          <div className="flex w-full max-w-[1283px] flex-col items-stretch gap-5 lg:flex-row">
            <DesignsSavingsPromoCard className="lg:w-[629px]" />
            <DesignsHeroImagePanel className="lg:w-[634px]" />
          </div>
          <DesignsHeroTagline />
        </div>
      ) : (
        <></>
      )}

      <DesignsHeroFooter
        onNext={onNext}
        showNext={showNext}
        fillPercent={fillPercent}
      />
    </section>
  );
}
