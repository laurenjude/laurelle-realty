import { useState, useEffect, useCallback } from "react";

const WEBHOOK_URL = import.meta.env.VITE_N8N_CHAT_WEBHOOK;

const WELCOME_CONTENT = `Hello! 👋 Welcome to Laurelle Realty.

I'm your AI assistant, here to help you find your perfect home in Lagos.

I can help you:
- **Find properties** that match your preferences
- **Answer questions** about our services and process
- **Schedule viewings** and connect you with our agents

What can I help you with today?`;

function getOrCreateSessionId() {
  const KEY = "lr_session_id";
  let id = sessionStorage.getItem(KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(KEY, id);
  }
  return id;
}

function loadMessages() {
  try {
    const raw = sessionStorage.getItem("lr_chat_messages");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persist(msgs) {
  try {
    sessionStorage.setItem("lr_chat_messages", JSON.stringify(msgs));
  } catch {}
}

export default function useChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState(loadMessages);
  const [sessionId] = useState(getOrCreateSessionId);

  // Add welcome message the first time the window opens (if no history)
  useEffect(() => {
    if (!isOpen) return;
    setMessages((prev) => {
      if (prev.length > 0) return prev;
      const welcome = {
        id: "welcome",
        role: "assistant",
        content: WELCOME_CONTENT,
        timestamp: new Date().toISOString(),
      };
      const next = [welcome];
      persist(next);
      return next;
    });
  }, [isOpen]);

  const addMessage = useCallback((msg) => {
    setMessages((prev) => {
      const next = [...prev, msg];
      persist(next);
      return next;
    });
  }, []);

  const toggleChat = useCallback(() => setIsOpen((o) => !o), []);

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || isSending) return;

      addMessage({
        id: `u-${Date.now()}`,
        role: "user",
        content: trimmed,
        timestamp: new Date().toISOString(),
      });
      setIsSending(true);

      // Dev fallback when webhook is not configured
      if (!WEBHOOK_URL) {
        setTimeout(() => {
          addMessage({
            id: `a-${Date.now()}`,
            role: "assistant",
            content:
              "Webhook not configured yet. Add `VITE_N8N_CHAT_WEBHOOK` to your `.env` file.",
            timestamp: new Date().toISOString(),
          });
          setIsSending(false);
        }, 800);
        return;
      }

      try {
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 30000);

        const res = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed, sessionId }),
          signal: controller.signal,
        });
        clearTimeout(tid);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const { reply } = await res.json();

        addMessage({
          id: `a-${Date.now()}`,
          role: "assistant",
          content: reply || "I received your message.",
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        addMessage({
          id: `e-${Date.now()}`,
          role: "assistant",
          content:
            err.name === "AbortError"
              ? "Taking longer than expected. Please try again in a moment."
              : "Sorry, I'm having trouble right now. Please try again in a moment.",
          timestamp: new Date().toISOString(),
        });
      } finally {
        setIsSending(false);
      }
    },
    [isSending, sessionId, addMessage],
  );

  return { isOpen, toggleChat, messages, sendMessage, isSending };
}
