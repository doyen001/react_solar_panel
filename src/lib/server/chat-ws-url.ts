import {
  buildChatWebSocketUrl,
  isLocalhostOrigin,
  resolveBackendHttpOriginFromEnv,
} from "@/lib/chat/backend-origin";

function isLocalhostHostname(hostname: string): boolean {
  const h = hostname.toLowerCase();
  return h === "localhost" || h === "127.0.0.1" || h === "::1";
}

function originFromRequest(request: Request): string | null {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = (forwardedHost ?? request.headers.get("host"))
    ?.split(",")[0]
    ?.trim();
  if (!host) return null;

  const hostname = host.split(":")[0];
  const forwardedProto = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();
  const proto =
    forwardedProto ??
    (isLocalhostHostname(hostname) ? "http" : "https");

  return `${proto}://${host}`;
}

/**
 * Public HTTP origin for `/ws/chat` (no path suffix).
 */
export function resolvePublicChatWsHttpOrigin(request: Request): string | null {
  const explicit = process.env.CHAT_WS_PUBLIC_ORIGIN?.trim();
  if (explicit) {
    return explicit.replace(/\/api\/v1\/?$/i, "").replace(/\/$/, "");
  }

  const fromBackend = resolveBackendHttpOriginFromEnv();
  if (fromBackend && !isLocalhostOrigin(fromBackend)) {
    return fromBackend;
  }

  const fromRequest = originFromRequest(request);
  if (fromRequest && !isLocalhostOrigin(fromRequest)) {
    return fromRequest;
  }

  return fromBackend ?? fromRequest;
}

export function resolveChatWebSocketUrlForRequest(
  request: Request,
  accessToken: string,
): string | null {
  const origin = resolvePublicChatWsHttpOrigin(request);
  if (!origin) return null;
  return buildChatWebSocketUrl(origin, accessToken);
}
