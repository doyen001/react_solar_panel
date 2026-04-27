"use client";

import Icon from "@/components/ui/Icons";

export type ComposeChannel =
  | "ai"
  | "email"
  | "sms"
  | "whatsapp"
  | "facebook"
  | "other";

const CHANNELS: { id: ComposeChannel; label: string; icon?: "sparkles" }[] = [
  { id: "ai", label: "AI Compose", icon: "sparkles" },
  { id: "email", label: "Email" },
  { id: "sms", label: "SMS" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "facebook", label: "Facebook" },
  { id: "other", label: "Others" },
];

type Props = {
  value: ComposeChannel;
  onChange: (c: ComposeChannel) => void;
};

export function ComposeChannelBar({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
      <span
        className="shrink-0 font-dm-sans text-xs font-normal leading-[18px] text-warm-gray"
        style={{ fontVariationSettings: "'opsz' 9" }}
      >
        Compose:
      </span>
      <div className="flex flex-wrap gap-2">
        {CHANNELS.map((ch) => {
          const active = value === ch.id;
          const isAi = ch.id === "ai";
          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => onChange(ch.id)}
              className={`inline-flex h-[25px] items-center justify-center gap-1.5 rounded-lg px-3 font-dm-sans text-[11px] font-semibold leading-[16.5px] transition-opacity ${
                isAi && active
                  ? "text-white"
                  : active
                    ? "bg-cream-300 text-brown-muted"
                    : "bg-cream-300 text-brown-muted opacity-80 hover:opacity-100"
              }`}
              style={
                isAi && active
                  ? {
                      backgroundImage:
                        "linear-gradient(168deg, rgb(32, 148, 243) 2.36%, rgb(23, 207, 207) 97.64%)",
                    }
                  : undefined
              }
            >
              {ch.icon === "sparkles" ? (
                <Icon name="Sparkles" className="size-3 shrink-0" />
              ) : null}
              {ch.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
