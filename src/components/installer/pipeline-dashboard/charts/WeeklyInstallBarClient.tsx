"use client";

import { useMemo } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import { OPERATIONAL } from "../pipelineDashboardMock";

const { CanvasJSChart } = CanvasJSReact;

export function WeeklyInstallBarClient() {
  const options = useMemo(() => {
    const labels = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];
    return {
      animationEnabled: true,
      backgroundColor: "transparent",
      height: 64,
      toolTip: { enabled: false },
      interactivityEnabled: false,
      dataPointWidth: 38,
      dataPointMinWidth: 38,
      dataPointMaxWidth: 38,
      axisX: {
        lineThickness: 0,
        tickThickness: 0,
        labelFontFamily: "var(--font-dm-sans), sans-serif",
        labelFontSize: 7,
        labelFontColor: "#7c736a",
      },
      axisY: {
        minimum: 0,
        maximum: 9,
        gridThickness: 0,
        tickThickness: 0,
        lineThickness: 0,
        labelFormatter: () => "",
      },
      data: [
        {
          type: "column",
          color: "#f59f0a",
          cornerRadius: 3,
          bevelEnabled: false,
          dataPoints: OPERATIONAL.weeklyInstalls.map((y, i) => ({
            label: labels[i],
            y,
          })),
        },
      ],
    };
  }, []);

  return (
    <div className="h-[120px] w-full [&_.canvasjs-chart-credit]:hidden">
      <CanvasJSChart options={options} />
    </div>
  );
}
