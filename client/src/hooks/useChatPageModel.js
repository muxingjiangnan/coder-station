import { useState, useCallback, useEffect, useRef } from "react";
import {
  listChatSessions,
  listChatSessionMessages,
  patchChatSessionTitle,
  deleteChatSession,
} from "../api/chat";
import { startSendMessage } from "../utils/chat/chatSend";
import {
  createTempSessionId,
  isTempSessionId,
} from "../utils/chat/helpers";

/**
 * 按更新时间倒序排序会话
 * @param {Array} sessions
 * @returns {Array}
 */
function sortSessions(sessions) {
  return [...sessions].sort((a, b) => {
    const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return bTime - aTime;
  });
}

/**
 * 合并会话列表，以 incoming 为准覆盖现有字段
 * @param {Array} existing
 * @param {Array} incoming
 * @returns {Array}
 */
function mergeSessions(existing, incoming) {
  const map = new Map();
  existing.forEach((s) => map.set(s.id, s));
  incoming.forEach((s) => {
    const prev = map.get(s.id);
    map.set(s.id, prev ? { ...prev, ...s } : s);
  });
  return Array.from(map.values());
}

/**
 * 合并消息列表，按 seq 升序排序
 * @param {Array} existing
 * @param {Array} incoming
 * @returns {Array}
 */
function mergeMessages(existing, incoming) {
  const map = new Map();
  existing.forEach((m) => map.set(m.id, m));
  incoming.forEach((m) => {
    const prev = map.get(m.id);
    map.set(m.id, prev ? { ...prev, ...m } : m);
  });
  return Array.from(map.values()).sort((a, b) => {
    const aSeq = typeof a.seq === "number" ? a.seq : 0;
    const bSeq = typeof b.seq === "number" ? b.seq : 0;
    return aSeq - bSeq;
  });
}

/**
 * 聊天页面状态管理 Hook
 * @returns {Object}
 */
export function useChatPageModel() {
  const token = localStorage.getItem("userToken");
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messagesBySession, setMessagesBySession] = useState({});
  const [composerValue, setComposerValue] = useState("");
  const [sending, setSending] = useState(false);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsHasMore, setSessionsHasMore] = useState(false);
  const [activeMessagesLoading, setActiveMessagesLoading] = useState(false);
  const [activeMessagesHasMore, setActiveMessagesHasMore] = useState(false);

  const messagesBySessionRef = useRef(messagesBySession);
  messagesBySessionRef.current = messagesBySession;
  const sessionsRef = useRef(sessions);
  sessionsRef.current = sessions;

  // 加载会话列表
  const loadSessions = useCallback(async () => {
    if (!token) return;
    setSessionsLoading(true);
    try {
      const res = await listChatSessions(1, 50);
      if (res.code === 0) {
        const data = res.data || {};
        const list = data.list || [];
        const total = data.total || 0;
        setSessions((prev) => sortSessions(mergeSessions(prev, list)));
        setSessionsHasMore(list.length < total);
      }
    } catch (err) {
      console.error("加载会话列表失败:", err);
    } finally {
      setSessionsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // 加载消息
  const loadMessages = useCallback(
    async (sessionId, beforeSeq) => {
      if (!sessionId || isTempSessionId(sessionId)) return;
      setActiveMessagesLoading(true);
      try {
        const res = await listChatSessionMessages(sessionId, beforeSeq, 20);
        if (res.code === 0) {
          const data = res.data || {};
          const list = data.list || [];
          const hasMore = data.hasMore || false;
          setMessagesBySession((prev) => {
            const existing = prev[sessionId] || [];
            return {
              ...prev,
              [sessionId]: mergeMessages(existing, list),
            };
          });
          setActiveMessagesHasMore(hasMore);
        }
      } catch (err) {
        console.error("加载消息失败:", err);
        loadedSessionIdsRef.current.delete(sessionId);
      } finally {
        setActiveMessagesLoading(false);
      }
    },
    []
  );

  // 切换会话时自动加载消息
  const loadedSessionIdsRef = useRef(new Set());
  useEffect(() => {
    if (activeSessionId && !isTempSessionId(activeSessionId)) {
      const msgs = messagesBySession[activeSessionId];
      if ((!msgs || msgs.length === 0) && !loadedSessionIdsRef.current.has(activeSessionId)) {
        loadedSessionIdsRef.current.add(activeSessionId);
        loadMessages(activeSessionId);
      }
    }
  }, [activeSessionId, messagesBySession, loadMessages]);

  // 计算当前会话
  const activeSession = (() => {
    if (!activeSessionId) return null;
    const s = sessions.find((s) => s.id === activeSessionId);
    if (s) return s;
    const msgs = messagesBySession[activeSessionId];
    if (!msgs || msgs.length === 0) return null;
    const firstUserMsg = msgs.find((m) => m.role === "user");
    return {
      id: activeSessionId,
      title: firstUserMsg?.content?.slice(0, 18) || "新会话",
      createdAt: msgs[0]?.createdAt,
      updatedAt: msgs[msgs.length - 1]?.createdAt,
    };
  })();

  const activeMessages = activeSessionId ? messagesBySession[activeSessionId] || [] : [];

  // 创建新会话
  const handleStartNewSession = useCallback(() => {
    setActiveSessionId(null);
    setComposerValue("");
  }, []);

  // 选择会话
  const handleSelectSession = useCallback((sessionId) => {
    setActiveSessionId(sessionId);
  }, []);

  // 加载更多会话
  const handleLoadMoreSessions = useCallback(() => {
    // 暂不支持分页加载更多
  }, []);

  // 加载更早消息
  const handleLoadOlderMessages = useCallback(() => {
    if (!activeSessionId || activeMessagesLoading || !activeMessagesHasMore) return;
    const msgs = messagesBySession[activeSessionId] || [];
    if (msgs.length === 0) return;
    const firstSeq = msgs[0].seq;
    loadMessages(activeSessionId, firstSeq);
  }, [activeSessionId, activeMessagesLoading, activeMessagesHasMore, messagesBySession, loadMessages]);

  // 发送消息
  const handleSubmit = useCallback(
    (content) => {
      const trimmed = (content ?? composerValue).trim();
      if (!trimmed || sending) return;

      let targetSessionId = activeSessionId;
      if (!targetSessionId) {
        targetSessionId = createTempSessionId();
        setActiveSessionId(targetSessionId);
        setMessagesBySession((prev) => ({ ...prev, [targetSessionId]: [] }));
      }

      startSendMessage({
        activeSessionId: targetSessionId,
        content: trimmed,
        sessions: sessionsRef.current,
        messagesBySession: messagesBySessionRef.current,
        onUpdateMessages: (sessionId, updater) => {
          setMessagesBySession((prev) => {
            const current = prev[sessionId] || [];
            const next = typeof updater === "function" ? updater(current) : updater;
            if (next === undefined) {
              const { [sessionId]: _, ...rest } = prev;
              return rest;
            }
            return {
              ...prev,
              [sessionId]: next,
            };
          });
        },
        onUpdateSessions: (updater) => {
          setSessions((prev) => sortSessions(typeof updater === "function" ? updater(prev) : updater));
        },
        onUpdateActiveSessionId: setActiveSessionId,
        onUpdateSending: setSending,
        onUpdateComposerValue: setComposerValue,
      });
    },
    [composerValue, sending, activeSessionId]
  );

  // 修改标题
  const handleRenameSession = useCallback(
    async (sessionId, title) => {
      if (isTempSessionId(sessionId)) return;
      try {
        const res = await patchChatSessionTitle(sessionId, title);
        if (res.code === 0) {
          setSessions((prev) =>
            prev.map((s) => (s.id === sessionId ? { ...s, title } : s))
          );
        }
      } catch (err) {
        console.error("修改标题失败:", err);
      }
    },
    []
  );

  // 删除会话
  const handleDeleteSession = useCallback(
    async (sessionId) => {
      const clearSession = () => {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        setMessagesBySession((prev) => {
          const next = { ...prev };
          delete next[sessionId];
          return next;
        });
        if (activeSessionId === sessionId) {
          setActiveSessionId(null);
        }
      };

      if (isTempSessionId(sessionId)) {
        clearSession();
        return;
      }
      try {
        const res = await deleteChatSession(sessionId);
        if (res.code === 0) {
          clearSession();
        }
      } catch (err) {
        console.error("删除会话失败:", err);
      }
    },
    [activeSessionId]
  );

  return {
    sessions,
    activeSession,
    activeSessionId,
    activeMessages,
    sessionsLoading,
    sessionsHasMore,
    activeMessagesLoading,
    activeMessagesHasMore,
    sending,
    composerValue,
    setComposerValue,
    handleStartNewSession,
    handleSelectSession,
    handleLoadMoreSessions,
    handleRenameSession,
    handleDeleteSession,
    handleLoadOlderMessages,
    handleSubmit,
  };
}
