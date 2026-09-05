import { Form, Input, Modal, Radio } from "antd";
import { useEffect, useState } from "react";
import { HubSubjectSelector } from "../HubSubjectSelector";

export interface ServerBlockModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: { targetType: "user" | "server"; targetId: string; reason: string }) => Promise<void>;
  submitting: boolean;
  serverId: string;
}

export function ServerBlockModal({
  open,
  onClose,
  onSubmit,
  submitting,
  serverId,
}: ServerBlockModalProps) {
  const [form] = Form.useForm();
  const [targetType, setTargetType] = useState<"user" | "server">("user");

  useEffect(() => {
    if (!open) {
      form.resetFields();
      setTargetType("user");
    }
  }, [open, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
    } catch {
      // Validation error displayed directly in form
    }
  };

  return (
    <Modal
      title={targetType === "server" ? "Block Discord Server" : "Block Discord Member"}
      open={open}
      onOk={handleOk}
      confirmLoading={submitting}
      onCancel={onClose}
      okText={targetType === "server" ? "Block Server" : "Block Member"}
      okButtonProps={{ danger: true }}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ targetType: "user" }}
        className="mt-4"
        onValuesChange={(changed) => {
          if (changed.targetType) {
            setTargetType(changed.targetType);
            form.setFieldValue("targetId", undefined);
          }
        }}
      >
        <Form.Item
          name="targetType"
          label="Who do you want to block?"
          rules={[{ required: true }]}
        >
          <Radio.Group buttonStyle="solid">
            <Radio.Button value="user">Discord Member</Radio.Button>
            <Radio.Button value="server">Discord Server</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="targetId"
          label={targetType === "server" ? "Select Discord Server" : "Select Discord Member"}
          rules={[{ required: true, message: targetType === "server" ? "Please select a server to block" : "Please select a member to block" }]}
        >
          <HubSubjectSelector
            hubId={serverId}
            selectorType={targetType === "server" ? "SELECTOR_TYPE_SERVER" : "SELECTOR_TYPE_USER"}
            placeholder={targetType === "server" ? "Search connected servers…" : "Search server members…"}
          />
        </Form.Item>

        <Form.Item
          name="reason"
          label="Reason for Block"
          rules={[{ required: true, message: "Please provide a reason" }]}
        >
          <Input.TextArea
            placeholder="e.g., Repeated spam or harassment across bridges"
            rows={3}
            maxLength={500}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
