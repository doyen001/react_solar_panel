"use client";

import Image from "next/image";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useAppSelector } from "@/lib/store/hooks";
import {
  brandsOf,
  fetchBuilderCatalogue,
  modelsOf,
  type BuilderProduct,
  type BuilderProductCategory,
} from "@/lib/designs/catalogue";
import {
  batteryCapacityKwh,
  inverterRatedKw,
} from "@/lib/designs/product-specs";
import {
  DesignsSelectField,
  type DesignsSelectOption,
} from "./DesignsSelectField";

type SectionKey = "solarPanel" | "battery" | "equipment";

/** The third card is the inverter. */
const SECTION_CATEGORY: Record<SectionKey, BuilderProductCategory> = {
  solarPanel: "Solar Panel",
  battery: "Battery",
  equipment: "Inverter",
};

/** Panels advertise watts; batteries kWh; inverters rated kW. */
function ratingLabel(product: BuilderProduct): string {
  if (product.category === "Solar Panel") {
    return product.wattage ? `${product.wattage} W` : "—";
  }
  if (product.category === "Battery") {
    const kwh = batteryCapacityKwh({ quantity: 1, product });
    return kwh !== undefined ? `${kwh} kWh` : "—";
  }
  const kw = inverterRatedKw({ quantity: 1, product });
  return kw !== undefined ? `${kw} kW` : "—";
}

function cecApprovedLabel(product: BuilderProduct): string {
  const specs = product.specs;
  if (specs && typeof specs === "object" && !Array.isArray(specs)) {
    const approved = (specs as Record<string, unknown>).cecApproved;
    if (typeof approved === "boolean") return approved ? "Yes" : "No";
  }
  return "—";
}

type SpecLine = { label: string; value: string };
type SummarySpec = {
  imageSrc: string;
  imageWidth: number;
  imageHeight: number;
  imageAlt: string;
  leftCol: SpecLine[];
  rightCol: SpecLine[];
};

type ItemsSectionValue = {
  brand: string;
  /** Second dropdown: the chosen model, held as its catalogue id. */
  size: string;
  /** Catalogue id of the selected product; '' until one is picked. */
  productId: string;
  summary: SummarySpec;
};

export type DesignsItemsStepValue = {
  solarPanel: ItemsSectionValue;
  battery: ItemsSectionValue;
  equipment: ItemsSectionValue;
};

const DEFAULT_ITEMS_STEP_VALUE: DesignsItemsStepValue = {
  solarPanel: {
    brand: "",
    size: "",
    productId: "",
    summary: {
      imageSrc: "/images/designs/solarPanel.png",
      imageWidth: 67,
      imageHeight: 99,
      imageAlt: "",
      leftCol: [
        { label: "Brand -", value: "TRINA" },
        { label: "Model -", value: "9823829302" },
        { label: "Type -", value: "Mono Perc Bifacial" },
        { label: "CEC Approved -", value: "Yes" },
      ],
      rightCol: [
        { label: "Watts per Panel -", value: "630" },
        { label: "Number of Panels -", value: "32" },
      ],
    },
  },
  battery: {
    brand: "",
    size: "",
    productId: "",
    summary: {
      imageSrc: "/images/designs/battery.png",
      imageWidth: 57,
      imageHeight: 93,
      imageAlt: "",
      leftCol: [
        { label: "Brand -", value: "BLUETTI" },
        { label: "Model -", value: "9823829302" },
        { label: "Type -", value: "High voltage" },
        { label: "CEC Approved -", value: "Yes" },
      ],
      rightCol: [
        { label: "Watts per Panel -", value: "7.6 kW" },
        { label: "Number of Panels -", value: "8" },
      ],
    },
  },
  equipment: {
    brand: "",
    size: "",
    productId: "",
    summary: {
      imageSrc: "/images/designs/equipment.png",
      imageWidth: 47,
      imageHeight: 103,
      imageAlt: "",
      leftCol: [
        { label: "Brand -", value: "BLUETTI" },
        { label: "Model -", value: "9823829302" },
        { label: "Type -", value: "High voltage" },
        { label: "CEC Approved -", value: "Yes" },
      ],
      rightCol: [
        { label: "Watts per Panel -", value: "7.6 kW" },
        { label: "Number of Panels -", value: "8" },
      ],
    },
  },
};

/**
 * Figma 3:4448 — nested panel: 135px height, 10px radius, 2px #00b0f0 border,
 * gradient fill; inner row 309× centered, image 67×99 + 14px + text columns 119 / 111.
 */
function DesignsItemProductSummary({
  imageSrc,
  imageWidth,
  imageHeight,
  imageAlt,
  leftCol,
  rightCol,
}: {
  imageSrc: string;
  imageWidth: number;
  imageHeight: number;
  imageAlt: string;
  leftCol: SpecLine[];
  rightCol: SpecLine[];
}) {
  const [wattsRow, countRow] = rightCol.slice(0, 2);

  return (
    <div className="relative h-[135px] w-full shrink-0 overflow-clip rounded-[10px] border-2 border-solid border-design-accent-cyan bg-linear-to-r from-yellow-lemon to-orange-amber">
      {/* 67 + 244 = 311 at spec; Figma frame is 309px — use min width so columns keep 119/111 */}
      <div className="absolute left-[calc(50%-0.19px)] top-1/2 flex w-[min(311px,calc(100%-16px))] -translate-x-1/2 -translate-y-1/2 items-center justify-between">
        <div className="relative h-[99px] w-[67px] shrink-0 overflow-hidden">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={imageWidth}
            height={imageHeight}
            className="h-full w-full object-contain object-left"
            unoptimized
          />
        </div>
        <div className="flex shrink-0 gap-[14px]">
          <div className="flex h-[93px] w-[119px] flex-col gap-[14px] leading-0">
            {leftCol.map((row, i) => (
              <p
                key={row.label}
                className={
                  i === 0
                    ? "min-w-full w-min shrink-0 font-inter text-[10px] font-medium not-italic tracking-[-0.1504px] text-[#382bd6]"
                    : "shrink-0 whitespace-nowrap font-inter text-[10px] font-medium not-italic tracking-[-0.1504px] text-[#382bd6]"
                }
              >
                <span className="leading-normal">{row.label} </span>
                <span className="leading-normal text-[#121212]">
                  {row.value}
                </span>
              </p>
            ))}
          </div>
          <div className="flex w-[111px] shrink-0 flex-col items-end justify-center gap-[33px] leading-0">
            <div className="flex h-[42px] w-full flex-col items-end gap-[14px] whitespace-nowrap font-inter text-[10px] font-medium not-italic tracking-[-0.1504px] text-[#382bd6]">
              {wattsRow ? (
                <p className="shrink-0">
                  <span className="leading-normal">{wattsRow.label} </span>
                  <span className="leading-normal text-[#020202]">
                    {wattsRow.value}
                  </span>
                </p>
              ) : null}
              {countRow ? (
                <p className="shrink-0">
                  <span className="leading-normal">{countRow.label} </span>
                  <span className="leading-normal text-[#020202]">
                    {countRow.value}
                  </span>
                </p>
              ) : null}
            </div>
            <div className="flex shrink-0 gap-[2px]">
              <div className="flex items-center justify-center pb-[2px]">
                <p className="font-inter text-[9px] font-medium uppercase leading-normal tracking-[-0.0714px] text-[#080808]">
                  Datasheet
                </p>
              </div>
              <div className="relative size-[18px] shrink-0" aria-hidden>
                <svg
                  viewBox="0 0 24 24"
                  width={18}
                  height={18}
                  className="block size-full"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 3v12m0 0l4-4m-4 4l-4-4M5 19h14"
                    stroke="#2094F3"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DesignsItemsGradientCard({
  title,
  firstSelectId,
  secondSelectId,
  brand,
  size,
  brandOptions,
  modelOptions,
  modelPlaceholder = "Select Model",
  onBrandChange,
  onSizeChange,
  summary,
}: {
  title: string;
  firstSelectId: string;
  secondSelectId: string;
  brand: string;
  size: string;
  /** Catalogue-driven, so the selection maps to a real product. */
  brandOptions: DesignsSelectOption[];
  modelOptions: DesignsSelectOption[];
  modelPlaceholder?: string;
  onBrandChange: (value: string) => void;
  onSizeChange: (value: string) => void;
  summary: React.ReactNode;
}) {
  return (
    <div className="designs-border-gradient z-10 rounded-[30px] min-w-0 max-w-[398.013px] w-full p-[3px]">
      <div className="flex min-h-[353.565px] z-20 w-full shrink-0 flex-col rounded-[30px] bg-linear-to-r from-[#FFEF62] to-[#F78D00]">
        <div className="flex w-full flex-col gap-[14px] px-[28.98px] pb-[28.98px] pt-[25.98px]">
          <div className="flex w-full flex-col gap-[16px]">
            <h2 className="w-full text-center font-source-sans text-[24px] font-bold capitalize leading-normal tracking-[0.167px] text-white">
              {title}
            </h2>
            <div className="flex w-full flex-col gap-[8px]">
              <DesignsSelectField
                id={firstSelectId}
                ariaLabel={`${title}: select brand`}
                placeholder="Select Brand"
                value={brand}
                onChange={onBrandChange}
                options={brandOptions}
              />
              <DesignsSelectField
                id={secondSelectId}
                ariaLabel={`${title}: select model`}
                placeholder={modelPlaceholder}
                value={size}
                onChange={onSizeChange}
                options={modelOptions}
              />
            </div>
          </div>
          {summary}
        </div>
      </div>
    </div>
  );
}

export type DesignsItemsStepHandle = {
  getValues: () => DesignsItemsStepValue;
};

type ItemsSection = DesignsItemsStepValue[keyof DesignsItemsStepValue];

/**
 * Overlays a saved product onto one card. Row 0 of each column is what
 * `DesignsHeroSection` reads back into Redux, so those rows must carry the real
 * values. The brand/model selects stay empty here — they are resolved from the
 * catalogue once it loads, since only a product id can match reliably.
 */
function seedSection(
  section: ItemsSection,
  name: string | undefined,
  size: string | undefined,
  count?: string,
  productId?: string,
): ItemsSection {
  if (!name && !size && !count && !productId) return section;

  return {
    ...section,
    productId: productId ?? section.productId,
    summary: {
      ...section.summary,
      leftCol: section.summary.leftCol.map((row, index) =>
        index === 0 && name ? { ...row, value: name } : row,
      ),
      rightCol: section.summary.rightCol.map((row, index) => {
        if (index === 0 && size) return { ...row, value: size };
        if (index === 1 && count) return { ...row, value: count };
        return row;
      }),
    },
  };
}

function seedItemsValue(equipment: {
  solarPanelName?: string;
  solarPanelWatts?: string;
  solarPanelProductId?: string;
  batteryName?: string;
  batteryWatts?: string;
  batteryProductId?: string;
  inverterName?: string;
  inverterWatts?: string;
  inverterProductId?: string;
  numberOfPanels?: string;
}): DesignsItemsStepValue {
  return {
    solarPanel: seedSection(
      DEFAULT_ITEMS_STEP_VALUE.solarPanel,
      equipment.solarPanelName,
      equipment.solarPanelWatts,
      equipment.numberOfPanels,
      equipment.solarPanelProductId,
    ),
    battery: seedSection(
      DEFAULT_ITEMS_STEP_VALUE.battery,
      equipment.batteryName,
      equipment.batteryWatts,
      undefined,
      equipment.batteryProductId,
    ),
    // The third card is the inverter.
    equipment: seedSection(
      DEFAULT_ITEMS_STEP_VALUE.equipment,
      equipment.inverterName,
      equipment.inverterWatts,
      undefined,
      equipment.inverterProductId,
    ),
  };
}

/**
 * Figma Screen 18 (3:4410) — three gradient cards, 45px gap; inner padding 28.98 / 25.98.
 */
export const DesignsItemsStepContent = forwardRef<
  DesignsItemsStepHandle,
  object
>(function DesignsItemsStepContent(_, ref) {
  // Seed from the store so editing an existing design shows its real equipment
  // instead of the placeholder specs.
  const storedEquipment = useAppSelector((s) => s.designProposal.equipment);
  const [itemsValue, setItemsValue] = useState(() =>
    seedItemsValue(storedEquipment),
  );

  // The real catalogue backs both dropdowns, so a selection yields a product id
  // the save can persist as a DesignProduct row.
  const [catalogue, setCatalogue] = useState<
    Record<SectionKey, BuilderProduct[]>
  >({ solarPanel: [], battery: [], equipment: [] });

  /** Captured once: the fetch must not re-run as the customer changes selection. */
  const [pinnedProductIds] = useState(() =>
    [
      storedEquipment.solarPanelProductId,
      storedEquipment.inverterProductId,
      storedEquipment.batteryProductId,
    ].filter((id): id is string => Boolean(id)),
  );

  useEffect(() => {
    let cancelled = false;

    // One request for all three categories, pinning whatever this design
    // already has so those options exist and can show as selected.
    void fetchBuilderCatalogue(pinnedProductIds)
      .then((grouped) => {
        if (cancelled) return;
        setCatalogue({
          solarPanel: grouped[SECTION_CATEGORY.solarPanel],
          battery: grouped[SECTION_CATEGORY.battery],
          equipment: grouped[SECTION_CATEGORY.equipment],
        });
      })
      .catch(() => {
        // Non-fatal: the dropdowns simply offer no options.
      });

    return () => {
      cancelled = true;
    };
  }, [pinnedProductIds]);

  /**
   * What the two selects show. Derived rather than synced into state: a card
   * seeded from a saved design knows only its product id, and resolving that
   * against the catalogue at render time avoids a setState-in-effect cascade.
   * Only a product id can match reliably — a stored display name like
   * "AE Solar GmbH AE400MD-108" is not a catalogue key.
   */
  const selectionFor = (key: SectionKey) => {
    const section = itemsValue[key];
    if (section.brand) return { brand: section.brand, size: section.size };

    const product = catalogue[key].find((item) => item.id === section.productId);
    return product
      ? { brand: product.brand, size: product.id }
      : { brand: "", size: "" };
  };

  useImperativeHandle(
    ref,
    () => ({
      getValues: () => itemsValue,
    }),
    [itemsValue],
  );

  /**
   * Brand change clears the model: the previously chosen product belongs to the
   * old brand, and keeping its id would silently save the wrong equipment.
   */
  const handleBrandChange = (key: SectionKey, brand: string) => {
    setItemsValue((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        brand,
        size: "",
        productId: "",
        summary: {
          ...prev[key].summary,
          leftCol: prev[key].summary.leftCol.map((row, i) =>
            i === 0 ? { ...row, value: brand } : row,
          ),
        },
      },
    }));
  };

  /** Model change is the real selection — it fixes the product id and specs. */
  const handleModelChange = (key: SectionKey, productId: string) => {
    const product = catalogue[key].find((item) => item.id === productId);

    setItemsValue((prev) => {
      const section = prev[key];
      if (!product) {
        return { ...prev, [key]: { ...section, size: productId, productId } };
      }

      const rating = ratingLabel(product);

      return {
        ...prev,
        [key]: {
          ...section,
          size: productId,
          productId,
          summary: {
            ...section.summary,
            leftCol: section.summary.leftCol.map((row, i) => {
              if (i === 0) return { ...row, value: product.brand };
              if (i === 1) return { ...row, value: product.name };
              if (i === 3) {
                return { ...row, value: cecApprovedLabel(product) };
              }
              return row;
            }),
            rightCol: section.summary.rightCol.map((row, i) =>
              i === 0 ? { ...row, value: rating } : row,
            ),
          },
        },
      };
    });
  };

  const optionsFor = (key: SectionKey) => {
    const products = catalogue[key];
    const { brand } = selectionFor(key);
    return {
      brandOptions: brandsOf(products).map((value) => ({
        value,
        label: value,
      })),
      modelOptions: modelsOf(products, brand).map((product) => ({
        value: product.id,
        label: product.name,
      })),
    };
  };

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-[1446px] flex-1 flex-col px-4 pt-8 sm:px-8 sm:pt-10 lg:px-[81px] lg:pt-[37px]">
      <div className="flex w-full flex-col items-center justify-center gap-[45px] lg:flex-row lg:items-start lg:justify-center">
        <DesignsItemsGradientCard
          title="Select Solar Panels"
          firstSelectId="items-solar-brand"
          secondSelectId="items-solar-size"
          brand={selectionFor("solarPanel").brand}
          size={selectionFor("solarPanel").size}
          brandOptions={optionsFor("solarPanel").brandOptions}
          modelOptions={optionsFor("solarPanel").modelOptions}
          onBrandChange={(next) => handleBrandChange("solarPanel", next)}
          onSizeChange={(next) => handleModelChange("solarPanel", next)}
          summary={
            <DesignsItemProductSummary
              imageSrc={itemsValue.solarPanel.summary.imageSrc}
              imageWidth={itemsValue.solarPanel.summary.imageWidth}
              imageHeight={itemsValue.solarPanel.summary.imageHeight}
              imageAlt={itemsValue.solarPanel.summary.imageAlt}
              leftCol={itemsValue.solarPanel.summary.leftCol}
              rightCol={itemsValue.solarPanel.summary.rightCol}
            />
          }
        />
        <DesignsItemsGradientCard
          title="Select Battery"
          firstSelectId="items-battery-brand"
          secondSelectId="items-battery-size"
          brand={selectionFor("battery").brand}
          size={selectionFor("battery").size}
          brandOptions={optionsFor("battery").brandOptions}
          modelOptions={optionsFor("battery").modelOptions}
          onBrandChange={(next) => handleBrandChange("battery", next)}
          onSizeChange={(next) => handleModelChange("battery", next)}
          summary={
            <DesignsItemProductSummary
              imageSrc={itemsValue.battery.summary.imageSrc}
              imageWidth={itemsValue.battery.summary.imageWidth}
              imageHeight={itemsValue.battery.summary.imageHeight}
              imageAlt={itemsValue.battery.summary.imageAlt}
              leftCol={itemsValue.battery.summary.leftCol}
              rightCol={itemsValue.battery.summary.rightCol}
            />
          }
        />
        <DesignsItemsGradientCard
          title="Select Equipment"
          firstSelectId="items-equipment-brand"
          secondSelectId="items-equipment-size"
          brand={selectionFor("equipment").brand}
          size={selectionFor("equipment").size}
          brandOptions={optionsFor("equipment").brandOptions}
          modelOptions={optionsFor("equipment").modelOptions}
          onBrandChange={(next) => handleBrandChange("equipment", next)}
          onSizeChange={(next) => handleModelChange("equipment", next)}
          summary={
            <DesignsItemProductSummary
              imageSrc={itemsValue.equipment.summary.imageSrc}
              imageWidth={itemsValue.equipment.summary.imageWidth}
              imageHeight={itemsValue.equipment.summary.imageHeight}
              imageAlt={itemsValue.equipment.summary.imageAlt}
              leftCol={itemsValue.equipment.summary.leftCol}
              rightCol={itemsValue.equipment.summary.rightCol}
            />
          }
        />
      </div>
    </div>
  );
});
