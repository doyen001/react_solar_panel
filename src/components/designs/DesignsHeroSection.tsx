"use client";

import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  mergeProposalData,
  selectDesignProposal,
} from "@/lib/store/designProposalSlice";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  designToProposalPayload,
  fetchCustomDesign,
  fetchDesignById,
} from "@/lib/customers/custom-design";
import { fetchCustomerProfile } from "@/lib/customers/profile";
import { setUser } from "@/lib/store/customerAuthSlice";
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
  const customerUser = useAppSelector((s) => s.customerAuth.user);
  const searchParams = useSearchParams();
  const editingDesignId = searchParams.get("designId");

  /**
   * Load the design being edited.
   *
   * `?designId=` is set when the customer arrives from their design page, so
   * the builder edits exactly the design shown there — which may be a
   * materialised package, not only their custom one. Without it we fall back to
   * their custom design. Runs once per visit; failures are silent because the
   * builder must still work for anonymous lead-gen visitors.
   */
  const hydratedRef = useRef(false);
  // The step components seed their local state from the store on mount, so they
  // must not mount until hydration has landed — otherwise they capture the
  // blank defaults and the customer sees empty placeholders.
  //
  // Gated on the URL param, not on `customerUser`: auth is restored in a
  // layout effect, so the user is still null during the first render and a
  // user-based gate would open before the design had loaded.
  const [hydrating, setHydrating] = useState(Boolean(editingDesignId));

  // Deliberately no cancellation flag. This effect re-runs when auth arrives,
  // and `hydratedRef` makes that second run a no-op — so a per-run flag would
  // let the first run's cleanup cancel the only in-flight request and leave
  // `hydrating` stuck on forever. Settling unconditionally is safe: a setState
  // after unmount is a no-op in React 18+, and the store is global.
  useEffect(() => {
    if (hydratedRef.current) return;
    // Editing is driven by the URL; the custom-design fallback needs the user.
    if (!editingDesignId && !customerUser) return;
    hydratedRef.current = true;

    // Redux auth lives in sessionStorage, so a fresh tab or a direct link to
    // this page has no user even though the cookie still authenticates. Recover
    // it, or anything gated on being signed in — the save button, writing
    // contact changes back to the account — silently disappears.
    if (editingDesignId && !customerUser) {
      void fetchCustomerProfile().then((profile) => {
        if (profile) dispatch(setUser(profile));
      });
    }

    const load = editingDesignId
      ? fetchDesignById(editingDesignId)
      : fetchCustomDesign();

    void load
      .then((design) => {
        if (!design) return;
        const payload = designToProposalPayload(design);
        if (payload) dispatch(mergeProposalData(payload));
      })
      .catch(() => {
        // Non-fatal: fall back to the default proposal state.
      })
      .finally(() => setHydrating(false));
  }, [customerUser, dispatch, editingDesignId]);

  const [activeScreen, setActiveScreen] = useState<
    | "start"
    | "second"
    | "register"
    | "address"
    | "solarPanel"
    | "energy"
    | "items"
    | "proposal"
  >(
    // Update mode opens on the first data step: the marketing intro has nothing
    // to show someone who is here to change an existing design.
    editingDesignId ? "register" : "start",
  );
  const [fillPercent, setFillPercent] = useState(editingDesignId ? 30 : 10);

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
              billPeriod: e.billPeriod,
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
              // Carried so the save can write real DesignProduct rows; the
              // display strings above cannot identify a catalogue product.
              solarPanelProductId: itemsValues.solarPanel.productId,
              batteryProductId: itemsValues.battery.productId,
              inverterProductId: itemsValues.equipment.productId,
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

      {/*
        Two modes: anonymous visitors from the landing page create a new design,
        while a customer arriving from their design page updates that one.
      */}
      {/*
        Keyed off the URL only. Branching on `customerUser` here caused a
        hydration mismatch: auth is restored in a layout effect, so it is null in
        the server HTML and set on the client.
      */}
      {editingDesignId ? (
        <div className="relative z-10 mx-auto w-full max-w-[1446px] px-4 pt-3 sm:px-8 lg:px-[81px]">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-[14px] border-[1.5px] border-solid border-design-accent-cyan bg-[rgba(255,255,255,0.08)] px-4 py-2.5">
            <p className="font-source-sans text-[14px] leading-[21px] text-white/80">
              Editing your saved design. Your details and equipment are filled in
              below — finish the steps and save to update it.
            </p>
            <Link
              href="/customers/design"
              className="font-source-sans text-[13px] font-medium uppercase tracking-[0.5px] text-white underline"
            >
              Cancel
            </Link>
          </div>
        </div>
      ) : null}

      <div className="flex items-center flex-1">
        {hydrating ? (
          <p className="relative z-10 mx-auto px-4 font-source-sans text-[16px] text-white/80">
            Loading your design…
          </p>
        ) : activeScreen === "start" ? (
          <div className="relative z-10 mx-auto flex w-full max-w-[1446px] flex-col gap-[29px] px-4 pt-8 sm:px-8 lg:px-[81px]">
            <div className="flex w-full max-w-[1283px] flex-col items-stretch gap-5 lg:flex-row">
              <DesignsSavingsPromoCard className="lg:w-[629px]" />
              <DesignsHeroImagePanel className="lg:w-[634px]" />
            </div>
            <DesignsHeroTagline />
          </div>
        ) : activeScreen === "second" ? (
          <DesignsPropertyStepContent ref={propertyStepRef} />
        ) : activeScreen === "register" ? (
          <DesignsRegisterStepContent
            ref={registerStepRef}
            lockEmail={Boolean(editingDesignId)}
          />
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
