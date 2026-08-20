import Image from "next/image";
import classNames from "classnames";
import {
  SYSTEM_STEPS,
  SYSTEM_STEP_CONNECTORS,
} from "@/components/pages/products/productsData";
import type { SystemStepStatus } from "@/components/pages/products/types";

/** Solar Panels -> Inverter points forward; Inverter <- Batteries <- EV Charger point back at what they require. */
const CONNECTOR_ARROW_DIRECTION: ("left" | "right")[] = ["right", "left", "left"];

function ConnectorArrow({
  direction,
  dashed,
  className,
}: {
  direction: "left" | "right";
  dashed?: boolean;
  className?: string;
}) {
  const tipX = direction === "right" ? 58 : 4;
  const tailX = direction === "right" ? 4 : 58;
  const headBaseX = direction === "right" ? 48 : 14;

  return (
    <svg
      viewBox="0 0 62 12"
      className={classNames("h-3 w-12 sm:w-16", className)}
      fill="none"
      aria-hidden
    >
      <line
        x1={tailX}
        y1={6}
        x2={headBaseX}
        y2={6}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray={dashed ? "1 5" : undefined}
      />
      <path
        d={
          direction === "right"
            ? `M${headBaseX - 2} 1 L${tipX} 6 L${headBaseX - 2} 11 Z`
            : `M${headBaseX + 2} 1 L${tipX} 6 L${headBaseX + 2} 11 Z`
        }
        fill="currentColor"
      />
    </svg>
  );
}

const CIRCLE_CLASS: Record<SystemStepStatus, string> = {
  required: "size-20 border-[3px] border-brand-blue bg-white sm:size-24",
  current:
    "size-20 border-[3px] border-brand-blue bg-white shadow-[0_0_0_5px_rgba(32,148,243,0.3)] sm:size-24",
  optional: "size-20 border-[3px] border-dashed border-gold bg-white sm:size-24",
};

const ICON_WRAPPER_CLASS: Record<SystemStepStatus, string> = {
  required: "size-10",
  current: "size-10",
  optional: "size-10",
};

const LABEL_CLASS: Record<SystemStepStatus, string> = {
  required: "text-warm-ink",
  current: "text-warm-ink",
  optional: "text-warm-ink/70",
};

const STATUS_TEXT_CLASS: Record<SystemStepStatus, string> = {
  required: "text-flame",
  current: "text-brand-blue",
  optional: "text-warm-ink/50",
};

export function ProductsSystemStepper() {
  return (
    <div className="mx-auto w-full max-w-[1120px]">
      <div className="flex items-start gap-1 overflow-x-auto px-1 pb-2 sm:justify-center sm:gap-2 sm:overflow-visible">
        {SYSTEM_STEPS.map((step, index) => {
          const connector = SYSTEM_STEP_CONNECTORS[index];
          const arrowDirection = CONNECTOR_ARROW_DIRECTION[index];
          const isLast = index === SYSTEM_STEPS.length - 1;
          return (
            <div key={step.key} className="flex shrink-0 items-start">
              <div className="flex w-[96px] shrink-0 flex-col items-center gap-2 sm:w-[116px]">
                <div className="flex h-20 items-center justify-center sm:h-24">
                  <div
                    className={classNames(
                      "flex items-center justify-center overflow-hidden rounded-full",
                      CIRCLE_CLASS[step.status],
                    )}
                  >
                    <div
                      className={classNames(
                        "relative shrink-0",
                        ICON_WRAPPER_CLASS[step.status],
                      )}
                    >
                      <Image
                        src={step.iconSrc}
                        alt={step.label}
                        fill
                        sizes="40px"
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
                <p
                  className={classNames(
                    "text-center font-inter text-[13px] font-bold leading-[16px]",
                    LABEL_CLASS[step.status],
                  )}
                >
                  {step.label}
                </p>
                <p
                  className={classNames(
                    "text-center font-dm-sans text-[10px] font-bold uppercase tracking-[0.06em]",
                    STATUS_TEXT_CLASS[step.status],
                  )}
                >
                  {step.statusLabel}
                </p>
              </div>

              {!isLast ? (
                <div className="flex h-20 w-8 shrink-0 items-center justify-center sm:h-24 sm:w-14">
                  {connector === "requires" ? (
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="rounded-full bg-navy-800 px-2 py-0.5 font-dm-sans text-[9px] font-bold uppercase tracking-[0.05em] text-white">
                        Requires
                      </span>
                      <ConnectorArrow
                        direction={arrowDirection}
                        className="text-navy-800/55"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="rounded-full bg-white px-2.5 py-0.5 font-dm-sans text-[10px] font-semibold text-warm-ink shadow-sm">
                        Optional
                      </span>
                      <ConnectorArrow
                        direction={arrowDirection}
                        dashed
                        className="text-white/80"
                      />
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
