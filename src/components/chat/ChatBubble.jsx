import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";

export default function ChatBubble({ isOpen, onClick }) {
  const [pulse, setPulse] = useState(true);
  const [showDot, setShowDot] = useState(true);

  // Pulse for 3 s on first load to draw attention
  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 3000);
    return () => clearTimeout(t);
  }, []);

  function handleClick() {
    setShowDot(false);
    onClick();
  }

  return (
    <button
      onClick={handleClick}
      aria-label={isOpen ? "Close chat" : "Open chat with Laurelle Assistant"}
      className={[
        "fixed bottom-5 right-4 md:bottom-6 md:right-6 z-50",
        "w-14 h-14 md:w-[60px] md:h-[60px]",
        "rounded-full flex items-center justify-center",
        "transition-all duration-[250ms] ease-out",
        "hover:scale-105 active:scale-95",
        pulse && !isOpen ? "animate-pulse" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        background: "linear-gradient(135deg, #D4B06A 0%, #C9A961 50%, #B8943D 100%)",
        boxShadow: "0 4px 16px rgba(15, 76, 58, 0.25)",
      }}
    >
      {/* New-visitor notification dot */}
      {showDot && !isOpen && (
        <span className="absolute top-0.5 right-0.5 w-3 h-3 bg-success rounded-full border-2 border-white" />
      )}

      {/* Icon: toggles between MessageCircle and X */}
      <span className="relative w-6 h-6">
        <MessageCircle
          size={24}
          className={[
            "text-white absolute inset-0 transition-all duration-200",
            isOpen ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100",
          ].join(" ")}
        />
        <X
          size={20}
          className={[
            "text-white absolute inset-0 m-auto transition-all duration-200",
            isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75",
          ].join(" ")}
        />
      </span>
    </button>
  );
}
