"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { messagesAssets } from "./messagesAssets";
import type { ComposeChannel } from "./ComposeChannelBar";
import { ComposeChannelBar } from "./ComposeChannelBar";

const FORMAT_ICONS = [
  messagesAssets.formatBold,
  messagesAssets.formatItalic,
  messagesAssets.formatLink,
  messagesAssets.formatImage,
  messagesAssets.formatAttach,
  messagesAssets.formatEmoji,
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
};

export function MessageRichComposer({
  placeholder = "Type your message...",
  channel,
  onChannelChange,
}: Props) {
  const [draft, setDraft] = useState("");
  const words = useMemo(() => countWords(draft), [draft]);

  return (
    <div className="flex flex-col gap-3 border-t border-[#dfd5c3] pt-3">
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
        className="min-h-[76px] w-full resize-y rounded-lg border border-[#dfd5c3] bg-white p-3 font-[family-name:var(--font-dm-sans)] text-sm font-normal leading-[21px] text-[#2a2622] placeholder:text-[rgba(124,115,106,0.5)] focus:outline-none focus:ring-2 focus:ring-[#2094f3]/30"
        style={{ fontVariationSettings: "'opsz' 9" }}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1">
          {FORMAT_ICONS.map((src, i) => (
            <button
              key={i}
              type="button"
              aria-label="Formatting"
              className="flex size-[22px] items-center justify-center rounded hover:bg-black/[0.04]"
            >
              <Image
                src={src}
                alt=""
                width={14}
                height={14}
                className="size-3.5"
                unoptimized
              />
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          <span
            className="font-[family-name:var(--font-dm-sans)] text-[11px] font-normal leading-[16.5px] text-[#7c736a]"
            style={{ fontVariationSettings: "'opsz' 9" }}
          >
            {words} words
          </span>
          <button
            type="button"
            className="inline-flex h-7 min-w-[76px] items-center justify-center gap-1 rounded-lg px-3 font-[family-name:var(--font-dm-sans)] text-[11px] font-semibold text-white"
            style={{
              fontVariationSettings: "'opsz' 14",
              backgroundImage:
                "linear-gradient(162deg, rgb(32, 148, 243) 2.36%, rgb(23, 207, 207) 97.64%)",
            }}
          >
            <Image
              src={messagesAssets.send}
              alt=""
              width={12}
              height={12}
              unoptimized
            />
            Send
          </button>
          <button
            type="button"
            className="inline-flex h-7 min-w-[76px] items-center justify-center gap-1 rounded-lg border border-[#dfd5c3] bg-white px-3 font-[family-name:var(--font-dm-sans)] text-[11px] font-medium text-[#2a2622] hover:bg-[#fcfbf8]"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            <Image
              src={messagesAssets.phone}
              alt=""
              width={12}
              height={12}
              unoptimized
            />
            Phone
          </button>
        </div>
      </div>
    </div>
  );
}
