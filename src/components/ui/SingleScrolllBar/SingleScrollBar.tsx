"use client";

import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import "./SingleScrollBar.css";

export type SingleScrollBarProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  ariaLabel: string;
  className?: string;
};

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

/**
 * Horizontal range slider with white track, blue–cyan fill to the thumb, and a white thumb with cyan border.
 */
export function SingleScrollBar({
  value,
  onChange,
  min = 0,
  max = 100,
  ariaLabel,
  className,
}: SingleScrollBarProps) {
  const lo = min;
  const hi = Math.max(lo, max);
  const clamped = clamp(value, lo, hi);

  return (
    <div
      className={`single-scroll-bar relative flex h-[32px] w-full items-center ${className ?? ""}`}
    >
      <RangeSlider
        className="single-scroll-bar__slider"
        min={lo}
        max={hi}
        value={[lo, clamped]}
        onInput={(vals) => onChange(clamp(vals[1], lo, hi))}
        thumbsDisabled={[true, false]}
        rangeSlideDisabled
        ariaLabel={["", ariaLabel]}
      />
    </div>
  );
}
