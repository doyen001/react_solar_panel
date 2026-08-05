export function resolveLiveKitServerUrl(apiUrl?: string | null) {
  const fromEnv = process.env.NEXT_PUBLIC_LIVEKIT_URL?.trim();
  if (fromEnv) return fromEnv;
  if (apiUrl?.trim()) return apiUrl.trim();
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return "ws://127.0.0.1:7880";
  }
  return "";
}

export function isLiveKitConfigured() {
  return Boolean(resolveLiveKitServerUrl());
}
