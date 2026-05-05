import { useEffect, useRef, useState } from "react";
import {
  getBackendHttpOrigin,
  getChatWebSocketUrl,
} from "@/lib/chat/backend-origin";
import type { DashboardNotificationItem } from "@/lib/notifications/types";
import { wsPayloadToDashboardItem } from "@/lib/notifications/ws-payload";

const INSTALLER_WS_TOKEN_API = "/api/installers/ws-token";
const MAX_FAILURES_BEFORE_GIVE_UP = 5;
const INITIAL_RETRY_MS = 1_000;
const MAX_RETRY_MS = 16_000;

export type InstallerNotificationWsState =
  | "idle"
  | "connecting"
  | "open"
  | "error";

/**
 * Subscribes to backend `/ws/chat` notification pushes (`subscribe_notifications`).
 * After reconnect exhaustion, state becomes `error` and callers should rely on HTTP polling.
 */
export function useInstallerNotificationSocket(options: {
  enabled: boolean;
  onNotification: (item: DashboardNotificationItem) => void;
}): { wsState: InstallerNotificationWsState } {
  const { enabled, onNotification } = options;
  const onNotificationRef = useRef(onNotification);
  onNotificationRef.current = onNotification;

  const [wsState, setWsState] = useState<InstallerNotificationWsState>("idle");

  useEffect(() => {
    if (!enabled) {
      setWsState("idle");
      return;
    }

    let stopped = false;
    let ws: WebSocket | null = null;
    let consecutiveFailures = 0;
    /** Browser timers are numeric handles; Node typings overload `setTimeout` as `Timeout`. */
    let reconnectTimer: number | null = null;

    const clearReconnectTimer = () => {
      if (reconnectTimer != null) {
        window.clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    };

    const scheduleReconnect = () => {
      if (stopped) return;
      if (consecutiveFailures >= MAX_FAILURES_BEFORE_GIVE_UP) {
        setWsState("error");
        return;
      }
      consecutiveFailures += 1;
      const exp = Math.min(
        INITIAL_RETRY_MS * 2 ** (consecutiveFailures - 1),
        MAX_RETRY_MS,
      );
      reconnectTimer = window.setTimeout(() => {
        reconnectTimer = null;
        void openSocket();
      }, exp);
    };

    const openSocket = async () => {
      if (stopped) return;

      if (!getBackendHttpOrigin()) {
        setWsState("error");
        return;
      }

      const tokRes = await fetch(INSTALLER_WS_TOKEN_API, {
        credentials: "include",
      });
      if (stopped) return;
      if (!tokRes.ok) {
        setWsState("error");
        scheduleReconnect();
        return;
      }
      const jar = (await tokRes.json()) as { token?: string };
      const token = jar.token;
      if (!token || stopped) {
        setWsState("error");
        scheduleReconnect();
        return;
      }

      const url = getChatWebSocketUrl(token);
      if (!url || stopped) {
        setWsState("error");
        scheduleReconnect();
        return;
      }

      setWsState("connecting");
      ws = new WebSocket(url);

      ws.onopen = () => {
        if (stopped) return;
        consecutiveFailures = 0;
        clearReconnectTimer();
        ws?.send(JSON.stringify({ type: "subscribe_notifications" }));
        setWsState("open");
      };

      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(String(ev.data)) as {
            type?: string;
            payload?: unknown;
          };
          if (msg.type !== "notification") return;
          const item = wsPayloadToDashboardItem(msg.payload);
          if (item) onNotificationRef.current(item);
        } catch {
          /* ignore malformed frames */
        }
      };

      ws.onerror = () => {
        /* Browser closes the socket; reconnect from onclose only */
      };

      ws.onclose = () => {
        ws = null;
        if (stopped) return;
        setWsState("idle");
        scheduleReconnect();
      };
    };

    consecutiveFailures = 0;
    void openSocket();

    return () => {
      stopped = true;
      clearReconnectTimer();
      ws?.close();
      ws = null;
      setWsState("idle");
    };
  }, [enabled]);

  return { wsState };
}
