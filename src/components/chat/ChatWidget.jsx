import useChat from "../../hooks/useChat";
import ChatBubble from "./ChatBubble";
import ChatWindow from "./ChatWindow";

export default function ChatWidget() {
  const { isOpen, toggleChat, messages, sendMessage, isSending } = useChat();

  return (
    <>
      <ChatWindow
        isOpen={isOpen}
        onClose={toggleChat}
        messages={messages}
        onSend={sendMessage}
        isSending={isSending}
      />
      {/* Bubble rendered after window so it always sits on top at the same z-level */}
      <ChatBubble isOpen={isOpen} onClick={toggleChat} />
    </>
  );
}
