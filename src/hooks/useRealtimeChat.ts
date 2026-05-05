import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  extractMessage,
  unwrapApiData,
} from "@/lib/customers/backend";
import { getChatWebSocketUrl } from "@/lib/chat/backend-origin";

export type ChatPeer = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type ConversationRow = {
  id: string;
  customerId: string;
  installerId: string;
  leadId: string | null;
  updatedAt: string;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  installer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  lastMessage: { body: string; createdAt: string; senderId: string } | null;
};

export type ChatMessage = {
  id: string;
  senderId: string;
  body: string;
  createdAt: string;
};

type Portal = "customer" | "installer";

type SessionFetch = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

/** `true` when `useRealtimeChat` will send via WebSocket (else HTTP POST). */
export function isChatWebSocketSendReady(
  ws: WebSocket | null,
): ws is WebSocket {
  return ws != null && ws.readyState === 1; // WebSocket.OPEN
}

function peerLabel(p: ChatPeer) {
  const n = `${p.firstName} ${p.lastName}`.trim();
  return n || p.email;
}

function otherName(c: ConversationRow, role: string) {
  if (role === "CUSTOMER") {
    const n = `${c.installer.firstName} ${c.installer.lastName}`.trim();
    return n || c.installer.email;
  }
  const n = `${c.customer.firstName} ${c.customer.lastName}`.trim();
  return n || c.customer.email;
}

export function formatChatTimeLabel(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export function useRealtimeChat(
  portal: Portal,
  sessionFetch: SessionFetch,
  user: { id: string; role: string } | null,
) {
  const api = portal === "customer" ? "/api/customers" : "/api/installers";
  const role = user?.role ?? "";
  const userId = user?.id ?? "";

  const [peers, setPeers] = useState<ChatPeer[]>([]);
  const [conversations, setConversations] = useState<ConversationRow[]>([]);
  const [activePeerId, setActivePeerId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [loadError, setLoadError] = useState<string | null>(null);
  const [wsState, setWsState] = useState<
    "idle" | "connecting" | "open" | "error"
  >("idle");
  const [sending, setSending] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const prevSubscribedConvRef = useRef<string | null>(null);
  const activeConvIdRef = useRef<string | null>(null);
  const messageIdsRef = useRef<Set<string>>(new Set());
  const attemptedCreateRef = useRef<Set<string>>(new Set());
  const lastPeerChoiceRef = useRef<string | null>(null);

  const conversationId = useMemo(() => {
    if (!activePeerId || !userId) return null;
    const row = conversations.find((c) =>
      role === "CUSTOMER"
        ? c.installerId === activePeerId
        : c.customerId === activePeerId,
    );
    return row?.id ?? null;
  }, [activePeerId, conversations, role, userId]);

  useEffect(() => {
    activeConvIdRef.current = conversationId;
  }, [conversationId]);

  const bootstrap = useCallback(async () => {
    if (!userId) return;
    setLoadState("loading");
    setLoadError(null);
    try {
      const [pr, cr] = await Promise.all([
        sessionFetch(`${api}/conversations/peers`),
        sessionFetch(`${api}/conversations`),
      ]);
      if (!pr.ok) {
        throw new Error(
          extractMessage(
            await pr.json().catch(() => null),
            "Could not load contacts.",
          ),
        );
      }
      if (!cr.ok) {
        throw new Error(
          extractMessage(
            await cr.json().catch(() => null),
            "Could not load conversations.",
          ),
        );
      }
      const prPayload = await pr.json();
      const peerList = unwrapApiData<ChatPeer[]>(prPayload);
      const convPayload = await cr.json();
      const convList = unwrapApiData<ConversationRow[]>(convPayload);

      const peersResolved = Array.isArray(peerList) ? peerList : [];
      const convResolved = Array.isArray(convList) ? convList : [];

      setPeers(peersResolved);
      setConversations(convResolved);

      setActivePeerId((current) => {
        if (peersResolved.length === 0) return null;
        if (
          current &&
          peersResolved.some((p: ChatPeer) => p.id === current)
        ) {
          return current;
        }
        return peersResolved[0].id;
      });

      setLoadState("ready");
    } catch (e) {
      setLoadState("error");
      setLoadError(e instanceof Error ? e.message : "Failed to load messaging.");
    }
  }, [api, sessionFetch, userId]);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    if (!activePeerId || conversationId || loadState !== "ready") return;
    if (!peers.some((p) => p.id === activePeerId)) return;
    if (attemptedCreateRef.current.has(activePeerId)) return;

    attemptedCreateRef.current.add(activePeerId);
    let cancelled = false;

    (async () => {
      try {
        const res = await sessionFetch(`${api}/conversations`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ peerUserId: activePeerId }),
        });
        if (cancelled) return;
        if (!res.ok) {
          return;
        }
        const payload = await res.json();
        const conv = unwrapApiData<ConversationRow>(payload);
        if (conv?.id) {
          setConversations((prev) => {
            if (prev.some((c) => c.id === conv.id)) return prev;
            return [
              {
                ...conv,
                leadId: conv.leadId ?? null,
                lastMessage: conv.lastMessage ?? null,
              },
              ...prev,
            ];
          });
        } else {
          await bootstrap();
        }
      } finally {
        /* allow retry only after switching peer */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    activePeerId,
    api,
    bootstrap,
    conversationId,
    loadState,
    peers,
    sessionFetch,
  ]);

  useEffect(() => {
    const prev = lastPeerChoiceRef.current;
    if (prev && prev !== activePeerId) {
      attemptedCreateRef.current.delete(prev);
    }
    lastPeerChoiceRef.current = activePeerId;
  }, [activePeerId]);

  useEffect(() => {
    let cancelled = false;

    async function loadMessages() {
      if (!conversationId) {
        setMessages([]);
        messageIdsRef.current.clear();
        return;
      }
      const res = await sessionFetch(
        `${api}/conversations/${conversationId}/messages?limit=100&page=1`,
      );
      if (cancelled) return;
      if (!res.ok) {
        setMessages([]);
        return;
      }
      const payload = await res.json();
      const data = unwrapApiData<ChatMessage[]>(payload);
      const list = Array.isArray(data) ? data : [];
      messageIdsRef.current = new Set(list.map((m) => m.id));
      setMessages(list);
    }

    void loadMessages();

    return () => {
      cancelled = true;
    };
  }, [api, conversationId, sessionFetch]);

  useEffect(() => {
    let stopped = false;

    async function connect() {
      if (!userId) return;
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
  }, [api, userId]);

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
      if (!trimmed || !conversationId || !userId) return;

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
    [api, conversationId, sessionFetch, userId],
  );

  const contacts = useMemo(
    () =>
      peers.map((p) => ({
        id: p.id,
        displayName: peerLabel(p),
      })),
    [peers],
  );

  const activeContactName = useMemo(() => {
    const p = peers.find((x) => x.id === activePeerId);
    if (p) return peerLabel(p);
    const c = conversations.find((x) =>
      role === "CUSTOMER"
        ? x.installerId === activePeerId
        : x.customerId === activePeerId,
    );
    return c ? otherName(c, role) : "Conversation";
  }, [activePeerId, conversations, peers, role]);

  return {
    contacts,
    activePeerId,
    setActivePeerId,
    activeContactName,
    messages,
    sendText,
    loadState,
    loadError,
    wsState,
    sending,
    conversationReady: Boolean(conversationId),
    refresh: bootstrap,
    userRole: role,
    userId,
  };
}
