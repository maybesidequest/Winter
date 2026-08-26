import { useRef, useState } from "react";
import { Modal, Form, Input, Radio, message, Popconfirm } from "antd";
import {
  SafetyCertificateOutlined,
  PlusOutlined,
  DeleteOutlined,
  UserOutlined,
  CloudServerOutlined,
} from "@ant-design/icons";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";
import type { ServerBlockResource, ServerResource } from "~/resources/server";
import { orpcClient as orpc } from "~/lib/orpc";

interface ServerBlocklistCardProps {
  server: ServerResource;
  blocks: ServerBlockResource[];
  onRefresh?: () => void;
}

export function ServerBlocklistCard({ server, blocks: initialBlocks }: ServerBlocklistCardProps) {
  const [blocks, setBlocks] = useState<ServerBlockResource[]>(initialBlocks);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const addIdempotencyKey = useRef(crypto.randomUUID());
  const removeIdempotencyKeys = useRef(new Map<string, string>());
  const isInstalled = server.status.botInstalled;

  const handleAddBlock = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      await orpc.server.addBlock({
        serverId: server.metadata.id,
        targetType: values.targetType,
        targetId: values.targetId.trim(),
        reason: values.reason?.trim() || undefined,
        idempotencyKey: addIdempotencyKey.current,
      });

      message.success(`Blocked ${values.targetType} ${values.targetId} successfully.`);
      setIsAddModalOpen(false);
      form.resetFields();
      addIdempotencyKey.current = crypto.randomUUID();

      // Refresh list locally
      const updated = await orpc.server.blocklist({ serverId: server.metadata.id });
      setBlocks(updated);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "errorFields" in err) return;
      message.error(err instanceof Error ? err.message : "Failed to add block.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveBlock = async (blockId: string) => {
    try {
      const idempotencyKey = removeIdempotencyKeys.current.get(blockId) || crypto.randomUUID();
      removeIdempotencyKeys.current.set(blockId, idempotencyKey);
      await orpc.server.removeBlock({
        serverId: server.metadata.id,
        blockId,
        idempotencyKey,
      });
      message.success("Entity unblocked successfully.");
      setBlocks((prev) => prev.filter((b) => b.id !== blockId));
      removeIdempotencyKeys.current.delete(blockId);
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : "Failed to remove block.");
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header Card */}
      <div
        className="p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={dashboardGlassCardStyle}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 text-lg">
            <SafetyCertificateOutlined />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-['Sora']">
              Server Blocklist
            </h2>
            <p className="text-xs text-white/60">
              Prevent specific Discord users or servers from interacting with {server.metadata.name} in Calls and Hubs.
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={!isInstalled}
          onClick={() => setIsAddModalOpen(true)}
          className="dashboard-btn-danger px-4 py-2 text-xs self-start sm:self-auto"
        >
          <PlusOutlined />
          <span>Add Block</span>
        </button>
      </div>

      {/* Blocklist Table / List */}
      {blocks.length === 0 ? (
        <div
          className="p-8 md:p-12 rounded-2xl border flex flex-col items-center justify-center text-center gap-3"
          style={dashboardGlassCardStyle}
        >
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 text-2xl">
            <SafetyCertificateOutlined />
          </div>
          <div className="flex flex-col gap-1 max-w-sm">
            <h3 className="text-base font-bold text-white font-['Sora']">
              No Blocked Entities
            </h3>
            <p className="text-xs text-white/60">
              Your server blocklist is clean. Blocked users or servers will not be matched in Calls or bridge messages to this server.
            </p>
          </div>
        </div>
      ) : (
        <div
          className="p-4 rounded-2xl border overflow-hidden"
          style={dashboardGlassCardStyle}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-white/50 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Target ID</th>
                  <th className="py-3 px-4">Date Added</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {blocks.map((block) => (
                  <tr key={block.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-semibold border ${
                          block.targetType === "user"
                            ? "bg-violet-500/10 text-violet-300 border-violet-500/20"
                            : "bg-sky-500/10 text-sky-300 border-sky-500/20"
                        }`}
                      >
                        {block.targetType === "user" ? <UserOutlined /> : <CloudServerOutlined />}
                        <span>{block.targetType.toUpperCase()}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <code className="text-white font-mono text-xs">{block.targetId}</code>
                    </td>
                    <td className="py-3.5 px-4 text-white/60">
                      {new Date(block.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Popconfirm
                        title="Unblock entity"
                        description="Are you sure you want to remove this block?"
                        okText="Yes, Unblock"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                        onConfirm={() => handleRemoveBlock(block.id)}
                      >
                        <button
                          type="button"
                          className="dashboard-btn-danger-subtle px-2.5 py-1 text-xs"
                        >
                          <DeleteOutlined />
                          <span>Unblock</span>
                        </button>
                      </Popconfirm>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Block Modal */}
      <Modal
        title="Block User or Server"
        open={isAddModalOpen}
        onOk={handleAddBlock}
        confirmLoading={submitting}
        onCancel={() => setIsAddModalOpen(false)}
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

          <Form.Item
            name="targetId"
            label="Discord Snowflake ID"
            rules={[
              { required: true, message: "Please input the target ID" },
              { pattern: /^\d{17,21}$/, message: "Must be a valid 17-21 digit snowflake ID" },
            ]}
          >
            <Input placeholder="e.g. 123456789012345678" />
          </Form.Item>

          <Form.Item name="reason" label="Reason (Optional)">
            <Input.TextArea placeholder="Internal note for staff" rows={3} maxLength={500} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
