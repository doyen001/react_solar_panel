"use client";

import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { normalizeMarkdownUrl } from "@/lib/messages/href";

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg)$/i;

function pathOnly(href: string) {
  return href.split("?")[0]?.split("#")[0] ?? href;
}

type Props = {
  content: string;
  tone: "outgoing" | "incoming";
};

export function ChatMessageMarkdown({ content, tone }: Props) {
  const outgoing = tone === "outgoing";

  const linkClass = outgoing
    ? "font-medium text-sky-200 underline underline-offset-2 hover:text-white break-all"
    : "font-medium text-brand-blue underline underline-offset-2 hover:text-navy-900 break-all";

  const components: Components = {
    p: ({ children }) => (
      <span className="block whitespace-pre-wrap break-words">{children}</span>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    a: ({ href, children }) => {
      const raw = href ?? "";
      const h = normalizeMarkdownUrl(raw);
      const basePath = pathOnly(h);
      const looksLikeImage = IMAGE_EXT.test(basePath);

      if (looksLikeImage) {
        const alt =
          typeof children === "string"
            ? children
            : Array.isArray(children) && typeof children[0] === "string"
              ? String(children[0])
              : "Image";
        return (
          <a
            href={h}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block max-w-full"
          >
            <img
              src={h}
              alt={alt}
              className={`max-h-52 w-auto max-w-full rounded-lg border object-contain ${
                outgoing ? "border-white/30" : "border-warm-border"
              }`}
            />
          </a>
        );
      }

      const allowDownload =
        /\/uploads\/chat\//i.test(h) && !looksLikeImage;

      return (
        <a
          href={h}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          download={allowDownload ? true : undefined}
        >
          {children}
        </a>
      );
    },
    img: ({ src, alt }) => {
      const rawSrc = typeof src === "string" ? src : "";
      const s = normalizeMarkdownUrl(rawSrc);
      return (
        <a
          href={s}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 block max-w-full"
        >
          <img
            src={s}
            alt={alt ?? ""}
            className={`max-h-52 w-auto max-w-full rounded-lg border object-contain ${
              outgoing ? "border-white/30" : "border-warm-border"
            }`}
          />
        </a>
      );
    },
  };

  return (
    <div className="text-left">
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  );
}
