"use client";

import { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  mergeProposalData,
  selectDesignProposal,
} from "@/lib/store/designProposalSlice";
import { DesignTopBar } from "../modules/DesignTopBar";
import {
  DesignsRegisterStepContent,
  type DesignsRegisterStepHandle,
} from "./components/DesignsAddressStepContent";
import {
  DesignsPropertyStepContent,
  type DesignsPropertyStepHandle,
} from "./components/DesignsPropertyStepContent";
import {
  DesignsLocationStepContent,
  type DesignsLocationStepHandle,
} from "./components/DesignsLocationStepContent";
import { DesignsHeroBackground } from "./components/DesignsHeroBackground";
import { DesignsHeroFooter } from "./components/DesignsHeroFooter";
import { DesignsHeroImagePanel } from "./components/DesignsHeroImagePanel";
import {
  DesignsSolarPanelStepContent,
  type DesignsSolarPanelStepHandle,
} from "./components/DesignsSolarPanelStepContent";
import {
  DesignsEnergyStepContent,
  type DesignsEnergyStepHandle,
} from "./components/DesignsEnergyStepContent";
import {
  DesignsItemsStepContent,
  type DesignsItemsStepHandle,
} from "./components/DesignsItemsStepContent";
import { DesignsProposalStepContent } from "./components/DesignsProposalStepContent";
import { DesignsHeroTagline } from "./components/DesignsHeroTagline";
import { DesignsSavingsPromoCard } from "./components/DesignsSavingsPromoCard";

type DesignsHeroSectionProps = {
  showNext?: boolean;
};

/**
 * Designs flow hero — dual cards + tagline + progress (optional Next).
 * Step UIs keep local state; Redux merges on Next via step refs.
 */
export function DesignsHeroSection({
  showNext = true,
}: DesignsHeroSectionProps) {
  const dispatch = useAppDispatch();
  const proposal = useAppSelector(selectDesignProposal);

  const [activeScreen, setActiveScreen] = useState<
    | "start"
    | "second"
    | "register"
    | "address"
    | "solarPanel"
    | "energy"
    | "items"
    | "proposal"
  >("start");
  const [fillPercent, setFillPercent] = useState(10);

  const registerStepRef = useRef<DesignsRegisterStepHandle>(null);
  const propertyStepRef = useRef<DesignsPropertyStepHandle>(null);
  const locationStepRef = useRef<DesignsLocationStepHandle>(null);
  const solarStepRef = useRef<DesignsSolarPanelStepHandle>(null);
  const energyStepRef = useRef<DesignsEnergyStepHandle>(null);
  const itemsStepRef = useRef<DesignsItemsStepHandle>(null);

  const progressByScreen = {
    start: 10,
    second: 20,
    register: 30,
    address: 40,
    solarPanel: 50,
    energy: 70,
    items: 80,
    proposal: 100,
  } satisfies Record<
    | "start"
    | "second"
    | "register"
    | "address"
    | "solarPanel"
    | "energy"
    | "items"
    | "proposal",
    number
  >;

  const onNext = () => {
    if (activeScreen === "register") {
      const register = registerStepRef.current?.getValues();
      if (register) {
        dispatch(
          mergeProposalData({
            customer: {
              name: register.name,
              email: register.email,
              phoneNumber: register.phone,
            },
          }),
        );
      }
    }
    if (activeScreen === "second") {
      const property = propertyStepRef.current?.getValues();
      if (property) {
        dispatch(
          mergeProposalData({
            customer: {
              property: property.propertyLabel,
            },
          }),
        );
      }
    }
    if (activeScreen === "address") {
      const loc = locationStepRef.current?.getValues();
      if (loc) {
        const pin: Partial<{
          mapLat: number;
          mapLng: number;
        }> =
          loc.location != null
            ? {
                mapLat: loc.location.lat,
                mapLng: loc.location.lng,
              }
            : {};
        dispatch(
          mergeProposalData({
            customer: {
              address: loc.address || "42 Bondi Rd, Bondi, NSW 2026",
              ...pin,
            },
          }),
        );
      }
    }
    if (activeScreen === "solarPanel") {
      solarStepRef.current?.persistDesignToStore();
      const m = solarStepRef.current?.getMetrics();
      if (m) {
        dispatch(
          mergeProposalData({
            summary: {
              systemSize: m.systemSize,
              totalPanels: m.totalPanels,
            },
            equipment: {
              numberOfPanels: m.numberOfPanels,
              co2Offset: m.co2Offset,
            },
          }),
        );
      }
    }
    if (activeScreen === "energy") {
      const e = energyStepRef.current?.getValues();
      if (e) {
        dispatch(
          mergeProposalData({
            summary: {
              yearlySavings: e.yearlySavings,
              payback: e.payback,
            },
            pricing: {
              currentBill: e.currentBill,
              monthlySavings: e.monthlySavings,
              newBill: e.newBill,
            },
          }),
        );
      }
    }
    if (activeScreen === "items") {
      const itemsValues = itemsStepRef.current?.getValues();
      if (itemsValues) {
        const solarPanelName =
          itemsValues.solarPanel.summary.leftCol[0]?.value || "TRINA";
        const solarPanelWatts =
          itemsValues.solarPanel.summary.rightCol[0]?.value || "630 W";
        const inverterName =
          itemsValues.equipment.summary.leftCol[0]?.value || "BLUETTI";
        const inverterWatts =
          itemsValues.equipment.summary.rightCol[0]?.value || "7.6 kW";
        const batteryName =
          itemsValues.battery.summary.leftCol[0]?.value || "BLUETTI";
        const batteryWatts =
          itemsValues.battery.summary.rightCol[0]?.value || "7.6 kW";

        dispatch(
          mergeProposalData({
            equipment: {
              solarPanelName,
              solarPanelWatts,
              inverterName,
              inverterWatts,
              batteryName,
              batteryWatts,
              numberOfPanels:
                itemsValues.solarPanel.summary.rightCol[1]?.value ||
                proposal.equipment.numberOfPanels,
            },
          }),
        );
      }
    }

    setActiveScreen((prev) => {
      if (prev === "start") return "second";
      if (prev === "second") return "register";
      if (prev === "register") return "address";
      if (prev === "address") return "solarPanel";
      if (prev === "solarPanel") return "energy";
      if (prev === "energy") return "items";
      if (prev === "items") return "proposal";
      return prev;
    });
    setFillPercent((prev) => {
      if (prev === 10) return 20;
      if (prev === 20) return 30;
      if (prev === 30) return 40;
      if (prev === 40) return 50;
      if (prev === 50) return 70;
      if (prev === 70) return 80;
      if (prev === 80) return 100;
      return prev;
    });
  };

  const onBack = () => {
    setActiveScreen((prev) => {
      const nextScreen =
        prev === "proposal"
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
          <DesignsPropertyStepContent ref={propertyStepRef} />
        ) : activeScreen === "register" ? (
          <DesignsRegisterStepContent ref={registerStepRef} />
        ) : activeScreen === "address" ? (
          <DesignsLocationStepContent ref={locationStepRef} />
        ) : activeScreen === "solarPanel" ? (
          <DesignsSolarPanelStepContent ref={solarStepRef} />
        ) : activeScreen === "energy" ? (
          <DesignsEnergyStepContent ref={energyStepRef} />
        ) : activeScreen === "items" ? (
          <DesignsItemsStepContent ref={itemsStepRef} />
        ) : activeScreen === "proposal" ? (
          <DesignsProposalStepContent />
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
