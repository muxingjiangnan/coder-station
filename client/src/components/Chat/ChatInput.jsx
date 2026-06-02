import { Button, Input } from "antd";
import { useMemo, useState } from "react";

export const ChatInput = ({
  value,
  placeholder = "有问题，尽管问",
  disabled = false,
  loading = false,
  autoFocus = false,
  onChange,
  onSubmit,
}) => {
  const [isComposing, setIsComposing] = useState(false);

  const canSubmit = useMemo(() => value.trim().length > 0 && !disabled && !loading, [disabled, loading, value]);

  const submit = () => {
    if (!canSubmit) {
      return;
    }

    onSubmit(value);
  };

  return (
    <div className="chat-input">
      <Input.TextArea
        value={value}
        autoFocus={autoFocus}
        autoSize={{ minRows: 2, maxRows: 6 }}
        placeholder={placeholder}
        disabled={disabled || loading}
        onChange={(event) => onChange(event.target.value)}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey && !isComposing) {
            event.preventDefault();
            submit();
          }
        }}
      />

      <Button type="primary" size="large" disabled={!canSubmit} loading={loading} onClick={submit}>
        发送
      </Button>
    </div>
  );
};
