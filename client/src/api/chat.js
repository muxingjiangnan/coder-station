import request from "./request";

/**
 * 获取会话列表
 * @param {number} [page=1]
 * @param {number} [pageSize=20]
 * @returns {Promise<{code:number,msg:string,data:any}>}
 */
export function listChatSessions(page = 1, pageSize = 20) {
  return request({ url: "/api/chat/sessions", method: "GET", params: { page, pageSize } });
}

/**
 * 获取会话消息列表
 * @param {string} sessionId
 * @param {number} [beforeSeq]
 * @param {number} [limit=10]
 * @returns {Promise<{code:number,msg:string,data:any}>}
 */
export function listChatSessionMessages(sessionId, beforeSeq, limit = 10) {
  return request({
    url: `/api/chat/sessions/${sessionId}/messages`,
    method: "GET",
    params: { beforeSeq, limit },
  });
}

/**
 * 修改会话标题
 * @param {string} sessionId
 * @param {string} title
 * @returns {Promise<{code:number,msg:string,data:any}>}
 */
export function patchChatSessionTitle(sessionId, title) {
  return request({
    url: `/api/chat/sessions/${sessionId}/title`,
    method: "PATCH",
    data: { title },
  });
}

/**
 * 删除会话
 * @param {string} sessionId
 * @returns {Promise<{code:number,msg:string,data:any}>}
 */
export function deleteChatSession(sessionId) {
  return request({ url: `/api/chat/sessions/${sessionId}`, method: "DELETE" });
}

/**
 * 发起 SSE 流式聊天请求
 * @param {{sessionId?:string, content:string}} payload
 * @param {Object} callbacks - 事件回调对象
 * @returns {Promise<void>}
 */
export function streamChatMessage({ sessionId, content }, callbacks) {
  const token = localStorage.getItem("userToken");
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  return fetch("/api/chat/messages/stream", {
    method: "POST",
    headers,
    body: JSON.stringify({ sessionId, content }),
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const reader = response.body.getReader();
    await readSseStream(reader, callbacks);
  });
}

/**
 * 读取 SSE 流
 * @param {ReadableStreamDefaultReader} reader
 * @param {Object} callbacks
 */
async function readSseStream(reader, callbacks) {
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let lineEnd;
      while ((lineEnd = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, lineEnd).trimEnd();
        buffer = buffer.slice(lineEnd + 1);

        if (line.startsWith("data:")) {
          const dataStr = line.slice(5).trim();
          if (dataStr === "[DONE]") continue;
          try {
            const event = JSON.parse(dataStr);
            resolveStreamEvent(event, callbacks);
          } catch (e) {
            console.error("解析 SSE 数据失败:", e, dataStr);
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * 解析 SSE 事件并分发到对应回调
 * @param {{code:number,msg:string,data:any}} event
 * @param {Object} callbacks
 */
function resolveStreamEvent(event, callbacks) {
  if (event.code !== 0) {
    emitStreamEvent(
      "error",
      { code: event.code, message: event.msg || event.message || "未知错误", data: event.data },
      callbacks
    );
    return;
  }

  const data = event.data;
  if (!data || !data.type) return;

  switch (data.type) {
    case "new_session":
      emitStreamEvent("new_session", { sessionId: data.sessionId }, callbacks);
      break;
    case "delta":
      emitStreamEvent("delta", { text: data.text }, callbacks);
      break;
    case "title_updated":
      emitStreamEvent("title_updated", { sessionId: data.sessionId, title: data.title }, callbacks);
      break;
    case "done":
      emitStreamEvent(
        "done",
        {
          sessionId: data.sessionId,
          userMessageId: data.userMessageId,
          assistantMessageId: data.assistantMessageId,
        },
        callbacks
      );
      break;
    case "error":
      emitStreamEvent("error", { code: data.code, message: data.message, data: data.data }, callbacks);
      break;
    default:
      break;
  }
}

/**
 * 触发回调事件
 * @param {string} type
 * @param {Object} payload
 * @param {Object} callbacks
 */
function emitStreamEvent(type, payload, callbacks) {
  if (callbacks && typeof callbacks[type] === "function") {
    callbacks[type](payload);
  }
}
