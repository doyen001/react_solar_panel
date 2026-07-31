export function getIceServers(): RTCIceServer[] {
  const servers: RTCIceServer[] = [];

  const stunUrl = process.env.NEXT_PUBLIC_STUN_URL?.trim();
  if (stunUrl) {
    servers.push({ urls: stunUrl });
  } else {
    servers.push({ urls: "stun:stun.l.google.com:19302" });
  }

  const turnUrl = process.env.NEXT_PUBLIC_TURN_URL?.trim();
  const turnUsername = process.env.NEXT_PUBLIC_TURN_USERNAME?.trim();
  const turnCredential = process.env.NEXT_PUBLIC_TURN_CREDENTIAL?.trim();
  if (turnUrl && turnUsername && turnCredential) {
    servers.push({
      urls: turnUrl,
      username: turnUsername,
      credential: turnCredential,
    });
  }

  return servers;
}
