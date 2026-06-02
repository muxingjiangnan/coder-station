import { Button } from "antd";

export const ChatScrollToBottomButton = ({ visible, onClick }) => {
  if (!visible) {
    return null;
  }

  return (
    <Button className="chat-scroll-button" shape="round" onClick={onClick}>
      回到底部
    </Button>
  );
};
