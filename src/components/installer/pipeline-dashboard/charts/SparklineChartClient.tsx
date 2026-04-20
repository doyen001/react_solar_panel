"use client";

import { useMemo } from "react";
import CanvasJSReact from "@canvasjs/react-charts";

const { CanvasJSChart } = CanvasJSReact;

type Props = {
  /** 0–100 normalized spark points */
  points: number[];
  color: string;
};

export function SparklineChartClient({ points, color }: Props) {
  const options = useMemo(
    () => ({
      animationEnabled: false,
      backgroundColor: "transparent",
      height: 52,
      dataPointWidth: 0,
      axisX: {
        margin: 0,
        labelFontSize: 0,
        tickLength: 0,
        lineThickness: 0,
        gridThickness: 0,
        lineColor: "transparent",
      },
      axisY: {
        margin: 0,
        labelFontSize: 0,
        tickLength: 0,
        lineThickness: 0,
        gridThickness: 0,
        lineColor: "transparent",
        stripLines: [],
      },
      toolTip: { enabled: false },
      data: [
        {
          type: "splineArea",
          color,
          fillOpacity: 0.22,
          lineThickness: 2,
          markerSize: 0,
          dataPoints: points.map((y, i) => ({ x: i, y })),
        },
      ],
    }),
    [points, color],
  );

  return (
    <div className="h-[52px] w-[72px] shrink-0 [&_.canvasjs-chart-credit]:hidden">
      <CanvasJSChart
        options={options}
        containerProps={{ height: "52px", width: "100%" }}
      />
    </div>
  );
}
