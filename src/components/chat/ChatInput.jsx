import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

export default function ChatInput({ onSend, disabled, autoFocus }) {
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus) {
      // Small delay so the open animation completes first
      const t = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(t);
    }
  }, [autoFocus]);

  function submit() {
    if (!text.trim() || disabled) return;
    onSend(text);
    setText("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-white border-t border-gray-100 shrink-0">
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        disabled={disabled}
        aria-label="Chat message input"
        className="flex-1 min-h-[44px] py-2.5 px-4 rounded-full text-[16px] bg-gray-50 border border-gray-100 outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/15 transition-all placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button
        onClick={submit}
        disabled={!text.trim() || disabled}
        aria-label="Send message"
        className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95"
        style={{ background: "#C9A961" }}
      >
        <Send size={16} className="text-white ml-0.5" />
      </button>
    </div>
  );
}
