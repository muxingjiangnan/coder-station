import { message } from "antd";
import { streamChatMessage } from "../../api/chat";
import {
  createTempMessageId,
  deriveSessionTitle,
  isTempSessionId,
} from "./helpers";

/**
 * 替换临时会话为真实会话
 * @param {Object} params
 * @param {string} params.tempSessionId
 * @param {string} params.realSessionId
 * @param {Array} params.sessions
 * @param {Object} params.messagesBySession
 * @param {Function} params.onUpdateSessions
 * @param {Function} params.onUpdateMessages
 * @param {Function} params.onUpdateActiveSessionId
 */
export function replaceTempSession({
  tempSessionId,
  realSessionId,
  tempMessages,
  onUpdateSessions,
  onUpdateMessages,
  onUpdateActiveSessionId,
}) {
  const title = deriveSessionTitle(tempMessages[0]?.content || "");

  const realSession = {
    id: realSessionId,
    title,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastMessageAt: new Date().toISOString(),
  };

  onUpdateSessions((prev) => [realSession, ...prev.filter((s) => s.id !== tempSessionId)]);
  onUpdateMessages(realSessionId, tempMessages);
  onUpdateMessages(tempSessionId, undefined);
  onUpdateActiveSessionId(realSessionId);
}

/**
 * 开始发送消息（含乐观渲染）
 * @param {Object} params
 * @param {string} params.activeSessionId
 * @param {string} params.content
 * @param {Array} params.sessions
 * @param {Object} params.messagesBySession
 * @param {Function} params.onUpdateMessages
 * @param {Function} params.onUpdateSessions
 * @param {Function} params.onUpdateActiveSessionId
 * @param {Function} params.onUpdateSending
 * @param {Function} params.onUpdateComposerValue
 */
export function startSendMessage({
  activeSessionId,
  content,
  sessions,
  messagesBySession,
  onUpdateMessages,
  onUpdateSessions,
  onUpdateActiveSessionId,
  onUpdateSending,
  onUpdateComposerValue,
}) {
  const trimmed = content.trim();
  if (!trimmed) return;

  const isTemp = isTempSessionId(activeSessionId);
  const tempSessionId = activeSessionId;
  const tempUserMessageId = createTempMessageId("user");
  const tempAssistantMessageId = createTempMessageId("assistant");

  const now = new Date().toISOString();
  const userMessage = {
    id: tempUserMessageId,
    role: "user",
    content: trimmed,
    createdAt: now,
  };
  const assistantMessage = {
    id: tempAssistantMessageId,
    role: "assistant",
    content: "",
    createdAt: now,
  };

  const currentMessages = messagesBySession[tempSessionId] || [];
  const newMessages = [...currentMessages, userMessage, assistantMessage];
  onUpdateMessages(tempSessionId, newMessages);
  onUpdateSending(true);
  onUpdateComposerValue("");

  let realSessionId = null;

  const callbacks = {
    new_session: ({ sessionId }) => {
      realSessionId = sessionId;
      replaceTempSession({
        tempSessionId,
        realSessionId: sessionId,
        tempMessages: newMessages,
        onUpdateSessions,
        onUpdateMessages,
        onUpdateActiveSessionId,
      });
    },
    delta: ({ text }) => {
      const targetId = realSessionId || tempSessionId;
      onUpdateMessages(targetId, (msgs) =>
        msgs.map((msg) =>
          msg.id === tempAssistantMessageId
            ? { ...msg, content: msg.content + text }
            : msg
        )
      );
    },
    title_updated: ({ sessionId, title }) => {
      onUpdateSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, title } : s))
      );
    },
    done: ({ sessionId, userMessageId, assistantMessageId }) => {
      const targetId = sessionId || realSessionId || tempSessionId;
      onUpdateMessages(targetId, (msgs) =>
        msgs.map((msg) => {
          if (msg.id === tempUserMessageId) return { ...msg, id: userMessageId };
          if (msg.id === tempAssistantMessageId) return { ...msg, id: assistantMessageId };
          return msg;
        })
      );
      onUpdateSending(false);
    },
    error: ({ message: errorMsg }) => {
      console.error("聊天流错误:", errorMsg);
      message.error(`AI 回复失败：${errorMsg || "未知错误"}`);
      const targetId = realSessionId || tempSessionId;
      onUpdateMessages(targetId, (msgs) =>
        msgs.filter((msg) => msg.id !== tempAssistantMessageId)
      );
      onUpdateSending(false);
    },
  };

  streamChatMessage(
    {
      sessionId: isTemp ? undefined : activeSessionId,
      content: trimmed,
    },
    callbacks
  ).catch((err) => {
    console.error("发送消息请求失败:", err);
    message.error(`发送消息失败：${err.message || "未知错误"}`);
    const targetId = realSessionId || tempSessionId;
    onUpdateMessages(targetId, (msgs) =>
      msgs.filter((msg) => msg.id !== tempAssistantMessageId)
    );
    onUpdateSending(false);
  });
}
