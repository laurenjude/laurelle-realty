import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";

export default function ChatWindow({ isOpen, onClose, messages, onSend, isSending }) {
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isSending]);

  return (
    <div
      role="dialog"
      aria-label="Laurelle Assistant chat"
      aria-modal="false"
      className={[
        // Base layout
        "fixed z-40 flex flex-col bg-white overflow-hidden",
        // Mobile: full-screen overlay
        "inset-0",
        // Desktop: fixed-size window above the bubble
        "sm:inset-auto sm:bottom-[104px] sm:right-4 lg:right-6",
        "sm:w-[380px] sm:h-[580px]",
        "sm:rounded-2xl sm:shadow-2xl sm:border sm:border-gray-100",
        // Open / close animation
        "transition-all duration-300 ease-out",
        isOpen
          ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
          : "opacity-0 translate-y-full sm:translate-y-8 sm:scale-95 pointer-events-none",
      ].join(" ")}
    >
      {/* ── Header ────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-3 px-4 py-3.5 shrink-0"
        style={{ background: "#0F4C3A" }}
      >
        {/* Avatar */}
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 font-bold text-white text-base"
          style={{ background: "#C9A961" }}
        >
          L
        </div>

        {/* Title + status */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm leading-tight">
            Laurelle Assistant
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-success shrink-0" />
            <span className="text-white/70 text-xs">Online</span>
          </div>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close chat"
          className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* ── Messages ──────────────────────────────────────────────── */}
      <div
        aria-live="polite"
        aria-label="Chat messages"
        className="flex-1 overflow-y-auto px-4 pt-4 pb-2 chat-scroll"
        style={{ background: "#F5F0E6" }}
      >
        {messages.length === 0 && !isSending && (
          <p className="text-center text-xs text-gray-400 mt-8">
            Start a conversation…
          </p>
        )}

        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isSending && <TypingIndicator />}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} className="h-1" />
      </div>

      {/* ── Input ─────────────────────────────────────────────────── */}
      <ChatInput onSend={onSend} disabled={isSending} autoFocus={isOpen} />
    </div>
  );
}
