import { ChatMain } from "../../components/Chat/ChatMain";
import { ChatSidebar } from "../../components/Chat/ChatSidebar";
import { useChatPageModel } from "../../hooks/useChatPageModel";
import "../../css/chat.css";

export const ChatPage = () => {
  const model = useChatPageModel();

  return (
    <main className="chat-page-shell">
      <div className="chat-page">
        <ChatSidebar
          sessions={model.sessions}
          activeSessionId={model.activeSessionId}
          loading={model.sessionsLoading}
          hasMore={model.sessionsHasMore}
          onStartNewSession={model.handleStartNewSession}
          onSelectSession={model.handleSelectSession}
          onLoadMore={model.handleLoadMoreSessions}
          onRenameSession={model.handleRenameSession}
          onDeleteSession={model.handleDeleteSession}
        />
        <ChatMain
          session={model.activeSession}
          messages={model.activeMessages}
          messagesLoading={model.activeMessagesLoading}
          messagesHasMore={model.activeMessagesHasMore}
          sending={model.sending}
          composerValue={model.composerValue}
          onComposerChange={model.setComposerValue}
          onSubmit={model.handleSubmit}
          onStartNewSession={model.handleStartNewSession}
          onLoadOlderMessages={model.handleLoadOlderMessages}
        />
      </div>
    </main>
  );
};
