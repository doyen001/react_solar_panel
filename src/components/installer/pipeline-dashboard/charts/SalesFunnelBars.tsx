import { FUNNEL_BAR_MAX, FUNNEL_STAGES } from "../pipelineDashboardMock";

/**
 * Figma `3:10769` — centered horizontal funnel bars.
 * Implemented with HTML/CSS like the design (not CanvasJS): the trial build
 * watermarks the canvas and stackedBar mis-rendered as a single garbled stack.
 */
export function SalesFunnelBars() {
  return (
    <div className="flex w-full flex-col gap-[6px] py-0.5">
      {FUNNEL_STAGES.map((stage) => (
        <div
          key={stage.label}
          className="flex h-[30px] w-full items-center justify-center"
        >
          <div
            className={`flex h-[30px] max-w-full shrink-0 items-center rounded px-2.5 font-dm-sans text-[11px] font-semibold leading-[16.5px] ${
              stage.revenueK ? "justify-between" : "justify-start"
            } ${stage.inkOnBar === "light" ? "text-white" : "text-warm-black"}`}
            style={{
              width: `${(stage.barUnits / FUNNEL_BAR_MAX) * 100}%`,
              backgroundColor: stage.color,
            }}
          >
            <span>{stage.deals} deals</span>
            {stage.revenueK ? (
              <span
                className={`text-[10px] font-normal leading-[15px] ${
                  stage.inkOnBar === "light"
                    ? "text-[rgba(255,255,255,0.7)]"
                    : "text-[rgba(28,26,23,0.6)]"
                }`}
              >
                {stage.revenueK}
              </span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
