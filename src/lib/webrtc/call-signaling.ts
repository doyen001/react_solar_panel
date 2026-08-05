export const CALL_SIGNAL_TYPES = [
  "call_invite",
  "call_offer",
  "call_answer",
  "call_ice",
  "call_hangup",
  "call_reject",
  "call_ringing",
] as const;

export type CallSignalType = (typeof CALL_SIGNAL_TYPES)[number];

export type CallSignalMessage = {
  type: CallSignalType;
  conversationId: string;
  callId: string;
  fromUserId: string;
  sdp?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
};

export function isCallSignalMessage(
  value: unknown,
): value is CallSignalMessage {
  if (!value || typeof value !== "object") return false;
  const msg = value as Record<string, unknown>;
  return (
    typeof msg.type === "string" &&
    CALL_SIGNAL_TYPES.includes(msg.type as CallSignalType) &&
    typeof msg.conversationId === "string" &&
    typeof msg.callId === "string" &&
    typeof msg.fromUserId === "string"
  );
}

export function createCallId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `call-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
