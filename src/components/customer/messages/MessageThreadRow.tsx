"use client";

import type { ReactNode } from "react";
import { ChatMessageMarkdown } from "@/components/messages/ChatMessageMarkdown";

type Props = {
  direction: "outgoing" | "incoming";
  senderName: string;
  timeLabel: string;
  body: string;
  avatar: ReactNode;
};

export function MessageThreadRow({
  direction,
  senderName,
  timeLabel,
  body,
  avatar,
}: Props) {
  const outgoing = direction === "outgoing";

  return (
    <div
      className={`flex gap-3 ${outgoing ? "flex-row-reverse" : "flex-row"} items-end`}
    >
      <div className="shrink-0 pb-0.5">{avatar}</div>
      <div
        className={`min-w-0 max-w-[min(100%,28rem)] ${outgoing ? "items-end" : "items-start"} flex flex-col gap-0.5`}
      >
        <div
          className={`flex flex-wrap items-baseline gap-2 ${outgoing ? "justify-end" : "justify-start"}`}
        >
          <span
            className="font-dm-sans text-[11px] font-semibold leading-[16.5px] text-warm-ink"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            {senderName}
          </span>
          <span
            className="font-dm-sans text-[9px] font-normal leading-[13.5px] text-warm-gray"
            style={{ fontVariationSettings: "'opsz' 9" }}
          >
            {timeLabel}
          </span>
        </div>
        <div
          className={`rounded-[10px] px-3 py-2 ${
            outgoing
              ? "bg-navy-800 text-white"
              : "bg-cream-150 text-warm-ink"
          }`}
        >
          <div
            className="font-dm-sans text-xs font-normal leading-[18px]"
            style={{ fontVariationSettings: "'opsz' 9" }}
          >
            <ChatMessageMarkdown
              content={body}
              tone={outgoing ? "outgoing" : "incoming"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
