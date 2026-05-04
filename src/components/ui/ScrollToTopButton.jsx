import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 300);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={[
        "fixed bottom-[90px] right-6 z-40",
        "w-11 h-11 rounded-full flex items-center justify-center",
        "transition-all duration-200 ease-out",
        "hover:scale-105 active:scale-95",
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-2 pointer-events-none",
      ].join(" ")}
      style={{
        background: "#C9A961",
        boxShadow: "0 2px 12px rgba(201,169,97,0.35)",
      }}
    >
      <ChevronUp size={20} className="text-white" />
    </button>
  );
}
