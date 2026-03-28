"use client";

import { useMemo, useState } from "react";
import { CustomerDashboardHeader } from "@/components/customer/dashboard/CustomerDashboardHeader";
import { ConversationSwitcher } from "@/components/customer/messages/ConversationSwitcher";
import { MESSAGE_THREAD_CONTACTS } from "@/components/customer/messages/messagesDemoData";
import { MessagesChatCard } from "@/components/customer/messages/MessagesChatCard";
import { useAppSelector } from "@/lib/store/hooks";

export default function CustomerMessagesPage() {
  const user = useAppSelector((s) => s.customerAuth.user);
  const [activeThreadId, setActiveThreadId] = useState(
    () => MESSAGE_THREAD_CONTACTS[1]?.id ?? MESSAGE_THREAD_CONTACTS[0].id,
  );

  const activeContact = useMemo(
    () =>
      MESSAGE_THREAD_CONTACTS.find((c) => c.id === activeThreadId) ??
      MESSAGE_THREAD_CONTACTS[0],
    [activeThreadId],
  );

  return (
    <div className="flex min-h-screen flex-col">
      <CustomerDashboardHeader
        firstName={user?.firstName}
        lastName={user?.lastName}
        activeNav="messages"
      />

      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-4 px-4 py-5 md:gap-5 md:px-5">
        <ConversationSwitcher
          contacts={MESSAGE_THREAD_CONTACTS}
          activeId={activeThreadId}
          onSelect={setActiveThreadId}
        />

        <MessagesChatCard
          userFirstName={user?.firstName ?? ""}
          userLastName={user?.lastName ?? ""}
          contact={activeContact}
        />
      </main>
    </div>
  );
}
