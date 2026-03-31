"use client";

import Image from "next/image";
import { useState } from "react";
import { designAssets } from "./designAssets";

const SOCIAL = [
  {
    label: "Facebook",
    bg: "bg-[#e8f0fe]",
    color: "text-[#1877f2]",
    icon: designAssets.socialFacebook,
  },
  {
    label: "Twitter",
    bg: "bg-[#e8f6fd]",
    color: "text-[#1da1f2]",
    icon: designAssets.socialTwitter,
  },
  {
    label: "LinkedIn",
    bg: "bg-[#e8f0fe]",
    color: "text-[#0a66c2]",
    icon: designAssets.socialLinkedIn,
  },
  {
    label: "Email",
    bg: "bg-[#fce8e6]",
    color: "text-[#ea4335]",
    icon: designAssets.socialEmail,
  },
] as const;

type Props = {
  shareUrl: string;
};

export function ShareJourneyCard({ shareUrl }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="flex flex-col overflow-hidden rounded-[10px] border border-[#dfd5c3] bg-[#fcfbf8]">
      <div className="flex items-center gap-2 border-b border-[#dfd5c3]/60 bg-gradient-to-b from-[rgba(245,159,10,0.15)] to-transparent py-2.5 pl-[18px] pr-4">
        <Image
          src={designAssets.share2}
          alt=""
          width={16}
          height={16}
          className="size-4 shrink-0"
          unoptimized
        />
        <h2 className="font-inter text-xs font-bold uppercase leading-[18px] tracking-[0.3px] text-[#2a2622]">
          Share Your Solar Journey
        </h2>
      </div>
      <div className="flex flex-col gap-4 p-4">
        <p
          className="font-dm-sans text-xs font-normal leading-[18px] text-[#7c736a]"
          style={{ fontVariationSettings: "'opsz' 9" }}
        >
          Tell friends and family about your solar upgrade and help them save
          too!
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {SOCIAL.map((s) => (
            <button
              key={s.label}
              type="button"
              className={`flex h-10 items-center justify-center gap-2 rounded-lg ${s.bg} ${s.color}`}
            >
              <Image
                src={s.icon}
                alt=""
                width={16}
                height={16}
                className="size-4 shrink-0"
                unoptimized
              />
              <span
                className="font-dm-sans text-[10px] font-semibold leading-[15px]"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                {s.label}
              </span>
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
          <div className="min-h-[34px] flex-1 overflow-hidden rounded-lg border border-[#dfd5c3] bg-white px-3 py-2">
            <p
              className="truncate font-dm-sans text-[11px] font-normal leading-[16.5px] text-[#7c736a]"
              style={{ fontVariationSettings: "'opsz' 9" }}
            >
              {shareUrl}
            </p>
          </div>
          <button
            type="button"
            onClick={copy}
            className="inline-flex h-[34px] shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#09234a] px-4 font-dm-sans text-[11px] font-semibold text-white sm:min-w-[102px]"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            <Image
              src={designAssets.copy}
              alt=""
              width={12}
              height={12}
              unoptimized
            />
            {copied ? "Copied" : "Copy Link"}
          </button>
        </div>
      </div>
    </section>
  );
}
