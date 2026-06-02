import { Button, Empty, Input, Modal, Spin } from "antd";
import { useMemo, useState } from "react";

import { SessionListItem } from "./SessionListItem";

export const SessionList = ({
  sessions,
  activeSessionId,
  loading,
  hasMore,
  onSelectSession,
  onLoadMore,
  onRenameSession,
  onDeleteSession,
}) => {
  const [renamingSessionId, setRenamingSessionId] = useState(null);
  const [titleDraft, setTitleDraft] = useState("");
  const [renameSubmitting, setRenameSubmitting] = useState(false);
  const [deletingSessionId, setDeletingSessionId] = useState(null);

  const renamingSession = useMemo(
    () => sessions.find((session) => session.id === renamingSessionId) ?? null,
    [renamingSessionId, sessions]
  );

  const openRenameModal = (session) => {
    setRenamingSessionId(session.id);
    setTitleDraft(session.title);
  };

  const closeRenameModal = () => {
    if (renameSubmitting) {
      return;
    }

    setRenamingSessionId(null);
    setTitleDraft("");
  };

  const submitRename = async () => {
    if (!renamingSessionId) {
      return;
    }

    const nextTitle = titleDraft.trim();

    if (!nextTitle) {
      return;
    }

    setRenameSubmitting(true);
    try {
      await onRenameSession(renamingSessionId, nextTitle);
      setRenamingSessionId(null);
      setTitleDraft("");
    } finally {
      setRenameSubmitting(false);
    }
  };

  const openDeleteConfirm = (session) => {
    Modal.confirm({
      title: "删除这个会话？",
      content: "删除后不可恢复。",
      okText: "删除",
      okButtonProps: { danger: true },
      cancelText: "取消",
      onOk: async () => {
        setDeletingSessionId(session.id);
        try {
          await onDeleteSession(session.id);
        } finally {
          setDeletingSessionId(null);
        }
      },
    });
  };

  return (
    <div className="chat-session-list">
      <div className="chat-sidebar__section-title">历史会话</div>

      <div className="chat-session-list__items">
        {sessions.map((session) => (
          <SessionListItem
            key={session.id}
            session={session}
            active={session.id === activeSessionId}
            onClick={() => onSelectSession(session.id)}
            onRename={() => openRenameModal(session)}
            onDelete={() => openDeleteConfirm(session)}
            actionDisabled={deletingSessionId === session.id}
          />
        ))}

        {!loading && sessions.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无会话" /> : null}

        {loading ? (
          <div className="chat-session-list__loading">
            <Spin size="small" />
          </div>
        ) : null}

        {!loading && hasMore ? (
          <Button type="link" onClick={onLoadMore}>
            加载更多
          </Button>
        ) : null}
      </div>

      <Modal
        title="编辑会话标题"
        visible={Boolean(renamingSession)}
        okText="保存"
        cancelText="取消"
        onOk={() => void submitRename()}
        onCancel={closeRenameModal}
        confirmLoading={renameSubmitting}
      >
        <Input
          value={titleDraft}
          maxLength={120}
          autoFocus
          placeholder="请输入新的会话标题"
          onChange={(event) => setTitleDraft(event.target.value)}
          onPressEnter={() => void submitRename()}
        />
      </Modal>
    </div>
  );
};
