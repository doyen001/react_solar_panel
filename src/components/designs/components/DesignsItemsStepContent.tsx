"use client";

import Image from "next/image";
import { useState } from "react";
import {
  DesignsSelectField,
  type DesignsSelectOption,
} from "./DesignsSelectField";

const BRAND_OPTIONS: DesignsSelectOption[] = [
  { value: "trina", label: "TRINA" },
  { value: "bluetti", label: "BLUETTI" },
];

const PANEL_SIZE_OPTIONS: DesignsSelectOption[] = [
  { value: "630", label: "630 W" },
  { value: "400", label: "400 W" },
];

type SpecLine = { label: string; value: string };

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
    <div className="relative h-[135px] w-full shrink-0 overflow-clip rounded-[10px] border-2 border-solid border-[#00b0f0] bg-gradient-to-r from-[#ffef62] to-[#f78d00]">
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
          <div className="flex h-[93px] w-[119px] flex-col gap-[14px] leading-[0]">
            {leftCol.map((row, i) => (
              <p
                key={row.label}
                className={
                  i === 0
                    ? "min-w-full w-[min-content] shrink-0 font-inter text-[10px] font-medium not-italic tracking-[-0.1504px] text-[#382bd6]"
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
          <div className="flex w-[111px] shrink-0 flex-col items-end justify-center gap-[33px] leading-[0]">
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
  summary,
}: {
  title: string;
  firstSelectId: string;
  secondSelectId: string;
  summary: React.ReactNode;
}) {
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState("");

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
                onChange={setBrand}
                options={BRAND_OPTIONS}
              />
              <DesignsSelectField
                id={secondSelectId}
                ariaLabel={`${title}: select panel size`}
                placeholder="Select Panel Size"
                value={size}
                onChange={setSize}
                options={PANEL_SIZE_OPTIONS}
              />
            </div>
          </div>
          {summary}
        </div>
      </div>
    </div>
  );
}

/**
 * Figma Screen 18 (3:4410) — three gradient cards, 45px gap; inner padding 28.98 / 25.98.
 */
export function DesignsItemsStepContent() {
  return (
    <div className="relative z-10 mx-auto flex w-full max-w-[1446px] flex-1 flex-col px-4 pt-8 sm:px-8 sm:pt-10 lg:px-[81px] lg:pt-[37px]">
      <div className="flex w-full flex-col items-center justify-center gap-[45px] lg:flex-row lg:items-start lg:justify-center">
        <DesignsItemsGradientCard
          title="Select Solar Panels"
          firstSelectId="items-solar-brand"
          secondSelectId="items-solar-size"
          summary={
            <DesignsItemProductSummary
              imageSrc="/images/designs/solarPanel.png"
              imageWidth={67}
              imageHeight={99}
              imageAlt=""
              leftCol={[
                { label: "Brand -", value: "TRINA" },
                { label: "Model -", value: "9823829302" },
                { label: "Type -", value: "Mono Perc Bifacial" },
                { label: "CEC Approved -", value: "Yes" },
              ]}
              rightCol={[
                { label: "Watts per Panel -", value: "630" },
                { label: "Number of Panels -", value: "32" },
              ]}
            />
          }
        />
        <DesignsItemsGradientCard
          title="Select Battery"
          firstSelectId="items-battery-brand"
          secondSelectId="items-battery-size"
          summary={
            <DesignsItemProductSummary
              imageSrc="/images/designs/battery.png"
              imageWidth={57}
              imageHeight={93}
              imageAlt=""
              leftCol={[
                { label: "Brand -", value: "BLUETTI" },
                { label: "Model -", value: "9823829302" },
                { label: "Type -", value: "High voltage" },
                { label: "CEC Approved -", value: "Yes" },
              ]}
              rightCol={[
                { label: "Watts per Panel -", value: "7.6 kW" },
                { label: "Number of Panels -", value: "8" },
              ]}
            />
          }
        />
        <DesignsItemsGradientCard
          title="Select Equipment"
          firstSelectId="items-equipment-brand"
          secondSelectId="items-equipment-size"
          summary={
            <DesignsItemProductSummary
              imageSrc="/images/designs/equipment.png"
              imageWidth={47}
              imageHeight={103}
              imageAlt=""
              leftCol={[
                { label: "Brand -", value: "BLUETTI" },
                { label: "Model -", value: "9823829302" },
                { label: "Type -", value: "High voltage" },
                { label: "CEC Approved -", value: "Yes" },
              ]}
              rightCol={[
                { label: "Watts per Panel -", value: "7.6 kW" },
                { label: "Number of Panels -", value: "8" },
              ]}
            />
          }
        />
      </div>
    </div>
  );
}
