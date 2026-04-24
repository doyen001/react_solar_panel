"use client";

import { useMemo } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import { MASTER_REVENUE_TREND } from "@/utils/constant";

const { CanvasJSChart } = CanvasJSReact;

function cssVar(name: string, fallback: string) {
  if (typeof document === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return v || fallback;
}

function formatAxisMillions(value: number): string {
  if (value === 0) return "$0.0M";
  const rounded = Math.round(value * 100) / 100;
  if (Number.isInteger(rounded)) return `$${rounded}.0M`;
  const s = rounded.toFixed(1);
  return `$${s}M`;
}

function formatTooltipMillions(y: number): string {
  const rounded = Math.round(y * 10) / 10;
  if (Number.isInteger(rounded)) return `${rounded}`;
  return rounded.toFixed(1);
}

export function MasterRevenueTrendChartClient() {
  const options = useMemo(() => {
    const axisLabel = cssVar("--color-warm-gray", "#7c736a");
    const grid = cssVar("--color-master-revenue-grid", "#ede8de");
    const line = cssVar("--color-master-revenue-line", "#09234a");
    const fill = cssVar("--color-master-revenue-fill", "rgb(229 231 235 / 0.72)");
    const tipBg = cssVar("--color-master-revenue-tooltip-bg", "#ffffff");
    const tipBorder = cssVar("--color-master-revenue-tooltip-border", "#09234a");
    const tipText = cssVar("--color-master-revenue-tooltip-text", "#2a2622");

    return {
      animationEnabled: true,
      backgroundColor: "transparent",
      height: 220,
      margin: { top: 6, right: 10, bottom: 14, left: 2 },
      toolTip: {
        enabled: true,
        backgroundColor: tipBg,
        borderColor: tipBorder,
        borderThickness: 1,
        cornerRadius: 2,
        fontColor: tipText,
        fontFamily: "var(--font-inter), sans-serif",
        fontSize: 13,
        fontWeight: "bold",
        contentFormatter: (e: { entries: { dataPoint: { label: string; y: number } }[] }) => {
          const dp = e.entries[0]?.dataPoint;
          if (!dp) return "";
          return `${dp.label}: $${formatTooltipMillions(dp.y)}M`;
        },
      },
      axisX: {
        labelFontColor: axisLabel,
        lineColor: grid,
        tickColor: grid,
        tickLength: 4,
        labelFontFamily: "var(--font-dm-sans), sans-serif",
        labelFontSize: 11,
        interval: 1,
        margin: 6,
        gridColor: grid,
        gridThickness: 1,
        gridDashType: "dash",
        labelAngle: 0,
      },
      axisY: {
        labelFontColor: axisLabel,
        gridColor: grid,
        gridThickness: 1,
        gridDashType: "dash",
        lineThickness: 0,
        tickColor: grid,
        tickLength: 4,
        labelFontFamily: "var(--font-dm-sans), sans-serif",
        labelFontSize: 10,
        margin: 8,
        minimum: 0,
        maximum: 6,
        interval: 1.5,
        labelFormatter: (e: { value: number }) => formatAxisMillions(e.value),
      },
      data: [
        {
          type: "splineArea",
          color: fill,
          lineColor: line,
          fillOpacity: 1,
          lineThickness: 3,
          markerSize: 0,
          markerBorderThickness: 0,
          dataPoints: MASTER_REVENUE_TREND.months.map((label, i) => ({
            label,
            y: MASTER_REVENUE_TREND.valuesMillions[i],
          })),
        },
      ],
    };
  }, []);

  return (
    <div className="h-[219.99px] w-full [&_.canvasjs-chart-credit]:hidden">
      <CanvasJSChart options={options} />
    </div>
  );
}
