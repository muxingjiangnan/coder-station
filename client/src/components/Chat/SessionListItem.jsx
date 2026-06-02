import { MoreOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu } from "antd";

export const SessionListItem = ({
  session,
  active,
  onClick,
  onRename,
  onDelete,
  actionDisabled = false,
}) => {
  const menu = (
    <Menu
      onClick={({ key, domEvent }) => {
        domEvent.stopPropagation();

        if (key === "rename") {
          onRename();
          return;
        }

        if (key === "delete") {
          onDelete();
        }
      }}
    >
      <Menu.Item key="rename" disabled={actionDisabled}>
        编辑标题
      </Menu.Item>
      <Menu.Item key="delete" danger disabled={actionDisabled}>
        删除
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={active ? "chat-session-item chat-session-item--active" : "chat-session-item"}>
      <button type="button" className="chat-session-item__select" onClick={onClick}>
        <div className="chat-session-item__body">
          <div className="chat-session-item__title">{session.title}</div>
        </div>

        <div className="chat-session-item__meta">
          {session.lastMessageAt
            ? new Intl.DateTimeFormat("zh-CN", { hour: "2-digit", minute: "2-digit" }).format(new Date(session.lastMessageAt))
            : "--:--"}
        </div>
      </button>

      <Dropdown
        trigger={["click"]}
        overlay={menu}
        placement="bottomRight"
      >
        <Button
          type="text"
          size="small"
          className="chat-session-item__actions"
          aria-label="会话操作"
          onClick={(event) => event.stopPropagation()}
        >
          <MoreOutlined />
        </Button>
      </Dropdown>
    </div>
  );
};
