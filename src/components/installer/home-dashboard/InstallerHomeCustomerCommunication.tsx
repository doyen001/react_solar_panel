"use client";

import { useMemo } from "react";
import { MessageRichComposer } from "@/components/customer/messages/MessageRichComposer";
import { ChatThreadMessageRow } from "@/components/customer/messages/ChatThreadMessageRow";
import { LiveKitCallOverlay } from "@/components/messages/LiveKitCallOverlay";
import { CustomerAvatar } from "@/components/customer/CustomerAvatar";
import { initialsFromDisplayName } from "@/lib/customer/initialsFromName";
import {
  formatChatTimeLabel,
} from "@/hooks/useRealtimeChat";
import { useInstallerHomeConversation } from "@/hooks/useInstallerHomeConversation";
import { fetchWithInstallerSession } from "@/lib/installers/installer-fetch-client";
import { useAppSelector } from "@/lib/store/hooks";

type Props = {
  customerId: string | null;
};

function displayName(
  user: { firstName?: string | null; lastName?: string | null } | null,
) {
  if (!user) return "You";
  const f = (user.firstName ?? "").trim();
  const l = (user.lastName ?? "").trim();
  if (f && l) return `${f} ${l}`;
  return f || l || "You";
}

export function InstallerHomeCustomerCommunication({ customerId }: Props) {
  const user = useAppSelector((s) => s.installerAuth.user);

  const selectedCustomerId =
    customerId && !customerId.startsWith("fallback-") ? customerId : null;

  const chat = useInstallerHomeConversation(
    fetchWithInstallerSession,
    user,
    selectedCustomerId,
  );

  const userDisplayName = useMemo(() => displayName(user), [user]);

  const peerAvailable = chat.peerAvailable;

  const threadEmptyMessage = useMemo(() => {
    if (!selectedCustomerId) {
      return "Select a customer from the list to view and send messages.";
    }
    if (chat.loadState === "loading") {
      return "Loading messages…";
    }
    if (chat.loadState === "error") {
      return chat.loadError ?? "Could not load messages.";
    }
    if (!peerAvailable) {
      return "This customer is not linked to your assigned leads yet. Messaging is unavailable.";
    }
    if (!chat.conversationReady) {
      return "Starting conversation…";
    }
    if (chat.messages.length === 0) {
      return "No messages yet. Send the first message below.";
    }
    return null;
  }, [
    chat.conversationReady,
    chat.loadError,
    chat.loadState,
    chat.messages.length,
    peerAvailable,
    selectedCustomerId,
  ]);

  const composerDisabled =
    !selectedCustomerId ||
    chat.loadState !== "ready" ||
    !peerAvailable ||
    !chat.conversationReady;

  return (
    <section className="mt-6 overflow-hidden rounded-[11.042px] border-[1.157px] border-warm-border bg-cream-50">
      <LiveKitCallOverlay
        callState={chat.voiceCall.callState}
        peerName={chat.activeContactName}
        error={chat.voiceCall.error}
        cameraEnabled={chat.voiceCall.cameraEnabled}
        micEnabled={chat.voiceCall.micEnabled}
        hasVideoDevice={chat.voiceCall.hasVideoDevice}
        liveKitToken={chat.voiceCall.credentials?.token ?? null}
        liveKitUrl={chat.voiceCall.credentials?.url ?? null}
        onAnswer={() => void chat.voiceCall.answerCall()}
        onReject={chat.voiceCall.rejectCall}
        onHangUp={chat.voiceCall.hangUp}
        onToggleCamera={() => void chat.voiceCall.toggleCamera()}
        onToggleMic={chat.voiceCall.toggleMic}
        onRoomConnected={chat.voiceCall.onRoomConnected}
        onRoomDisconnected={chat.voiceCall.onRoomDisconnected}
        onRoomError={chat.voiceCall.onRoomError}
        onMediaWarning={chat.voiceCall.onMediaWarning}
        onPeerJoined={chat.voiceCall.onPeerJoined}
        registerMediaControls={chat.voiceCall.registerMediaControls}
      />
      <div className="flex min-h-[43.06px] items-center border-l-[2.315px] border-yellow-lemon bg-linear-to-b from-[rgba(245,159,10,0.15)] to-transparent pl-[19.966px] pr-[17.65px]">
        <span className="font-inter text-[13.25px] font-bold uppercase leading-[19.875px] tracking-[0.3313px] text-warm-ink">
          Customer Communication
        </span>
      </div>

      <div className="min-h-[110.409px] max-h-[min(280px,40vh)] overflow-y-auto overflow-x-hidden bg-cream-50 px-[17.65px] py-4">
        {threadEmptyMessage ? (
          <p className="text-center font-dm-sans text-xs text-warm-gray">
            {threadEmptyMessage}
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {chat.messages.map((message) => {
              const isUser = message.senderId === chat.userId;
              const peerName = chat.activeContactName;
              return (
                <ChatThreadMessageRow
                  key={message.id}
                  direction={isUser ? "outgoing" : "incoming"}
                  senderName={isUser ? userDisplayName : peerName}
                  timeLabel={formatChatTimeLabel(message.createdAt)}
                  body={message.body}
                  avatar={
                    isUser ? (
                      <CustomerAvatar
                        firstName={user?.firstName ?? ""}
                        lastName={user?.lastName ?? ""}
                        size="sm"
                        variant="navy"
                      />
                    ) : (
                      <CustomerAvatar
                        initialsOverride={initialsFromDisplayName(peerName)}
                        size="sm"
                        variant="orange"
                      />
                    )
                  }
                />
              );
            })}
          </div>
        )}
      </div>

      <div className="border-t-[1.157px] border-warm-border px-[16.97px] pb-[8px] pt-0">
        <MessageRichComposer
          onSend={chat.sendText}
          sending={chat.sending}
          disabled={composerDisabled}
          chatUploadBase="/api/installers"
          placeholder="Type your message..."
          onStartCall={() => void chat.voiceCall.startCall()}
          callDisabled={
            composerDisabled ||
            chat.wsState !== "open" ||
            !chat.voiceCall.canStartCall
          }
          callInProgress={chat.voiceCall.callActive}
        />
      </div>
    </section>
  );
}
