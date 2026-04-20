declare module "@canvasjs/react-charts" {
  import type { ComponentType } from "react";

  type CanvasJSChartProps = {
    options?: Record<string, unknown>;
    containerProps?: { height?: string; width?: string; position?: string };
    id?: string;
    onRef?: (chart: unknown) => void;
  };

  const CanvasJSReact: {
    CanvasJSChart: ComponentType<CanvasJSChartProps>;
    CanvasJS: unknown;
  };

  export default CanvasJSReact;
}
