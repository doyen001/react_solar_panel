"use client";

import type { ReactNode } from "react";
import { MessageThreadRow } from "@/components/customer/messages/MessageThreadRow";
import { VideoCallHistoryRow } from "@/components/messages/VideoCallHistoryRow";
import { isVideoCallHistoryMessage } from "@/lib/chat/call-history-message";

type Props = {
  direction: "outgoing" | "incoming";
  senderName: string;
  timeLabel: string;
  body: string;
  avatar: ReactNode;
};

export function ChatThreadMessageRow(props: Props) {
  if (isVideoCallHistoryMessage(props.body)) {
    return (
      <VideoCallHistoryRow body={props.body} timeLabel={props.timeLabel} />
    );
  }

  return <MessageThreadRow {...props} />;
}
