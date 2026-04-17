"use client";

import { useEffect, useState } from "react";
import { DesignTopBar } from "../modules/DesignTopBar";
import {
  DESIGNS_PROPERTY_TYPES,
  type DesignsMapLocation,
} from "@/utils/constant";
import { DesignsRegisterStepContent } from "./components/DesignsAddressStepContent";
import { DesignsLocationStepContent } from "./components/DesignsLocationStepContent";
import { DesignsHeroBackground } from "./components/DesignsHeroBackground";
import { DesignsHeroFooter } from "./components/DesignsHeroFooter";
import { DesignsHeadlineBanner } from "./components/DesignsHeadlineBanner";
import { DesignsHeroImagePanel } from "./components/DesignsHeroImagePanel";
import { DesignsSolarPanelStepContent } from "./components/DesignsSolarPanelStepContent";
import { DesignsEnergyStepContent } from "./components/DesignsEnergyStepContent";
import { DesignsItemsStepContent } from "./components/DesignsItemsStepContent";
import { DesignsProposalStepContent } from "./components/DesignsProposalStepContent";
import { DesignsHeroTagline } from "./components/DesignsHeroTagline";
import { DesignsPropertyTypeCard } from "./components/DesignsPropertyTypeCard";
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
    | "start"
    | "second"
    | "register"
    | "address"
    | "solarPanel"
    | "energy"
    | "items"
    | "proposal"
    | "end"
  >("proposal");
  const [fillPercent, setFillPercent] = useState(10);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedLocation, setSelectedLocation] =
    useState<DesignsMapLocation | null>(null);

  const progressByScreen = {
    start: 10,
    second: 20,
    register: 30,
    address: 40,
    solarPanel: 50,
    energy: 60,
    items: 70,
    proposal: 80,
    end: 90,
  } satisfies Record<
    | "start"
    | "second"
    | "register"
    | "address"
    | "solarPanel"
    | "energy"
    | "items"
    | "proposal"
    | "end",
    number
  >;

  useEffect(() => {
    console.log("activeScreen", activeScreen);
  }, [activeScreen]);

  const onNext = () => {
    setActiveScreen((prev) => {
      if (prev === "start") return "second";
      if (prev === "second") return "register";
      if (prev === "register") return "address";
      if (prev === "address") return "solarPanel";
      if (prev === "solarPanel") return "energy";
      if (prev === "energy") return "items";
      if (prev === "items") return "proposal";
      if (prev === "proposal") return "end";
      return prev;
    });
    setFillPercent((prev) => {
      if (prev === 10) return 30;
      if (prev === 30) return 60;
      if (prev === 60) return 70;
      if (prev === 70) return 80;
      if (prev === 80) return 90;
      return prev;
    });
  };

  const onBack = () => {
    setActiveScreen((prev) => {
      const nextScreen =
        prev === "end"
          ? "proposal"
          : prev === "proposal"
            ? "items"
            : prev === "items"
              ? "energy"
              : prev === "energy"
                ? "solarPanel"
                : prev === "solarPanel"
                  ? "address"
                  : prev === "address"
                    ? "register"
                    : prev === "register"
                      ? "second"
                      : prev === "second"
                        ? "start"
                        : prev;

      setFillPercent(progressByScreen[nextScreen]);
      return nextScreen;
    });
  };

  return (
    <section className="relative flex min-h-dvh flex-col overflow-hidden">
      <DesignsHeroBackground />
      <DesignTopBar />
      <div className="flex items-center flex-1">
        {activeScreen === "start" ? (
          <div className="relative z-10 mx-auto flex w-full max-w-[1446px] flex-col gap-[29px] px-4 pt-24 sm:px-8 sm:pt-28 lg:px-[81px] lg:pt-[155px]">
            <div className="flex w-full max-w-[1283px] flex-col items-stretch gap-5 lg:flex-row">
              <DesignsSavingsPromoCard className="lg:w-[629px]" />
              <DesignsHeroImagePanel className="lg:w-[634px]" />
            </div>
            <DesignsHeroTagline />
          </div>
        ) : activeScreen === "second" ? (
          <div className="relative z-10 mx-auto flex w-full max-w-[1446px] flex-1 flex-col gap-[36px] px-4 pt-10 sm:px-8 sm:pt-12 lg:px-[81px] lg:pt-[37px]">
            <DesignsHeadlineBanner />
            <div className="flex w-full max-w-[1278px] flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-[29px]">
              {DESIGNS_PROPERTY_TYPES.map((propertyType) => (
                <DesignsPropertyTypeCard
                  key={propertyType.id}
                  imageSrc={propertyType.imageSrc}
                  imageAlt={propertyType.imageAlt}
                  label={propertyType.label}
                />
              ))}
            </div>
          </div>
        ) : activeScreen === "register" ? (
          <DesignsRegisterStepContent />
        ) : activeScreen === "address" ? (
          <DesignsLocationStepContent
            selectedAddress={selectedAddress}
            selectedLocation={selectedLocation}
            onAddressChange={setSelectedAddress}
            onLocationChange={setSelectedLocation}
          />
        ) : activeScreen === "solarPanel" ? (
          <DesignsSolarPanelStepContent selectedLocation={selectedLocation} />
        ) : activeScreen === "energy" ? (
          <DesignsEnergyStepContent />
        ) : activeScreen === "items" ? (
          <DesignsItemsStepContent />
        ) : activeScreen === "proposal" ? (
          <DesignsProposalStepContent address={selectedAddress} />
        ) : activeScreen === "end" ? (
          <></>
        ) : (
          <></>
        )}
      </div>

      <DesignsHeroFooter
        onBack={onBack}
        onNext={onNext}
        showBack={activeScreen !== "start"}
        showNext={showNext}
        fillPercent={fillPercent}
      />
    </section>
  );
}
