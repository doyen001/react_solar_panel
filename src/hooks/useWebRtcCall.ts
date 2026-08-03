"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  createCallId,
  type CallSignalMessage,
} from "@/lib/webrtc/call-signaling";
import { getIceServers } from "@/lib/webrtc/ice-servers";

export type CallState =
  | "idle"
  | "calling"
  | "ringing"
  | "connected"
  | "ended";

type Options = {
  conversationId: string | null;
  userId: string;
  peerUserId: string | null;
  wsRef: React.RefObject<WebSocket | null>;
  wsOpen: boolean;
  registerSignalingHandler: (
    handler: (message: CallSignalMessage) => void,
  ) => () => void;
};

function sendSignal(ws: WebSocket | null, message: CallSignalMessage) {
  if (!ws || ws.readyState !== WebSocket.OPEN) return;
  ws.send(JSON.stringify(message));
}

async function acquireLocalStream() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    for (const track of stream.getVideoTracks()) {
      track.enabled = false;
    }
    return { stream, hasVideo: stream.getVideoTracks().length > 0 };
  } catch {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    return { stream, hasVideo: false };
  }
}

export function useWebRtcCall({
  conversationId,
  userId,
  peerUserId,
  wsRef,
  wsOpen,
  registerSignalingHandler,
}: Options) {
  const [callState, setCallState] = useState<CallState>("idle");
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [incomingCall, setIncomingCall] = useState<{
    callId: string;
    fromUserId: string;
  } | null>(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [hasVideoDevice, setHasVideoDevice] = useState(false);

  const callStateRef = useRef<CallState>("idle");
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const callIdRef = useRef<string | null>(null);
  const pendingOfferRef = useRef<RTCSessionDescriptionInit | null>(null);
  const isCallerRef = useRef(false);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    callStateRef.current = callState;
  }, [callState]);

  useEffect(() => {
    localStreamRef.current = localStream;
  }, [localStream]);

  const stopLocalStream = useCallback(() => {
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    setLocalStream(null);
    setRemoteStream(null);
    setCameraEnabled(false);
    setMicEnabled(true);
    setHasVideoDevice(false);
  }, []);

  const closePeerConnection = useCallback(() => {
    const pc = pcRef.current;
    if (pc) {
      pc.onicecandidate = null;
      pc.ontrack = null;
      pc.onconnectionstatechange = null;
      pc.close();
      pcRef.current = null;
    }
  }, []);

  const resetCall = useCallback(() => {
    closePeerConnection();
    stopLocalStream();
    callIdRef.current = null;
    pendingOfferRef.current = null;
    isCallerRef.current = false;
    setIncomingCall(null);
    setCallState("idle");
  }, [closePeerConnection, stopLocalStream]);

  const ensureLocalStream = useCallback(async () => {
    if (localStreamRef.current) return localStreamRef.current;
    const { stream, hasVideo } = await acquireLocalStream();
    localStreamRef.current = stream;
    setLocalStream(stream);
    setHasVideoDevice(hasVideo);
    setCameraEnabled(false);
    setMicEnabled(stream.getAudioTracks()[0]?.enabled ?? true);
    return stream;
  }, []);

  const createPeerConnection = useCallback(
    (callId: string) => {
      closePeerConnection();
      const pc = new RTCPeerConnection({ iceServers: getIceServers() });
      pcRef.current = pc;

      pc.onicecandidate = (event) => {
        if (!event.candidate || !conversationId) return;
        sendSignal(wsRef.current, {
          type: "call_ice",
          conversationId,
          callId,
          fromUserId: userId,
          candidate: event.candidate.toJSON(),
        });
      };

      pc.ontrack = (event) => {
        const [stream] = event.streams;
        if (stream) setRemoteStream(stream);
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "connected") {
          setCallState("connected");
        }
        if (
          pc.connectionState === "failed" ||
          pc.connectionState === "disconnected" ||
          pc.connectionState === "closed"
        ) {
          resetCall();
        }
      };

      return pc;
    },
    [closePeerConnection, conversationId, resetCall, userId, wsRef],
  );

  const attachLocalTracks = useCallback(
    async (pc: RTCPeerConnection) => {
      const stream = await ensureLocalStream();
      for (const track of stream.getTracks()) {
        pc.addTrack(track, stream);
      }
    },
    [ensureLocalStream],
  );

  const toggleCamera = useCallback(async () => {
    const stream = localStreamRef.current;
    if (!stream) return;

    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack) {
      const next = !videoTrack.enabled;
      videoTrack.enabled = next;
      setCameraEnabled(next);
      return;
    }

    try {
      const videoOnly = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      const newTrack = videoOnly.getVideoTracks()[0];
      if (!newTrack) return;

      stream.addTrack(newTrack);
      setHasVideoDevice(true);
      setLocalStream(new MediaStream(stream.getTracks()));

      const pc = pcRef.current;
      if (pc) {
        pc.addTrack(newTrack, stream);
        if (
          callStateRef.current === "connected" &&
          conversationId &&
          callIdRef.current
        ) {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          sendSignal(wsRef.current, {
            type: "call_offer",
            conversationId,
            callId: callIdRef.current,
            fromUserId: userId,
            sdp: offer,
          });
        }
      }

      newTrack.enabled = true;
      setCameraEnabled(true);
    } catch {
      setError("Could not access camera.");
    }
  }, [conversationId, userId, wsRef]);

  const toggleMic = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const audioTrack = stream.getAudioTracks()[0];
    if (!audioTrack) return;
    const next = !audioTrack.enabled;
    audioTrack.enabled = next;
    setMicEnabled(next);
  }, []);

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

    try {
      const pc = createPeerConnection(callId);
      await attachLocalTracks(pc);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      sendSignal(wsRef.current, {
        type: "call_offer",
        conversationId,
        callId,
        fromUserId: userId,
        sdp: offer,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start call.");
      resetCall();
    }
  }, [
    attachLocalTracks,
    conversationId,
    createPeerConnection,
    peerUserId,
    resetCall,
    userId,
    wsOpen,
    wsRef,
  ]);

  const answerCall = useCallback(async () => {
    if (!conversationId || !incomingCall || !pendingOfferRef.current) return;

    setError(null);
    const callId = incomingCall.callId;
    callIdRef.current = callId;
    isCallerRef.current = false;
    setIncomingCall(null);

    try {
      const pc = createPeerConnection(callId);
      await attachLocalTracks(pc);
      await pc.setRemoteDescription(pendingOfferRef.current);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      sendSignal(wsRef.current, {
        type: "call_answer",
        conversationId,
        callId,
        fromUserId: userId,
        sdp: answer,
      });

      setCallState("connected");
      pendingOfferRef.current = null;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not answer call.");
      resetCall();
    }
  }, [
    attachLocalTracks,
    conversationId,
    createPeerConnection,
    incomingCall,
    resetCall,
    userId,
    wsRef,
  ]);

  useEffect(() => {
    return registerSignalingHandler((message) => {
      if (!conversationId || message.conversationId !== conversationId) return;
      if (message.fromUserId === userId) return;

      if (message.type === "call_offer") {
        if (!message.sdp) return;

        const pc = pcRef.current;
        const inCall =
          callStateRef.current === "calling" ||
          callStateRef.current === "connected";

        if (inCall && pc && callIdRef.current === message.callId) {
          void pc.setRemoteDescription(message.sdp).then(async () => {
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            sendSignal(wsRef.current, {
              type: "call_answer",
              conversationId,
              callId: message.callId,
              fromUserId: userId,
              sdp: answer,
            });
          });
          return;
        }

        if (callStateRef.current !== "idle") return;
        callIdRef.current = message.callId;
        pendingOfferRef.current = message.sdp;
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
          !message.sdp
        ) {
          return;
        }
        const pc = pcRef.current;
        if (!pc) return;
        void pc.setRemoteDescription(message.sdp).then(() => {
          setCallState("connected");
        });
        return;
      }

      if (message.type === "call_ice") {
        if (callIdRef.current !== message.callId || !message.candidate) return;
        const pc = pcRef.current;
        if (!pc) return;
        void pc.addIceCandidate(message.candidate).catch(() => {
          /* ignore stale candidates */
        });
        return;
      }

      if (message.type === "call_hangup" || message.type === "call_reject") {
        if (callIdRef.current && callIdRef.current !== message.callId) return;
        resetCall();
      }
    });
  }, [conversationId, registerSignalingHandler, resetCall, userId, wsRef]);

  useEffect(() => {
    if (!conversationId) {
      resetCall();
    }
  }, [conversationId, resetCall]);

  useEffect(() => {
    return () => {
      closePeerConnection();
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [closePeerConnection]);

  return useMemo(
    () => ({
      callState,
      localStream,
      remoteStream,
      error,
      incomingCall,
      cameraEnabled,
      micEnabled,
      hasVideoDevice,
      startCall,
      answerCall,
      rejectCall,
      hangUp,
      toggleCamera,
      toggleMic,
      callActive: callState !== "idle" && callState !== "ended",
      canStartCall:
        Boolean(conversationId && peerUserId && wsOpen) &&
        callState === "idle",
    }),
    [
      answerCall,
      callState,
      cameraEnabled,
      conversationId,
      error,
      hangUp,
      hasVideoDevice,
      incomingCall,
      localStream,
      micEnabled,
      peerUserId,
      rejectCall,
      remoteStream,
      startCall,
      toggleCamera,
      toggleMic,
      wsOpen,
    ],
  );
}
