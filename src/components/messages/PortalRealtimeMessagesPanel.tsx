"use client";

import { useMemo, useState } from "react";
import { ConversationSwitcher } from "@/components/customer/messages/ConversationSwitcher";
import type { ComposeChannel } from "@/components/customer/messages/ComposeChannelBar";
import { ChatThreadHeader } from "@/components/customer/messages/ChatThreadHeader";
import { MessageRichComposer } from "@/components/customer/messages/MessageRichComposer";
import { MessageThreadRow } from "@/components/customer/messages/MessageThreadRow";
import type { CustomerUser } from "@/lib/store/customerAuthSlice";
import { CustomerAvatar } from "@/components/customer/CustomerAvatar";
import { initialsFromDisplayName } from "@/lib/customer/initialsFromName";
import {
  formatChatTimeLabel,
  useRealtimeChat,
} from "@/hooks/useRealtimeChat";

type Props = {
  portal: "customer" | "installer";
  sessionFetch: (
    input: RequestInfo | URL,
    init?: RequestInit,
  ) => Promise<Response>;
  user: CustomerUser | null;
};

function displayName(u: CustomerUser | null) {
  if (!u) return "You";
  const f = u.firstName.trim();
  const l = u.lastName.trim();
  if (f && l) return `${f} ${l}`;
  return f || l || "You";
}

export function PortalRealtimeMessagesPanel({
  portal,
  sessionFetch,
  user,
}: Props) {
  const [channel, setChannel] = useState<ComposeChannel>("ai");

  const chat = useRealtimeChat(portal, sessionFetch, user);

  const userDisplayName = useMemo(() => displayName(user), [user]);

  const threadHeading = useMemo(
    () =>
      `Conversation with ${chat.activeContactName.replace(/\s*\([^)]*\)\s*$/, "").trim()}`.toUpperCase(),
    [chat.activeContactName],
  );

  const emptyHint =
    portal === "customer"
      ? "No installers are linked to your projects yet. When a lead is assigned to an installer, you can chat here."
      : "No customers are linked to your assigned leads yet.";

  if (chat.loadState === "loading") {
    return (
      <div className="rounded-[10px] border border-warm-border bg-cream-50 px-4 py-8 text-center font-dm-sans text-sm text-warm-gray">
        Loading messages…
      </div>
    );
  }

  if (chat.loadState === "error") {
    return (
      <div className="rounded-[10px] border border-warm-border bg-cream-50 px-4 py-8 text-center font-dm-sans text-sm text-red-600">
        {chat.loadError ?? "Could not load messages."}
      </div>
    );
  }

  if (chat.contacts.length === 0) {
    return (
      <div className="rounded-[10px] border border-warm-border bg-cream-50 px-4 py-8 text-center font-dm-sans text-sm text-warm-gray">
        {emptyHint}
      </div>
    );
  }

  const activeTabId = chat.activePeerId ?? chat.contacts[0]?.id ?? "";

  return (
    <>
      <ConversationSwitcher
        contacts={chat.contacts}
        activeId={activeTabId}
        onSelect={chat.setActivePeerId}
      />

      <section className="flex h-[min(28rem,calc(100vh-14rem))] min-h-[16rem] flex-1 flex-col overflow-hidden rounded-[10px] border border-warm-border bg-cream-50 md:h-[28rem]">
        <ChatThreadHeader
          title={threadHeading}
          online={chat.wsState === "open"}
        />

        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-4">
          <div className="flex flex-col gap-3">
          {!chat.conversationReady ? (
            <p className="text-center font-dm-sans text-xs text-warm-gray">
              Starting conversation…
            </p>
          ) : (
            chat.messages.map((m) => {
              const isUser = m.senderId === chat.userId;
              const peerName = chat.activeContactName;
              return (
                <MessageThreadRow
                  key={m.id}
                  direction={isUser ? "outgoing" : "incoming"}
                  senderName={isUser ? userDisplayName : peerName}
                  timeLabel={formatChatTimeLabel(m.createdAt)}
                  body={m.body}
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
            })
          )}
          </div>
        </div>

        <div className="shrink-0 border-t border-warm-border px-4 pb-4 pt-3">
          <MessageRichComposer
            channel={channel}
            onChannelChange={setChannel}
            onSend={chat.sendText}
            sending={chat.sending}
            disabled={!chat.conversationReady}
            chatUploadBase={
              portal === "customer" ? "/api/customers" : "/api/installers"
            }
          />
        </div>
      </section>
    </>
  );
}
