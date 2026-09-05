import { Form, Input, Modal, Radio } from "antd";
import { useEffect } from "react";
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

  useEffect(() => {
    if (!open) {
      form.resetFields();
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
      title="Block User or Server"
      open={open}
      onOk={handleOk}
      confirmLoading={submitting}
      onCancel={onClose}
      okText="Block Entity"
      okButtonProps={{ danger: true }}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" initialValues={{ targetType: "user" }} className="mt-4">
        <Form.Item
          name="targetType"
          label="Target Type"
          rules={[{ required: true }]}
        >
          <Radio.Group buttonStyle="solid">
            <Radio.Button value="user">User</Radio.Button>
            <Radio.Button value="server">Server</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item noStyle shouldUpdate={(previous, current) => previous.targetType !== current.targetType}>
          {({ getFieldValue }) => {
            const targetType = getFieldValue("targetType");
            return (
              <Form.Item
                name="targetId"
                label="Target"
                rules={[{ required: true, message: "Choose a named user or Server" }]}
              >
                <HubSubjectSelector
                  hubId={serverId}
                  selectorType={targetType === "server" ? "SELECTOR_TYPE_SERVER" : "SELECTOR_TYPE_USER"}
                  placeholder={targetType === "server" ? "Search manageable Servers" : "Search Server members"}
                />
              </Form.Item>
            );
          }}
        </Form.Item>

        <Form.Item name="reason" label="Reason" rules={[{ required: true, message: "Please provide a reason" }]}>
          <Input.TextArea placeholder="Internal note for staff" rows={3} maxLength={500} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
