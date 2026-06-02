import { NewSessionButton } from "./NewSessionButton";
import { SessionList } from "./SessionList";

export const ChatSidebar = ({
  sessions,
  activeSessionId,
  loading,
  hasMore,
  onStartNewSession,
  onSelectSession,
  onLoadMore,
  onRenameSession,
  onDeleteSession,
}) => {
  return (
    <aside className="chat-sidebar">
      <div className="chat-sidebar__top">
        <div className="chat-sidebar__brand">AI 聊天</div>
        <NewSessionButton onClick={onStartNewSession} />
      </div>

      <SessionList
        sessions={sessions}
        activeSessionId={activeSessionId}
        loading={loading}
        hasMore={hasMore}
        onSelectSession={onSelectSession}
        onLoadMore={onLoadMore}
        onRenameSession={onRenameSession}
        onDeleteSession={onDeleteSession}
      />
    </aside>
  );
};
