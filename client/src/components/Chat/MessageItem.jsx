import { Typography } from "antd";

import { formatChatTimestamp } from "../../utils/chat/helpers";
import { MarkdownMessage } from "./MarkdownMessage";

export const MessageItem = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={isUser ? "chat-message chat-message--user" : "chat-message chat-message--assistant"}>
      <div className="chat-message__avatar">{isUser ? "你" : "AI"}</div>

      <div className="chat-message__content">
        <div className="chat-message__bubble">
          {isUser ? <Typography.Paragraph>{message.content}</Typography.Paragraph> : <MarkdownMessage content={message.content} />}
        </div>

        <div className="chat-message__meta">{formatChatTimestamp(message.createdAt)}</div>
      </div>
    </div>
  );
};
