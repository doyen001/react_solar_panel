"use client";

import { useMemo } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import { STC_PIPELINE } from "../pipelineDashboardMock";

const { CanvasJSChart } = CanvasJSReact;

export function StcColumnChartClient() {
  const options = useMemo(
    () => ({
      animationEnabled: true,
      backgroundColor: "transparent",
      height: 180,
      axisX: {
        lineThickness: 0,
        tickThickness: 0,
        labelFontFamily: "var(--font-dm-sans), sans-serif",
        labelFontSize: 11,
        labelFontColor: "#7c736a",
      },
      axisY: {
        minimum: 0,
        maximum: 1600,
        interval: 400,
        lineThickness: 0,
        tickThickness: 0,
        labelFormatter: () => "",
        gridColor: "#ede8de",
        gridDashType: "dash",
      },
      data: [
        {
          type: "column",
          cornerRadius: 4,
          indexLabel: "{valueLabel}",
          indexLabelFontSize: 11,
          indexLabelFontFamily: "var(--font-inter), sans-serif",
          indexLabelFontColor: "#2a2622",
          indexLabelFontWeight: "bold",
          dataPoints: STC_PIPELINE.columns.map((c) => ({
            label: c.label,
            y: c.valueK,
            valueLabel: c.valueLabel,
            color: c.color,
          })),
        },
      ],
    }),
    [],
  );

  return (
    <div className="min-h-[180px] w-full [&_.canvasjs-chart-credit]:hidden">
      <CanvasJSChart options={options} />
    </div>
  );
}
