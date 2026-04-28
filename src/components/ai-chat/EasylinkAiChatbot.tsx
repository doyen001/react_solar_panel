"use client";

import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icons";
import { ChatMessageMarkdown } from "@/components/messages/ChatMessageMarkdown";

type ChatRole = "user" | "assistant";

type ChatTurn = { role: ChatRole; content: string };

const WELCOME: ChatTurn = {
  role: "assistant",
  content:
    "Hi — I'm the EasyLink Solar assistant. Ask me about our platform, solar quotes, installers, or anything in our FAQ.",
};

export function EasylinkAiChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatTurn[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector("textarea")?.focus();
  }, [open]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;

    setError(null);
    setInput("");
    setBusy(true);

    const nextMessages: ChatTurn[] = [
      ...messages.filter((m) => m.content.length > 0),
      { role: "user", content: text },
    ];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({
            role,
            content,
          })),
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          message?: string;
        };
        throw new Error(data.message ?? `Request failed (${res.status})`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          const last = copy[copy.length - 1];
          if (last?.role === "assistant") {
            copy[copy.length - 1] = { role: "assistant", content: full };
          }
          return copy;
        });
      }
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Something went wrong. Try again.";
      setError(msg);
      setMessages((prev) => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        if (last?.role === "assistant" && !last.content) {
          copy.pop();
        }
        return copy;
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close EasyLink assistant" : "Open EasyLink assistant"}
        aria-expanded={open}
        className={classNames(
          "fixed bottom-6 right-6 z-[100] flex size-14 items-center justify-center rounded-full shadow-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2",
          open
            ? "bg-navy-800 text-white hover:bg-navy-900"
            : "bg-brand-blue text-white hover:opacity-95",
        )}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? (
          <span className="font-inter text-2xl leading-none" aria-hidden>
            ×
          </span>
        ) : (
          <Icon name="MessageSquare" className="size-7 text-white" />
        )}
      </button>

      {open ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="EasyLink Solar assistant"
          className="fixed bottom-24 right-6 z-[100] flex h-[min(560px,calc(100vh-7rem))] w-[min(100vw-2rem,400px)] flex-col overflow-hidden rounded-2xl border border-warm-border bg-cream-50 shadow-2xl"
        >
          <div className="border-b border-warm-border bg-navy-800 px-4 py-3">
            <p className="font-inter text-sm font-semibold text-white">
              EasyLink assistant
            </p>
            <p className="font-inter mt-0.5 text-xs text-white/80">
              Answers use our FAQ; not financial or legal advice.
            </p>
          </div>

          <div
            ref={listRef}
            className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 py-3"
          >
            {messages.map((m, i) => (
              <div
                key={`${i}-${m.role}`}
                className={classNames(
                  "max-w-[95%] rounded-xl px-3 py-2 text-sm",
                  m.role === "user"
                    ? "ml-auto bg-brand-blue text-white"
                    : "mr-auto border border-warm-border bg-white text-navy-900",
                )}
              >
                {m.role === "assistant" ? (
                  m.content ? (
                    <ChatMessageMarkdown content={m.content} tone="incoming" />
                  ) : busy && i === messages.length - 1 ? (
                    <span className="font-inter text-warm-gray">Thinking…</span>
                  ) : null
                ) : (
                  <p className="font-inter whitespace-pre-wrap break-words">
                    {m.content}
                  </p>
                )}
              </div>
            ))}
          </div>

          {error ? (
            <p className="border-t border-red-200 bg-red-50 px-3 py-2 font-inter text-xs text-red-800">
              {error}
            </p>
          ) : null}

          <div className="border-t border-warm-border p-3">
            <div className="flex gap-2">
              <textarea
                rows={2}
                value={input}
                disabled={busy}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send();
                  }
                }}
                placeholder="Ask about EasyLink Solar…"
                className="font-inter max-h-28 min-h-[44px] flex-1 resize-y rounded-lg border border-warm-border bg-white px-3 py-2 text-sm text-navy-900 outline-none placeholder:text-warm-gray focus:border-brand-blue"
              />
              <button
                type="button"
                disabled={busy || !input.trim()}
                onClick={() => void send()}
                className="shrink-0 self-end rounded-lg bg-brand-blue px-4 py-2 font-inter text-sm font-medium text-white disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
