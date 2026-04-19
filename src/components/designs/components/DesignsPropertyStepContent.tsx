"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import {
  DESIGNS_PROPERTY_TYPES,
  type DesignsPropertyType,
} from "@/utils/constant";
import { DesignsHeadlineBanner } from "./DesignsHeadlineBanner";
import { DesignsPropertyTypeCard } from "./DesignsPropertyTypeCard";

export type DesignsPropertyStepHandle = {
  getValues: () => { propertyLabel: string };
};

/**
 * Property-type selection (“second” screen): local selection, Redux on Next via ref.
 */
export const DesignsPropertyStepContent = forwardRef<
  DesignsPropertyStepHandle,
  object
>(function DesignsPropertyStepContent(_, ref) {
  const [selectedPropertyId, setSelectedPropertyId] =
    useState<DesignsPropertyType["id"]>("residential");

  useImperativeHandle(ref, () => ({
    getValues: () => ({
      propertyLabel:
        DESIGNS_PROPERTY_TYPES.find((item) => item.id === selectedPropertyId)
          ?.label ?? "Residential",
    }),
  }));

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-[1446px] flex-1 flex-col gap-[36px] px-4 pt-10 sm:px-8 sm:pt-12 lg:px-[81px] lg:pt-[37px]">
      <DesignsHeadlineBanner />
      <div className="flex w-full max-w-[1278px] flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-[29px]">
        {DESIGNS_PROPERTY_TYPES.map((propertyType) => (
          <DesignsPropertyTypeCard
            key={propertyType.id}
            imageSrc={propertyType.imageSrc}
            imageAlt={propertyType.imageAlt}
            label={propertyType.label}
            selected={propertyType.id === selectedPropertyId}
            onClick={() => setSelectedPropertyId(propertyType.id)}
          />
        ))}
      </div>
    </div>
  );
});
