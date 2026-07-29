"use client";

import { useMemo } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import type { InstallerPipelineAnalytics } from "@/lib/installers/analytics";

const { CanvasJSChart } = CanvasJSReact;

type Props = {
  mode: "revenue" | "profit" | "installs";
  data: InstallerPipelineAnalytics["monthlyPerformance"];
};

const AXIS = "#7c736a";
const GRID = "#ede8de";

export function MonthlyPerformanceChartClient({ mode, data: chartData }: Props) {
  const options = useMemo(() => {
    const axisBase = {
      axisX: {
        labelFontColor: AXIS,
        lineColor: GRID,
        tickColor: GRID,
        labelFontFamily: "var(--font-inter), sans-serif",
        labelFontSize: 11,
      },
      axisY: {
        labelFontColor: AXIS,
        gridColor: GRID,
        gridThickness: 1,
        lineThickness: 0,
        tickColor: GRID,
        labelFontFamily: "var(--font-inter), sans-serif",
        labelFontSize: 11,
      },
    };

    if (mode === "installs") {
      return {
        animationEnabled: true,
        backgroundColor: "transparent",
        height: 260,
        ...axisBase,
        axisY: {
          ...axisBase.axisY,
          minimum: 0,
          interval: 5,
          suffix: "",
        },
        data: [
          {
            type: "column",
            color: "#0369a1",
            cornerRadius: 4,
            dataPoints: chartData.months.map((label, i) => ({
              label,
              y: chartData.installs[i] ?? 0,
            })),
          },
        ],
      };
    }

    if (mode === "profit") {
      return {
        animationEnabled: true,
        backgroundColor: "transparent",
        height: 260,
        ...axisBase,
        axisY: {
          ...axisBase.axisY,
          prefix: "$",
          suffix: "",
          interval: 50,
        },
        data: [
          {
            type: "splineArea",
            color: "#f78d00",
            fillOpacity: 0.35,
            lineThickness: 2,
            markerSize: 0,
            toolTipContent: "{label}: ${y}",
            dataPoints: chartData.months.map((label, i) => ({
              label,
              y: chartData.profit[i] ?? 0,
            })),
          },
        ],
      };
    }

    return {
      animationEnabled: true,
      backgroundColor: "transparent",
      height: 260,
      legend: {
        cursor: "pointer",
        horizontalAlign: "center",
        verticalAlign: "bottom",
        fontFamily: "var(--font-inter), sans-serif",
        fontSize: 11,
        fontColor: "#2a2622",
      },
      ...axisBase,
      axisY: {
        ...axisBase.axisY,
        prefix: "$",
        interval: 150000,
      },
      data: [
        {
          type: "splineArea",
          color: "#2094f3",
          fillOpacity: 0.35,
          lineThickness: 2,
          markerSize: 0,
          toolTipContent: "{label}: ${y}",
          dataPoints: chartData.months.map((label, i) => ({
            label,
            y: chartData.revenue[i] ?? 0,
          })),
        },
      ],
    };
  }, [chartData.installs, chartData.months, chartData.profit, chartData.revenue, mode]);

  return (
    <div className="min-h-[260px] w-full [&_.canvasjs-chart-credit]:hidden">
      <CanvasJSChart options={options} />
    </div>
  );
}
