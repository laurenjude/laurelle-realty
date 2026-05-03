import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";

export default function ChatWindow({ isOpen, onClose, messages, onSend, isSending }) {
  const messagesEndRef = useRef(null);

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
        "fixed z-40 flex flex-col bg-white overflow-hidden",
        // Mobile (<768px): true full-screen overlay
        "inset-0",
        // Desktop (≥768px): corner window, height capped so it never overflows viewport
        "md:inset-auto md:bottom-[90px] md:right-6",
        "md:w-[380px] md:h-[580px] md:max-h-[calc(100vh_-_160px)]",
        "md:rounded-2xl md:shadow-2xl md:border md:border-gray-100",
        // Animation — 250ms, GPU-accelerated, respects prefers-reduced-motion
        "transition-all duration-[250ms] ease-out motion-reduce:transition-none",
        isOpen
          ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
          : "opacity-0 translate-y-full md:translate-y-4 md:scale-95 pointer-events-none",
      ].join(" ")}
    >
      {/* ── Header ──────────────────────────────────────────────────────
          On mobile the close button moves to the LEFT (order-first) so it
          matches native app conventions (WhatsApp / Messages style).
          On desktop it stays on the RIGHT (md:order-last).
          paddingTop absorbs the iOS/Android status-bar safe-area so the
          header background fills behind the notch correctly.
      ─────────────────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-3 px-4 shrink-0"
        style={{
          background: "#0F4C3A",
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)",
          paddingBottom: "14px",
        }}
      >
        {/* Close button — LEFT on mobile, RIGHT on desktop */}
        <button
          onClick={onClose}
          aria-label="Close chat"
          className="order-last w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={20} />
        </button>

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
            <span className="text-white md:text-white/70 text-xs">Online</span>
          </div>
        </div>
      </div>

      {/* ── Messages ────────────────────────────────────────────────── */}
      <div
        aria-live="polite"
        aria-label="Chat messages"
        className="flex-1 overflow-y-auto px-4 pt-4 pb-2 chat-scroll overscroll-none"
        style={{
          background: "#F5F0E6",
          WebkitOverflowScrolling: "touch",
        }}
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

        <div ref={messagesEndRef} className="h-1" />
      </div>

      {/* ── Input — safe-area-inset-bottom keeps it above home indicator ── */}
      <div
        className="shrink-0 bg-white"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <ChatInput onSend={onSend} disabled={isSending} autoFocus={isOpen} />
      </div>
    </div>
  );
}
