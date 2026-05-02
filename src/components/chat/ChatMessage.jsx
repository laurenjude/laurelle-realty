import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function formatTime(iso) {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

// Markdown component overrides so AI responses look clean inside a small bubble
const mdComponents = {
  p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => (
    <ul className="list-disc list-outside pl-4 space-y-0.5 my-2 last:mb-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside pl-4 space-y-0.5 my-2 last:mb-0">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-2 hover:opacity-80 transition-opacity"
      style={{ color: "#C9A961" }}
    >
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="px-1 py-0.5 bg-gray-100 rounded text-xs font-mono">{children}</code>
  ),
};

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end mb-3">
        <div className="max-w-[80%]">
          <div
            className="px-3.5 py-2.5 text-sm text-white leading-relaxed break-words"
            style={{
              background: "#0F4C3A",
              borderRadius: "16px 16px 4px 16px",
            }}
          >
            {message.content}
          </div>
          <p className="text-right text-[11px] text-gray-400 mt-1 pr-1">
            {formatTime(message.timestamp)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 mb-3">
      {/* AI avatar */}
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1"
        style={{ background: "#C9A961" }}
      >
        <span className="text-white text-[10px] font-bold">L</span>
      </div>

      <div className="max-w-[80%]">
        <div
          className="bg-white px-3.5 py-2.5 text-sm text-dark shadow-sm break-words"
          style={{ borderRadius: "16px 16px 16px 4px" }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
            {message.content}
          </ReactMarkdown>
        </div>
        <p className="text-[11px] text-gray-400 mt-1 pl-1">
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}
