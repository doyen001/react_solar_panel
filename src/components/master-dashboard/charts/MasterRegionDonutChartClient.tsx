"use client";

import { useMemo } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import type { MasterRegionSlice } from "@/utils/constant";

const { CanvasJSChart } = CanvasJSReact;

const VAR_BY_CLASS: Record<MasterRegionSlice["swatchClass"], string> = {
  "master-region-nsw": "--color-navy-800",
  "master-region-vic": "--color-blue-slate",
  "master-region-qld": "--color-orange-amber",
  "master-region-sa": "--color-funnel-amber",
  "master-region-wa": "--color-warm-border",
};

const FALLBACK: Record<MasterRegionSlice["swatchClass"], string> = {
  "master-region-nsw": "#09234a",
  "master-region-vic": "#304566",
  "master-region-qld": "#f78d00",
  "master-region-sa": "#ffbf47",
  "master-region-wa": "#dfd5c3",
};

function colorFor(swatch: MasterRegionSlice["swatchClass"]) {
  if (typeof document === "undefined") return FALLBACK[swatch];
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(VAR_BY_CLASS[swatch])
    .trim();
  return raw || FALLBACK[swatch];
}

type Props = {
  slices: readonly MasterRegionSlice[];
};

export function MasterRegionDonutChartClient({ slices }: Props) {
  const options = useMemo(() => {
    return {
      animationEnabled: true,
      backgroundColor: "transparent",
      height: 200,
      data: [
        {
          type: "doughnut",
          innerRadius: "68%",
          radius: "90%",
          showInLegend: false,
          startAngle: 90,
          indexLabelFontSize: 0,
          indexLabel: "",
          toolTipContent: "{name}: {y}%",
          dataPoints: slices.map((s) => ({
            y: s.percent,
            name: s.label,
            color: colorFor(s.swatchClass),
          })),
        },
      ],
    };
  }, [slices]);

  return (
    <div className="mx-auto size-[140px] shrink-0 [&_.canvasjs-chart-credit]:hidden">
      <CanvasJSChart options={options} />
    </div>
  );
}
