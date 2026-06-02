/**
 * 格式化聊天时间戳
 * @param {string|number|Date} value
 * @returns {string}
 */
export function formatChatTimestamp(value) {
  if (!value) return "--";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "--";
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  if (isToday) {
    return `${hours}:${minutes}`;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * 从内容生成会话标题
 * @param {string} content
 * @returns {string}
 */
export function deriveSessionTitle(content) {
  if (!content) return "新会话";
  return truncateText(content.trim(), 18);
}

/**
 * 生成临时会话 ID
 * @returns {string}
 */
export function createTempSessionId() {
  return `temp-session-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * 生成临时消息 ID
 * @param {"user"|"assistant"} role
 * @returns {string}
 */
export function createTempMessageId(role) {
  return `temp-msg-${role}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * 截断文本
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text || "";
  return text.slice(0, maxLength) + "...";
}

/**
 * 判断是否为临时会话 ID
 * @param {string} sessionId
 * @returns {boolean}
 */
export function isTempSessionId(sessionId) {
  return typeof sessionId === "string" && sessionId.startsWith("temp-session-");
}
