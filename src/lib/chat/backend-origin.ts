/**
 * WebSocket and absolute URLs need the HTTP origin of the API server (no `/api/v1` suffix).
 *
 * Client bundle: set `NEXT_PUBLIC_BACKEND_API_BASE_URL` at build time for local dev.
 * Production: prefer `CHAT_WS_PUBLIC_ORIGIN` (server) or same-origin from the page request
 * via the ws-token API routes — avoids baking localhost into the client bundle.
 */
function stripApiSuffix(raw: string): string {
  return raw.replace(/\/api\/v1\/?$/i, "").replace(/\/$/, "");
}

function isLocalhostHostname(hostname: string): boolean {
  const h = hostname.toLowerCase();
  return h === "localhost" || h === "127.0.0.1" || h === "::1";
}

export function isLocalhostOrigin(origin: string): boolean {
  try {
    return isLocalhostHostname(new URL(origin).hostname);
  } catch {
    return false;
  }
}

export function resolveBackendHttpOriginFromEnv(): string | null {
  const raw =
    process.env.BACKEND_API_BASE_URL ??
    process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL ??
    "";
  if (!raw.trim()) return null;
  return stripApiSuffix(raw.trim());
}

export function getBackendHttpOrigin(): string | null {
  const fromEnv =
    typeof window !== "undefined"
      ? (process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL ?? "")
      : (process.env.BACKEND_API_BASE_URL ??
          process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL ??
          "");

  const envOrigin = fromEnv.trim() ? stripApiSuffix(fromEnv.trim()) : null;

  if (typeof window !== "undefined") {
    const pageOrigin = window.location.origin;
    if (envOrigin && isLocalhostOrigin(envOrigin) && !isLocalhostOrigin(pageOrigin)) {
      return pageOrigin;
    }
    if (!envOrigin) return pageOrigin;
  }

  return envOrigin;
}

export function buildChatWebSocketUrl(
  httpOrigin: string,
  accessToken: string,
): string {
  const wsProto = httpOrigin.startsWith("https") ? "wss" : "ws";
  const hostAndPath = httpOrigin.replace(/^https?:\/\//, "");
  return `${wsProto}://${hostAndPath}/ws/chat?token=${encodeURIComponent(accessToken)}`;
}

export function getChatWebSocketUrl(accessToken: string): string | null {
  const origin = getBackendHttpOrigin();
  if (!origin) return null;
  return buildChatWebSocketUrl(origin, accessToken);
}

/** Prefer server-computed URL (runtime); fall back to client env / page origin. */
export function resolveChatWebSocketUrl(
  accessToken: string,
  wsUrlFromServer?: string | null,
): string | null {
  const fromServer = wsUrlFromServer?.trim();
  if (fromServer) {
    if (typeof window !== "undefined") {
      const onPublicSite = !isLocalhostOrigin(window.location.origin);
      const serverPointsLocal =
        fromServer.includes("://localhost") ||
        fromServer.includes("://127.0.0.1");
      if (onPublicSite && serverPointsLocal) {
        return getChatWebSocketUrl(accessToken);
      }
    }
    return fromServer;
  }
  return getChatWebSocketUrl(accessToken);
}
