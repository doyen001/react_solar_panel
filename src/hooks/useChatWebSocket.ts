"use client";

import { useEffect, useRef, useState } from "react";
import { resolveChatWebSocketUrl } from "@/lib/chat/backend-origin";

export type ChatWsState = "idle" | "connecting" | "open" | "error";

type Options = {
  api: string;
  enabled?: boolean;
  onMessage: (data: unknown) => void;
  onOpen?: (ws: WebSocket) => void;
};

const INITIAL_RECONNECT_MS = 1000;
const MAX_RECONNECT_MS = 30000;
const RECONNECT_BACKOFF = 1.5;

export function useChatWebSocket({
  api,
  enabled = true,
  onMessage,
  onOpen,
}: Options) {
  const wsRef = useRef<WebSocket | null>(null);
  const [wsState, setWsState] = useState<ChatWsState>("idle");

  const onMessageRef = useRef(onMessage);
  const onOpenRef = useRef(onOpen);
  onMessageRef.current = onMessage;
  onOpenRef.current = onOpen;

  useEffect(() => {
    if (!enabled) {
      setWsState("idle");
      return;
    }

    let stopped = false;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let reconnectAttempt = 0;
    let activeWs: WebSocket | null = null;

    function clearReconnectTimer() {
      if (reconnectTimer !== null) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    }

    function scheduleReconnect() {
      if (stopped) return;
      clearReconnectTimer();
      const delay = Math.min(
        INITIAL_RECONNECT_MS * RECONNECT_BACKOFF ** reconnectAttempt,
        MAX_RECONNECT_MS,
      );
      reconnectAttempt += 1;
      setWsState("connecting");
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        void connect();
      }, delay);
    }

    async function connect() {
      if (stopped) return;

      try {
        const tokRes = await fetch(`${api}/ws-token`, { credentials: "include" });
        if (stopped) return;
        if (!tokRes.ok) {
          setWsState("error");
          scheduleReconnect();
          return;
        }

        const jar = (await tokRes.json()) as { token?: string; wsUrl?: string };
        const token = jar.token;
        if (!token || stopped) {
          if (!stopped && !token) {
            setWsState("error");
            scheduleReconnect();
          }
          return;
        }

        const url = resolveChatWebSocketUrl(token, jar.wsUrl);
        if (!url) {
          setWsState("error");
          scheduleReconnect();
          return;
        }

        setWsState("connecting");
        const ws = new WebSocket(url);
        activeWs = ws;
        wsRef.current = ws;

        ws.onopen = () => {
          if (stopped) return;
          reconnectAttempt = 0;
          setWsState("open");
          onOpenRef.current?.(ws);
        };

        ws.onmessage = (ev) => {
          try {
            onMessageRef.current(JSON.parse(String(ev.data)));
          } catch {
            /* ignore malformed payloads */
          }
        };

        ws.onerror = () => {
          if (!stopped) setWsState("error");
        };

        ws.onclose = () => {
          if (activeWs === ws) {
            activeWs = null;
            wsRef.current = null;
          }
          if (!stopped) scheduleReconnect();
        };
      } catch {
        if (!stopped) {
          setWsState("error");
          scheduleReconnect();
        }
      }
    }

    void connect();

    return () => {
      stopped = true;
      clearReconnectTimer();
      activeWs?.close();
      activeWs = null;
      wsRef.current = null;
    };
  }, [api, enabled]);

  return { wsRef, wsState };
}
