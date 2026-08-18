"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

type ChatThreadScrollPaneProps = {
  children: ReactNode;
  /** Changes when the thread content changes (e.g. conversation id + message count). */
  scrollKey: string;
  className?: string;
};

/**
 * Scrollable message list with pinned-to-bottom behavior for chat threads.
 */
export function ChatThreadScrollPane({
  children,
  scrollKey,
  className = "",
}: ChatThreadScrollPaneProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);
  const prevScrollKeyRef = useRef(scrollKey);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "auto") => {
    bottomRef.current?.scrollIntoView({ behavior, block: "end" });
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    stickToBottomRef.current = distanceFromBottom < 96;
  }, []);

  useEffect(() => {
    const conversationChanged = prevScrollKeyRef.current !== scrollKey;
    prevScrollKeyRef.current = scrollKey;

    if (conversationChanged) {
      stickToBottomRef.current = true;
    }

    if (!stickToBottomRef.current) return;

    scrollToBottom(conversationChanged ? "auto" : "smooth");
  }, [scrollKey, scrollToBottom]);

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className={`customer-cream-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain px-4 py-4 ${className}`.trim()}
    >
      <div className="flex flex-col gap-3">{children}</div>
      <div ref={bottomRef} aria-hidden className="h-px shrink-0" />
    </div>
  );
}
