import classNames from "classnames";
import Icon from "@/components/ui/Icons";
import {
  SYSTEM_STEPS,
  SYSTEM_STEP_CONNECTORS,
} from "@/components/pages/products/productsData";
import type { SystemStepStatus } from "@/components/pages/products/types";

const CIRCLE_CLASS: Record<SystemStepStatus, string> = {
  required: "size-14 border-2 border-brand-blue bg-white text-brand-blue sm:size-16",
  current:
    "size-20 border-[3px] border-white bg-brand-blue text-white shadow-[0_0_0_5px_rgba(32,148,243,0.3)] sm:size-24",
  optional:
    "size-14 border-2 border-dashed border-gold bg-white/50 text-gold sm:size-16",
};

const ICON_SIZE_CLASS: Record<SystemStepStatus, string> = {
  required: "size-6 sm:size-7",
  current: "size-8 sm:size-9",
  optional: "size-6 sm:size-7",
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
          const isLast = index === SYSTEM_STEPS.length - 1;
          return (
            <div key={step.key} className="flex shrink-0 items-start">
              <div className="flex w-[96px] shrink-0 flex-col items-center gap-2 sm:w-[116px]">
                <div className="flex h-[19px] items-center">
                  {step.status === "optional" ? (
                    <span className="rounded-full bg-white px-2.5 py-0.5 font-dm-sans text-[10px] font-semibold text-warm-ink shadow-sm">
                      Optional
                    </span>
                  ) : null}
                </div>
                <div className="flex h-20 items-center justify-center sm:h-24">
                  <div
                    className={classNames(
                      "flex items-center justify-center rounded-full",
                      CIRCLE_CLASS[step.status],
                    )}
                  >
                    <Icon
                      name={step.iconName}
                      className={ICON_SIZE_CLASS[step.status]}
                    />
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
                    <div className="flex flex-col items-center gap-1">
                      <span className="rounded-full bg-navy-800 px-2 py-0.5 font-dm-sans text-[9px] font-bold uppercase tracking-[0.05em] text-white">
                        Requires
                      </span>
                      <span className="h-px w-8 bg-navy-800/50 sm:w-12" />
                    </div>
                  ) : (
                    <span className="h-px w-8 border-t-2 border-dotted border-white/70 sm:w-12" />
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
