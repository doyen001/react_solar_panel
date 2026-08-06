"use client";

import Icon from "@/components/ui/Icons";
import { getVideoCallHistoryLabel } from "@/lib/chat/call-history-message";

type Props = {
  body: string;
  timeLabel: string;
};

export function VideoCallHistoryRow({ body, timeLabel }: Props) {
  const label = getVideoCallHistoryLabel(body);
  const missed =
    label.toLowerCase().includes("no answer") ||
    label.toLowerCase().includes("declined");

  return (
    <div className="flex justify-center py-1">
      <div className="flex max-w-[min(100%,20rem)] flex-col items-center gap-1 rounded-full border border-warm-border/80 bg-cream-100/80 px-4 py-2 text-center">
        <div className="flex items-center gap-2">
          <span
            className={`flex size-6 shrink-0 items-center justify-center rounded-full ${
              missed ? "bg-warm-gray/15 text-warm-gray" : "bg-brand-blue/10 text-brand-blue"
            }`}
          >
            <Icon name="Phone" className="size-3.5" />
          </span>
          <span
            className="font-dm-sans text-[11px] font-medium leading-[16.5px] text-warm-ink"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            {label}
          </span>
        </div>
        {timeLabel ? (
          <span
            className="font-dm-sans text-[9px] font-normal leading-[13.5px] text-warm-gray"
            style={{ fontVariationSettings: "'opsz' 9" }}
          >
            {timeLabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}
