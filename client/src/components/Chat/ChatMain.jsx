import { Button, Empty, Spin, Typography } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";

import { ChatInput } from "./ChatInput";
import { ChatScrollToBottomButton } from "./ChatScrollToBottomButton";
import { MessageList } from "./MessageList";

export const ChatMain = ({
  session,
  messages,
  messagesLoading,
  messagesHasMore,
  sending,
  composerValue,
  onComposerChange,
  onSubmit,
  onStartNewSession,
  onLoadOlderMessages,
}) => {
  const scrollRef = useRef(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const isDraftSession = !session;

  const headerTitle = useMemo(() => {
    if (!session) {
      return "新会话";
    }

    return session.title;
  }, [session]);

  useEffect(() => {
    if (!scrollRef.current || !isNearBottom) {
      return;
    }

    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [isNearBottom, messages, sending]);

  const handleScroll = () => {
    const element = scrollRef.current;

    if (!element) {
      return;
    }

    const distanceToBottom = element.scrollHeight - element.scrollTop - element.clientHeight;
    setIsNearBottom(distanceToBottom < 72);
  };

  const scrollToBottom = () => {
    const element = scrollRef.current;

    if (!element) {
      return;
    }

    element.scrollTo({
      top: element.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <section className={isDraftSession ? "chat-main chat-main--blank" : "chat-main"}>
      {isDraftSession ? (
        <div className="chat-main__blank-composer">
          <ChatInput
            value={composerValue}
            disabled={false}
            loading={sending}
            onChange={onComposerChange}
            onSubmit={onSubmit}
            autoFocus
          />
        </div>
      ) : (
        <>
          <header className="chat-main__header">
            <div>
              <Typography.Title level={4} className="chat-main__title">
                {headerTitle}
              </Typography.Title>
              <Typography.Text type="secondary" className="chat-main__subtitle">
                {`${messages.length} 条消息`}
              </Typography.Text>
            </div>

            <button type="button" className="chat-main__reset" onClick={onStartNewSession}>
              开启新会话
            </button>
          </header>

          <div className="chat-main__body">
            <>
              <div className="chat-main__messages-shell">
                {messagesHasMore ? (
                  <div className="chat-main__load-more">
                    <Button type="link" onClick={onLoadOlderMessages} disabled={messagesLoading}>
                      {messagesLoading ? "加载中..." : "加载更早消息"}
                    </Button>
                  </div>
                ) : null}

                {messagesLoading && messages.length === 0 ? (
                  <div className="chat-main__loading">
                    <Spin />
                  </div>
                ) : null}

                {!messagesLoading && messages.length === 0 ? (
                  <div className="chat-main__empty">
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无消息，开始提问吧" />
                  </div>
                ) : null}

                {messages.length > 0 ? <MessageList messages={messages} scrollRef={scrollRef} onScroll={handleScroll} /> : null}
              </div>

              <ChatScrollToBottomButton visible={!isNearBottom && messages.length > 0} onClick={scrollToBottom} />
            </>
          </div>

          <footer className="chat-main__composer">
            <ChatInput
              value={composerValue}
              disabled={false}
              loading={sending}
              onChange={onComposerChange}
              onSubmit={onSubmit}
              autoFocus
            />
          </footer>
        </>
      )}
    </section>
  );
};
