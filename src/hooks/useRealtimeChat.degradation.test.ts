import { describe, expect, it } from "vitest";
import { isChatWebSocketSendReady } from "./useRealtimeChat";

/**
 * When the chat socket is missing or not OPEN, `useRealtimeChat` falls back to
 * POST `/api/.../conversations/:id/messages` (see `sendText` in useRealtimeChat.ts).
 */
describe("useRealtimeChat degradation (HTTP when WS unavailable)", () => {
  it("uses HTTP POST path when socket is null", () => {
    expect(isChatWebSocketSendReady(null)).toBe(false);
  });

  it("uses HTTP POST path when socket is not OPEN", () => {
    expect(
      isChatWebSocketSendReady({ readyState: 0 } as WebSocket),
    ).toBe(false);
    expect(
      isChatWebSocketSendReady({ readyState: 2 } as WebSocket),
    ).toBe(false);
    expect(
      isChatWebSocketSendReady({ readyState: 3 } as WebSocket),
    ).toBe(false);
  });

  it("uses WebSocket send path when socket is OPEN (readyState 1)", () => {
    expect(
      isChatWebSocketSendReady({ readyState: 1 } as WebSocket),
    ).toBe(true);
  });
});
