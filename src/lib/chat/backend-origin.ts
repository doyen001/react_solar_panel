/**
 * WebSocket and absolute URLs need the HTTP origin of the API server (no `/api/v1` suffix).
 * Set `NEXT_PUBLIC_BACKEND_API_BASE_URL` to the same base as `BACKEND_API_BASE_URL`
 * (e.g. `http://localhost:3000/api/v1`) so the client can open `ws://.../ws/chat`.
 */
export function getBackendHttpOrigin(): string | null {
  const raw =
    (typeof window !== "undefined"
      ? process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL
      : process.env.BACKEND_API_BASE_URL ??
        process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL) ?? "";

  if (!raw.trim()) return null;

  return raw.replace(/\/api\/v1\/?$/i, "").replace(/\/$/, "");
}

export function getChatWebSocketUrl(accessToken: string): string | null {
  const origin = getBackendHttpOrigin();
  if (!origin) return null;

  const wsProto = origin.startsWith("https") ? "wss" : "ws";
  const hostAndPath = origin.replace(/^https?:\/\//, "");
  return `${wsProto}://${hostAndPath}/ws/chat?token=${encodeURIComponent(accessToken)}`;
}
