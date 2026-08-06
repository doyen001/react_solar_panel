"use client";

import "@livekit/components-styles";
import classNames from "classnames";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  VideoTrack,
  useLocalParticipant,
  useRemoteParticipants,
  useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { memo, useEffect } from "react";
import Icon from "@/components/ui/Icons";
import type { CallState } from "@/hooks/useLiveKitCall";

type Props = {
  callState: CallState;
  peerName: string;
  error?: string | null;
  onAnswer?: () => void;
  onReject?: () => void;
  onHangUp?: () => void;
  onToggleCamera?: () => void;
  onToggleMic?: () => void;
  cameraEnabled?: boolean;
  micEnabled?: boolean;
  hasVideoDevice?: boolean;
  liveKitToken: string | null;
  liveKitUrl: string | null;
  onRoomConnected?: () => void;
  onRoomDisconnected?: () => void;
  onRoomError?: (message: string) => void;
  onMediaWarning?: (message: string) => void;
  onPeerJoined?: () => void;
  registerMediaControls?: (controls: {
    setCameraEnabled: (enabled: boolean) => Promise<boolean | void>;
    setMicEnabled: (enabled: boolean) => Promise<boolean | void>;
    hasVideoDevice: boolean;
    cameraEnabled: boolean;
    micEnabled: boolean;
  }) => void;
};

function statusLabel(callState: CallState, peerName: string) {
  switch (callState) {
    case "calling":
      return `Calling ${peerName}…`;
    case "ringing":
      return `Incoming call from ${peerName}`;
    case "connected":
      return peerName;
    case "ended":
      return "Call ended";
    default:
      return "";
  }
}

function CallControlButton({
  active,
  disabled,
  label,
  onClick,
  children,
  danger,
  success,
}: {
  active?: boolean;
  disabled?: boolean;
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
  danger?: boolean;
  success?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={classNames(
        "flex size-11 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        danger
          ? "bg-red-600 text-white hover:bg-red-700"
          : success
            ? "bg-green-600 text-white hover:bg-green-700"
            : active
              ? "bg-white/20 text-white hover:bg-white/30"
              : "bg-[rgba(28,26,23,0.55)] text-white hover:bg-[rgba(28,26,23,0.7)]",
      )}
    >
      {children}
    </button>
  );
}

function VideoIcon({ off }: { off?: boolean }) {
  return (
    <svg
      className="size-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path
        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {off ? <path d="M3 3l18 18" strokeLinecap="round" /> : null}
    </svg>
  );
}

function MicIcon({ off }: { off?: boolean }) {
  return (
    <svg
      className="size-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path d="M12 1a3 3 0 00-3 3v7a3 3 0 006 0V4a3 3 0 00-3-3z" />
      <path
        d="M19 10v1a7 7 0 01-14 0v-1M12 18v4M8 22h8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {off ? <path d="M3 3l18 18" strokeLinecap="round" /> : null}
    </svg>
  );
}

function VideoPane({
  trackRef,
  label,
  mirrored,
  large,
}: {
  trackRef?: ReturnType<typeof useTracks>[number];
  label: string;
  mirrored?: boolean;
  large?: boolean;
}) {
  const showVideo =
    trackRef?.publication && !trackRef.publication.isMuted;

  return (
    <div
      className={classNames(
        "relative overflow-hidden rounded-xl bg-[#1c1a17]",
        large
          ? "aspect-video w-full"
          : "aspect-video w-[120px] border-2 border-white/20 shadow-lg",
      )}
    >
      {showVideo && trackRef ? (
        <VideoTrack
          trackRef={trackRef}
          className={classNames(
            "size-full object-cover",
            mirrored && "scale-x-[-1]",
          )}
        />
      ) : (
        <div className="flex size-full flex-col items-center justify-center gap-2 text-white/70">
          <span className="flex size-12 items-center justify-center rounded-full bg-white/10">
            <Icon name="User" className="size-6" />
          </span>
          <span className="max-w-full truncate px-2 font-dm-sans text-xs">
            {label}
          </span>
        </div>
      )}
      {showVideo ? (
        <span className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-0.5 font-dm-sans text-[10px] text-white">
          {label}
        </span>
      ) : null}
    </div>
  );
}

function LiveKitCallMedia({
  peerName,
  callState,
  registerMediaControls,
  onPeerJoined,
  onRoomConnected,
  onMediaWarning,
}: {
  peerName: string;
  callState: CallState;
  registerMediaControls?: Props["registerMediaControls"];
  onPeerJoined?: () => void;
  onRoomConnected?: () => void;
  onMediaWarning?: (message: string) => void;
}) {
  const { localParticipant } = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();
  const tracks = useTracks(
    [{ source: Track.Source.Camera, withPlaceholder: true }],
    { onlySubscribed: false },
  );

  const localCamera = tracks.find(
    (t) =>
      t.participant.identity === localParticipant.identity &&
      t.source === Track.Source.Camera,
  );
  const remoteCamera = tracks.find(
    (t) =>
      t.participant.identity !== localParticipant.identity &&
      t.source === Track.Source.Camera,
  );

  useEffect(() => {
    onRoomConnected?.();
  }, [onRoomConnected]);

  useEffect(() => {
    if (remoteParticipants.length > 0) {
      onPeerJoined?.();
    }
  }, [onPeerJoined, remoteParticipants.length]);

  useEffect(() => {
    if (!registerMediaControls || !localParticipant) return;

    let hasVideo = false;
    if (typeof navigator !== "undefined" && navigator.mediaDevices?.enumerateDevices) {
      void navigator.mediaDevices.enumerateDevices().then((devices) => {
        hasVideo = devices.some((d) => d.kind === "videoinput");
        registerMediaControls({
          hasVideoDevice: hasVideo,
          cameraEnabled: localParticipant.isCameraEnabled,
          micEnabled: localParticipant.isMicrophoneEnabled,
          setCameraEnabled: async (enabled: boolean) => {
            try {
              await localParticipant.setCameraEnabled(enabled);
              return true;
            } catch {
              onMediaWarning?.("Could not access camera.");
              return false;
            }
          },
          setMicEnabled: async (enabled: boolean) => {
            try {
              await localParticipant.setMicrophoneEnabled(enabled);
              return true;
            } catch {
              onMediaWarning?.("Could not access microphone.");
              return false;
            }
          },
        });
      });
      return;
    }

    registerMediaControls({
      hasVideoDevice: false,
      cameraEnabled: localParticipant.isCameraEnabled,
      micEnabled: localParticipant.isMicrophoneEnabled,
      setCameraEnabled: async (enabled: boolean) => {
        try {
          await localParticipant.setCameraEnabled(enabled);
          return true;
        } catch {
          onMediaWarning?.("Could not access camera.");
          return false;
        }
      },
      setMicEnabled: async (enabled: boolean) => {
        try {
          await localParticipant.setMicrophoneEnabled(enabled);
          return true;
        } catch {
          onMediaWarning?.("Could not access microphone.");
          return false;
        }
      },
    });
  }, [
    localParticipant,
    localParticipant?.isCameraEnabled,
    localParticipant?.isMicrophoneEnabled,
    onMediaWarning,
    registerMediaControls,
  ]);

  const showVideoLayout = callState === "connected";

  if (!showVideoLayout) {
    return (
      <>
        <RoomAudioRenderer />
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-linear-to-b from-yellow-lemon to-orange-amber text-warm-black">
            <Icon name="Phone" className="size-7" />
          </span>
          <p className="font-inter text-lg font-bold text-white">
            {statusLabel(callState, peerName)}
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <p className="mb-3 font-inter text-sm font-semibold text-white/90">
        {statusLabel(callState, peerName)}
      </p>
      <div className="relative">
        <VideoPane trackRef={remoteCamera} label={peerName} large />
        <div className="absolute bottom-3 right-3">
          <VideoPane trackRef={localCamera} label="You" mirrored />
        </div>
      </div>
      <RoomAudioRenderer />
    </>
  );
}

export const LiveKitCallOverlay = memo(function LiveKitCallOverlay({
  callState,
  peerName,
  error,
  onAnswer,
  onReject,
  onHangUp,
  onToggleCamera,
  onToggleMic,
  cameraEnabled = false,
  micEnabled = true,
  hasVideoDevice = true,
  liveKitToken,
  liveKitUrl,
  onRoomConnected,
  onRoomDisconnected,
  onRoomError,
  onMediaWarning,
  onPeerJoined,
  registerMediaControls,
}: Props) {
  if (callState === "idle" || callState === "ended") return null;

  const shouldConnect =
    Boolean(liveKitToken && liveKitUrl) &&
    (callState === "calling" || callState === "connected");
  const showVideoLayout = callState === "connected";
  const inActiveCall = callState === "calling" || callState === "connected";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-8">
      <div
        className="absolute inset-0 bg-[rgba(17,17,17,0.82)] backdrop-blur-[3px]"
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Video call"
        className={classNames(
          "relative z-[1] w-full overflow-hidden rounded-[16px] border border-warm-border bg-[#2a2825] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.45)]",
          showVideoLayout ? "max-w-[720px]" : "max-w-[380px]",
        )}
      >
        <div className="p-4 pb-3">
          {callState === "ringing" ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-linear-to-b from-yellow-lemon to-orange-amber text-warm-black">
                <Icon name="Phone" className="size-7" />
              </span>
              <p className="font-inter text-lg font-bold text-white">
                {statusLabel(callState, peerName)}
              </p>
              {error ? (
                <p className="font-dm-sans text-sm text-red-400">{error}</p>
              ) : null}
            </div>
          ) : shouldConnect && liveKitToken && liveKitUrl ? (
            <LiveKitRoom
              token={liveKitToken}
              serverUrl={liveKitUrl}
              connect
              onDisconnected={onRoomDisconnected}
              onError={(e) => onRoomError?.(e.message)}
            >
              <LiveKitCallMedia
                peerName={peerName}
                callState={callState}
                registerMediaControls={registerMediaControls}
                onPeerJoined={onPeerJoined}
                onRoomConnected={onRoomConnected}
                onMediaWarning={onMediaWarning}
              />
              {error ? (
                <p className="mt-2 font-dm-sans text-sm text-red-400">{error}</p>
              ) : null}
            </LiveKitRoom>
          ) : (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-linear-to-b from-yellow-lemon to-orange-amber text-warm-black">
                <Icon name="Phone" className="size-7" />
              </span>
              <p className="font-inter text-lg font-bold text-white">
                {statusLabel(callState, peerName)}
              </p>
              {error ? (
                <p className="font-dm-sans text-sm text-red-400">{error}</p>
              ) : null}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 border-t border-white/10 bg-[#1f1d1a] px-4 py-4">
          {callState === "ringing" ? (
            <>
              <CallControlButton label="Decline" onClick={onReject} danger>
                <Icon name="Phone" className="size-5 rotate-[135deg]" />
              </CallControlButton>
              <CallControlButton label="Answer" onClick={onAnswer} success>
                <Icon name="Phone" className="size-5" />
              </CallControlButton>
            </>
          ) : inActiveCall ? (
            <>
              <CallControlButton
                label={micEnabled ? "Mute microphone" : "Unmute microphone"}
                onClick={onToggleMic}
                active={!micEnabled}
              >
                <MicIcon off={!micEnabled} />
              </CallControlButton>
              <CallControlButton
                label={cameraEnabled ? "Turn off camera" : "Turn on camera"}
                onClick={onToggleCamera}
                active={cameraEnabled}
              >
                <VideoIcon off={!cameraEnabled} />
              </CallControlButton>
              <CallControlButton
                label={callState === "calling" ? "Cancel call" : "Hang up"}
                onClick={onHangUp}
                danger
              >
                <Icon name="Phone" className="size-5 rotate-[135deg]" />
              </CallControlButton>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
});
