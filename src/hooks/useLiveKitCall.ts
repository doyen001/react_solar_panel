"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  createCallId,
  type CallSignalMessage,
} from "@/lib/webrtc/call-signaling";
import { resolveLiveKitServerUrl } from "@/lib/livekit/livekit-url";
import { extractMessage, unwrapApiData } from "@/lib/customers/backend";

export type CallState =
  | "idle"
  | "calling"
  | "ringing"
  | "connected"
  | "ended";

type LiveKitCredentials = {
  token: string;
  url: string;
  roomName: string;
};

type SessionFetch = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

type Options = {
  portal: "customer" | "installer";
  conversationId: string | null;
  userId: string;
  peerUserId: string | null;
  wsRef: React.RefObject<WebSocket | null>;
  wsOpen: boolean;
  sessionFetch: SessionFetch;
  registerSignalingHandler: (
    handler: (message: CallSignalMessage) => void,
  ) => () => void;
};

function sendSignal(ws: WebSocket | null, message: CallSignalMessage) {
  if (!ws || ws.readyState !== WebSocket.OPEN) return;
  ws.send(JSON.stringify(message));
}

export function useLiveKitCall({
  portal,
  conversationId,
  userId,
  peerUserId,
  wsRef,
  wsOpen,
  sessionFetch,
  registerSignalingHandler,
}: Options) {
  const api = portal === "customer" ? "/api/customers" : "/api/installers";

  const [callState, setCallState] = useState<CallState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [incomingCall, setIncomingCall] = useState<{
    callId: string;
    fromUserId: string;
  } | null>(null);
  const [credentials, setCredentials] = useState<LiveKitCredentials | null>(
    null,
  );
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [hasVideoDevice, setHasVideoDevice] = useState(true);

  const callStateRef = useRef<CallState>("idle");
  const callIdRef = useRef<string | null>(null);
  const isCallerRef = useRef(false);
  const connectRequestedRef = useRef(false);
  const mediaControlsRef = useRef<{
    setCameraEnabled: (enabled: boolean) => void;
    setMicEnabled: (enabled: boolean) => void;
  } | null>(null);

  useEffect(() => {
    callStateRef.current = callState;
  }, [callState]);

  const resetCall = useCallback(() => {
    callIdRef.current = null;
    isCallerRef.current = false;
    connectRequestedRef.current = false;
    setIncomingCall(null);
    setCredentials(null);
    setCameraEnabled(false);
    setMicEnabled(true);
    setHasVideoDevice(true);
    setCallState("idle");
  }, []);

  const fetchLiveKitToken = useCallback(
    async (convId: string) => {
      const res = await sessionFetch(`${api}/calls/livekit-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ conversationId: convId }),
      });

      if (!res.ok) {
        throw new Error(
          extractMessage(
            await res.json().catch(() => null),
            "Could not start call (LiveKit token).",
          ),
        );
      }

      const payload = await res.json();
      const data = unwrapApiData<{
        token: string;
        roomName: string;
        url?: string | null;
      }>(payload);

      const url = resolveLiveKitServerUrl(data?.url);
      if (!url) {
        throw new Error(
          "LiveKit server URL is not configured. Set NEXT_PUBLIC_LIVEKIT_URL.",
        );
      }
      if (!data?.token || !data?.roomName) {
        throw new Error("Invalid LiveKit token response.");
      }

      return {
        token: data.token,
        url,
        roomName: data.roomName,
      };
    },
    [api, sessionFetch],
  );

  const connectToRoom = useCallback(
    async (convId: string) => {
      if (connectRequestedRef.current) return;
      connectRequestedRef.current = true;
      const creds = await fetchLiveKitToken(convId);
      setCredentials(creds);
    },
    [fetchLiveKitToken],
  );

  const hangUp = useCallback(() => {
    const callId = callIdRef.current;
    if (callId && conversationId) {
      sendSignal(wsRef.current, {
        type: "call_hangup",
        conversationId,
        callId,
        fromUserId: userId,
      });
    }
    resetCall();
  }, [conversationId, resetCall, userId, wsRef]);

  const rejectCall = useCallback(() => {
    const callId = callIdRef.current ?? incomingCall?.callId;
    if (callId && conversationId) {
      sendSignal(wsRef.current, {
        type: "call_reject",
        conversationId,
        callId,
        fromUserId: userId,
      });
    }
    resetCall();
  }, [conversationId, incomingCall?.callId, resetCall, userId, wsRef]);

  const startCall = useCallback(async () => {
    if (!conversationId || !peerUserId || !wsOpen) {
      setError("Cannot start call right now.");
      return;
    }
    if (callStateRef.current !== "idle") return;

    setError(null);
    const callId = createCallId();
    callIdRef.current = callId;
    isCallerRef.current = true;
    setCallState("calling");

    sendSignal(wsRef.current, {
      type: "call_invite",
      conversationId,
      callId,
      fromUserId: userId,
    });

    try {
      await connectToRoom(conversationId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start call.");
      resetCall();
    }
  }, [
    connectToRoom,
    conversationId,
    peerUserId,
    resetCall,
    userId,
    wsOpen,
    wsRef,
  ]);

  const answerCall = useCallback(async () => {
    if (!conversationId || !incomingCall) return;

    setError(null);
    const callId = incomingCall.callId;
    callIdRef.current = callId;
    isCallerRef.current = false;
    setIncomingCall(null);
    setCallState("calling");

    sendSignal(wsRef.current, {
      type: "call_answer",
      conversationId,
      callId,
      fromUserId: userId,
    });

    try {
      await connectToRoom(conversationId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not answer call.");
      resetCall();
    }
  }, [connectToRoom, conversationId, incomingCall, resetCall, userId, wsRef]);

  const onRoomConnected = useCallback(() => {
    setError(null);
  }, []);

  const onPeerJoined = useCallback(() => {
    setCallState("connected");
    setError(null);
  }, []);

  const onRoomDisconnected = useCallback(() => {
    if (callStateRef.current === "idle" || callStateRef.current === "ended") {
      return;
    }
    setError((prev) => prev ?? "Call disconnected.");
    setCallState("ended");
    window.setTimeout(() => {
      resetCall();
    }, 1200);
  }, [resetCall]);

  const onRoomError = useCallback((message: string) => {
    setError(message || "Call connection failed.");
    setCallState("ended");
    window.setTimeout(() => {
      resetCall();
    }, 1500);
  }, [resetCall]);

  const registerMediaControls = useCallback(
    (controls: {
      setCameraEnabled: (enabled: boolean) => void;
      setMicEnabled: (enabled: boolean) => void;
      hasVideoDevice: boolean;
      cameraEnabled: boolean;
      micEnabled: boolean;
    }) => {
      mediaControlsRef.current = controls;
      setHasVideoDevice(controls.hasVideoDevice);
      setCameraEnabled(controls.cameraEnabled);
      setMicEnabled(controls.micEnabled);
    },
    [],
  );

  const toggleCamera = useCallback(() => {
    const next = !cameraEnabled;
    mediaControlsRef.current?.setCameraEnabled(next);
    setCameraEnabled(next);
  }, [cameraEnabled]);

  const toggleMic = useCallback(() => {
    const next = !micEnabled;
    mediaControlsRef.current?.setMicEnabled(next);
    setMicEnabled(next);
  }, [micEnabled]);

  useEffect(() => {
    return registerSignalingHandler((message) => {
      if (!conversationId || message.conversationId !== conversationId) return;
      if (message.fromUserId === userId) return;

      if (message.type === "call_invite") {
        if (callStateRef.current !== "idle") return;
        callIdRef.current = message.callId;
        setIncomingCall({
          callId: message.callId,
          fromUserId: message.fromUserId,
        });
        setCallState("ringing");
        return;
      }

      if (message.type === "call_answer") {
        if (
          !isCallerRef.current ||
          callIdRef.current !== message.callId ||
          callStateRef.current === "connected"
        ) {
          return;
        }
        return;
      }

      if (message.type === "call_hangup" || message.type === "call_reject") {
        if (callIdRef.current && callIdRef.current !== message.callId) return;
        resetCall();
      }
    });
  }, [conversationId, registerSignalingHandler, resetCall, userId]);

  useEffect(() => {
    if (!conversationId) {
      resetCall();
    }
  }, [conversationId, resetCall]);

  return useMemo(
    () => ({
      callState,
      error,
      incomingCall,
      credentials,
      cameraEnabled,
      micEnabled,
      hasVideoDevice,
      startCall,
      answerCall,
      rejectCall,
      hangUp,
      toggleCamera,
      toggleMic,
      onRoomConnected,
      onRoomDisconnected,
      onRoomError,
      onPeerJoined,
      registerMediaControls,
      callActive: callState !== "idle" && callState !== "ended",
      canStartCall:
        Boolean(conversationId && peerUserId && wsOpen) &&
        callState === "idle",
      // Legacy props kept for gradual migration — LiveKit overlay ignores streams.
      localStream: null as MediaStream | null,
      remoteStream: null as MediaStream | null,
    }),
    [
      answerCall,
      callState,
      cameraEnabled,
      conversationId,
      credentials,
      error,
      hangUp,
      hasVideoDevice,
      incomingCall,
      micEnabled,
      onRoomConnected,
      onRoomDisconnected,
      onRoomError,
      onPeerJoined,
      peerUserId,
      registerMediaControls,
      rejectCall,
      startCall,
      toggleCamera,
      toggleMic,
      wsOpen,
    ],
  );
}
