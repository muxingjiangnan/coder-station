import { MessageItem } from "./MessageItem";

export const MessageList = ({ messages, scrollRef, onScroll }) => {
  return (
    <div ref={scrollRef} className="chat-message-list" onScroll={onScroll}>
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </div>
  );
};
