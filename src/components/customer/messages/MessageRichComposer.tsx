"use client";

import { useMemo, useState } from "react";
import type { ComposeChannel } from "./ComposeChannelBar";
import { ComposeChannelBar } from "./ComposeChannelBar";
import Icon, { IconType } from "@/components/ui/Icons";

const FORMAT_ICONS: IconType[] = [
  "Bold",
  "Italic",
  "Link",
  "Image",
  "Attach",
  "Emoji",
] as const;

function countWords(text: string): number {
  const t = text.trim();
  if (!t) return 0;
  return t.split(/\s+/).length;
}

type Props = {
  placeholder?: string;
  channel: ComposeChannel;
  onChannelChange: (c: ComposeChannel) => void;
  onSend?: (text: string) => void | Promise<void>;
  sending?: boolean;
  disabled?: boolean;
};

export function MessageRichComposer({
  placeholder = "Type your message...",
  channel,
  onChannelChange,
  onSend,
  sending = false,
  disabled = false,
}: Props) {
  const [draft, setDraft] = useState("");
  const words = useMemo(() => countWords(draft), [draft]);

  return (
    <div className="flex flex-col gap-3 border-t border-warm-border pt-3">
      <ComposeChannelBar value={channel} onChange={onChannelChange} />

      <label className="sr-only" htmlFor="customer-message-input">
        Message
      </label>
      <textarea
        id="customer-message-input"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={3}
        placeholder={placeholder}
        className="min-h-[76px] w-full resize-y rounded-lg border border-warm-border bg-white p-3 font-dm-sans text-sm font-normal leading-[21px] text-warm-ink placeholder:text-warm-gray/50 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
        style={{ fontVariationSettings: "'opsz' 9" }}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1">
          {FORMAT_ICONS.map((src, i) => (
            <button
              key={i}
              type="button"
              aria-label="Formatting"
              className="flex size-[22px] items-center justify-center rounded hover:bg-black/[0.04] text-warm-gray"
            >
              <Icon name={src as IconType} className="size-3" />
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          <span
            className="font-dm-sans text-[11px] font-normal leading-[16.5px] text-warm-gray"
            style={{ fontVariationSettings: "'opsz' 9" }}
          >
            {words} words
          </span>
          <button
            type="button"
            disabled={disabled || sending || !draft.trim()}
            onClick={() => {
              const text = draft.trim();
              if (!text || disabled || sending) return;
              void Promise.resolve(onSend?.(text)).then(() => {
                setDraft("");
              });
            }}
            className="inline-flex h-7 min-w-[76px] items-center justify-center gap-2 rounded-lg font-dm-sans text-[11px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              fontVariationSettings: "'opsz' 14",
              backgroundImage:
                "linear-gradient(162deg, rgb(32, 148, 243) 2.36%, rgb(23, 207, 207) 97.64%)",
            }}
          >
            <Icon name="Send" className="size-3" />
            Send
          </button>
          <button
            type="button"
            className="inline-flex h-7 min-w-[76px] items-center justify-center gap-1 rounded-lg border border-warm-border bg-white px-3 font-dm-sans text-[11px] font-medium text-warm-ink hover:bg-cream-50"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            <Icon name="Phone" className="size-3" />
            Phone
          </button>
        </div>
      </div>
    </div>
  );
}
