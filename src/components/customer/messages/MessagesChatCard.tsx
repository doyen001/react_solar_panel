"use client";

import { useMemo, useState } from "react";
import { CustomerAvatar } from "@/components/customer/CustomerAvatar";
import { initialsFromDisplayName } from "@/lib/customer/initialsFromName";
import { ChatThreadHeader } from "./ChatThreadHeader";
import type { ComposeChannel } from "./ComposeChannelBar";
import { DEMO_MESSAGES_BY_CONTACT } from "./messagesDemoData";
import { MessageRichComposer } from "./MessageRichComposer";
import { MessageThreadRow } from "./MessageThreadRow";
import type { MessageThreadContact } from "./types";

type Props = {
  userFirstName: string;
  userLastName: string;
  contact: MessageThreadContact;
};

export function MessagesChatCard({
  userFirstName,
  userLastName,
  contact,
}: Props) {
  const [channel, setChannel] = useState<ComposeChannel>("ai");

  const messages = DEMO_MESSAGES_BY_CONTACT[contact.id] ?? [];
  const threadHeading = `Conversation with ${contact.displayName.replace(/\s*\([^)]*\)\s*$/, "").trim()}`.toUpperCase();

  const userDisplayName = useMemo(() => {
    const f = userFirstName.trim();
    const l = userLastName.trim();
    if (f && l) return `${f} ${l}`;
    return f || l || "You";
  }, [userFirstName, userLastName]);

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[10px] border border-[#dfd5c3] bg-[#fcfbf8]">
      <ChatThreadHeader title={threadHeading} online />

      <div className="flex min-h-[12rem] flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
        {messages.map((m) => {
          const isUser = m.role === "user";
          return (
            <MessageThreadRow
              key={m.id}
              direction={isUser ? "outgoing" : "incoming"}
              senderName={isUser ? userDisplayName : contact.displayName}
              timeLabel={m.timeLabel}
              body={m.body}
              avatar={
                isUser ? (
                  <CustomerAvatar
                    firstName={userFirstName}
                    lastName={userLastName}
                    size="sm"
                    variant="navy"
                  />
                ) : (
                  <CustomerAvatar
                    initialsOverride={initialsFromDisplayName(
                      contact.displayName,
                    )}
                    size="sm"
                    variant="orange"
                  />
                )
              }
            />
          );
        })}
      </div>

      <div className="border-t border-[#dfd5c3] px-4 pb-4 pt-3">
        <MessageRichComposer
          channel={channel}
          onChannelChange={setChannel}
        />
      </div>
    </section>
  );
}
