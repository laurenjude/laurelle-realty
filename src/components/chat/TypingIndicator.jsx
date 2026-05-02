export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-2 mb-3">
      {/* AI avatar */}
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1"
        style={{ background: "#C9A961" }}
      >
        <span className="text-white text-[10px] font-bold">L</span>
      </div>

      {/* Bouncing dots bubble */}
      <div
        className="bg-white px-4 py-3 shadow-sm"
        style={{ borderRadius: "16px 16px 16px 4px" }}
      >
        <div className="flex items-center gap-1">
          {[0, 150, 300].map((delay) => (
            <span
              key={delay}
              className="block w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
