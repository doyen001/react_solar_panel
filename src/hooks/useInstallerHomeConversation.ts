import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  extractMessage,
  unwrapApiData,
} from "@/lib/customers/backend";
import { getChatWebSocketUrl } from "@/lib/chat/backend-origin";
import type { ChatMessage, ConversationRow } from "@/hooks/useRealtimeChat";
import { isChatWebSocketSendReady } from "@/hooks/useRealtimeChat";

type ConversationWithMessages = ConversationRow & {
  messages?: ChatMessage[];
};

type SessionFetch = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

function customerDisplayName(c: ConversationRow["customer"]) {
  const n = `${c.firstName} ${c.lastName}`.trim();
  return n || c.email;
}

export function useInstallerHomeConversation(
  sessionFetch: SessionFetch,
  installer: { id: string } | null,
  customerId: string | null,
) {
  const api = "/api/installers";
  const installerId = installer?.id ?? "";

  const [conversation, setConversation] = useState<ConversationWithMessages | null>(
    null,
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [loadError, setLoadError] = useState<string | null>(null);
  const [peerAvailable, setPeerAvailable] = useState(false);
  const [wsState, setWsState] = useState<
    "idle" | "connecting" | "open" | "error"
  >("idle");
  const [sending, setSending] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const prevSubscribedConvRef = useRef<string | null>(null);
  const activeConvIdRef = useRef<string | null>(null);
  const messageIdsRef = useRef<Set<string>>(new Set());
  const attemptedCreateRef = useRef<string | null>(null);

  const conversationId = conversation?.id ?? null;

  useEffect(() => {
    activeConvIdRef.current = conversationId;
  }, [conversationId]);

  const applyConversation = useCallback((conv: ConversationWithMessages) => {
    setConversation(conv);
    const list = Array.isArray(conv.messages) ? conv.messages : [];
    messageIdsRef.current = new Set(list.map((m) => m.id));
    setMessages(list);
  }, []);

  const loadConversation = useCallback(async () => {
    if (!installerId || !customerId) {
      setConversation(null);
      setMessages([]);
      messageIdsRef.current.clear();
      setPeerAvailable(false);
      setLoadState("ready");
      setLoadError(null);
      return;
    }

    setLoadState("loading");
    setLoadError(null);

    try {
      const params = new URLSearchParams({
        installerId,
        customerId,
        includeMessages: "true",
      });
      const res = await sessionFetch(`${api}/conversations?${params}`);
      if (!res.ok) {
        throw new Error(
          extractMessage(
            await res.json().catch(() => null),
            "Could not load conversation.",
          ),
        );
      }

      const payload = await res.json();
      const list = unwrapApiData<ConversationWithMessages[]>(payload);
      const rows = Array.isArray(list) ? list : [];
      const existing = rows[0];

      if (existing) {
        applyConversation(existing);
        setPeerAvailable(true);
        setLoadState("ready");
        return;
      }

      if (attemptedCreateRef.current === customerId) {
        setConversation(null);
        setMessages([]);
        messageIdsRef.current.clear();
        setPeerAvailable(false);
        setLoadState("ready");
        return;
      }

      attemptedCreateRef.current = customerId;
      const createRes = await sessionFetch(`${api}/conversations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ peerUserId: customerId }),
      });

      if (!createRes.ok) {
        setConversation(null);
        setMessages([]);
        messageIdsRef.current.clear();
        setPeerAvailable(false);
        if (createRes.status === 403) {
          setLoadState("ready");
          return;
        }
        throw new Error(
          extractMessage(
            await createRes.json().catch(() => null),
            "Could not start conversation.",
          ),
        );
      }

      const refetch = await sessionFetch(`${api}/conversations?${params}`);
      if (!refetch.ok) {
        throw new Error(
          extractMessage(
            await refetch.json().catch(() => null),
            "Could not load conversation.",
          ),
        );
      }
      const refetchPayload = await refetch.json();
      const refetchList = unwrapApiData<ConversationWithMessages[]>(refetchPayload);
      const created = (Array.isArray(refetchList) ? refetchList : [])[0];
      if (created) {
        applyConversation(created);
      } else {
        const createPayload = await createRes.json();
        const conv = unwrapApiData<ConversationWithMessages>(createPayload);
        if (conv?.id) {
          applyConversation({ ...conv, messages: [] });
        }
      }
      setPeerAvailable(true);
      setLoadState("ready");
    } catch (e) {
      setLoadState("error");
      setLoadError(
        e instanceof Error ? e.message : "Failed to load messaging.",
      );
    }
  }, [api, applyConversation, customerId, installerId, sessionFetch]);

  useEffect(() => {
    attemptedCreateRef.current = null;
    void loadConversation();
  }, [loadConversation]);

  useEffect(() => {
    let stopped = false;

    async function connect() {
      if (!installerId) return;
      const tokRes = await fetch(`${api}/ws-token`, { credentials: "include" });
      if (!tokRes.ok) return;
      const jar = (await tokRes.json()) as { token?: string };
      const token = jar.token;
      if (!token || stopped) return;

      const url = getChatWebSocketUrl(token);
      if (!url) {
        setWsState("error");
        return;
      }

      setWsState("connecting");
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        if (stopped) return;
        setWsState("open");
        const cid = activeConvIdRef.current;
        if (cid) {
          ws.send(JSON.stringify({ type: "subscribe", conversationId: cid }));
          prevSubscribedConvRef.current = cid;
        }
      };

      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(String(ev.data)) as {
            type?: string;
            payload?: ChatMessage;
          };
          if (msg.type === "message" && msg.payload?.id) {
            const p = msg.payload;
            if (messageIdsRef.current.has(p.id)) return;
            messageIdsRef.current.add(p.id);
            setMessages((prev) => {
              if (prev.some((m) => m.id === p.id)) return prev;
              return [...prev, p];
            });
          }
        } catch {
          /* ignore */
        }
      };

      ws.onerror = () => {
        if (!stopped) setWsState("error");
      };

      ws.onclose = () => {
        if (!stopped) setWsState("idle");
      };
    }

    void connect();

    return () => {
      stopped = true;
      wsRef.current?.close();
      wsRef.current = null;
      prevSubscribedConvRef.current = null;
    };
  }, [api, installerId]);

  useEffect(() => {
    const ws = wsRef.current;
    const cid = conversationId;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    const prev = prevSubscribedConvRef.current;
    if (prev && prev !== cid) {
      ws.send(JSON.stringify({ type: "unsubscribe", conversationId: prev }));
    }
    if (cid) {
      ws.send(JSON.stringify({ type: "subscribe", conversationId: cid }));
      prevSubscribedConvRef.current = cid;
    } else {
      prevSubscribedConvRef.current = null;
    }
  }, [conversationId]);

  const sendText = useCallback(
    async (body: string) => {
      const trimmed = body.trim();
      if (!trimmed || !conversationId || !installerId) return;

      const ws = wsRef.current;
      if (isChatWebSocketSendReady(ws)) {
        ws.send(
          JSON.stringify({
            type: "send",
            conversationId,
            body: trimmed,
          }),
        );
        return;
      }

      setSending(true);
      try {
        const res = await sessionFetch(
          `${api}/conversations/${conversationId}/messages`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ body: trimmed }),
          },
        );
        if (!res.ok) return;
        const payload = await res.json();
        const msg = unwrapApiData<ChatMessage>(payload);
        if (msg?.id && !messageIdsRef.current.has(msg.id)) {
          messageIdsRef.current.add(msg.id);
          setMessages((prev) => [...prev, msg]);
        }
      } finally {
        setSending(false);
      }
    },
    [api, conversationId, installerId, sessionFetch],
  );

  const activeContactName = useMemo(() => {
    if (conversation?.customer) {
      return customerDisplayName(conversation.customer);
    }
    return "Customer";
  }, [conversation]);

  return {
    messages,
    sendText,
    loadState,
    loadError,
    wsState,
    sending,
    peerAvailable,
    conversationReady: Boolean(conversationId),
    activeContactName,
    userId: installerId,
    refresh: loadConversation,
  };
}
