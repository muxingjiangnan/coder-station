import { Button } from "antd";

export const NewSessionButton = ({ onClick }) => {
  return (
    <Button className="chat-sidebar__new-session" type="primary" size="large" block onClick={onClick}>
      新建会话
    </Button>
  );
};
