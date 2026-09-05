import { PlusOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { message } from "antd";
import { useEffect, useRef, useState } from "react";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";
import { orpcClient as orpc } from "~/lib/orpc";
import type { ServerBlockResource, ServerResource } from "~/resources/server";
import { ServerBlockModal } from "./ServerBlockModal";
import { ServerBlocklistTable } from "./ServerBlocklistTable";

interface ServerBlocklistCardProps {
  server: ServerResource;
  blocks: ServerBlockResource[];
  onRefresh?: () => void;
}

export function ServerBlocklistCard({ server, blocks: initialBlocks, onRefresh }: ServerBlocklistCardProps) {
  const [blocks, setBlocks] = useState<ServerBlockResource[]>(initialBlocks);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const addIdempotencyKey = useRef(crypto.randomUUID());
  const removeIdempotencyKeys = useRef(new Map<string, string>());
  const isInstalled = server.status.botInstalled;

  useEffect(() => {
    setBlocks(initialBlocks);
  }, [initialBlocks, server.metadata.id]);

  const handleAddBlock = async (values: { targetType: "user" | "server"; targetId: string; reason: string }) => {
    setSubmitting(true);
    try {
      await orpc.server.addBlock({
        serverId: server.metadata.id,
        targetType: values.targetType,
        targetId: values.targetId.trim(),
        reason: values.reason.trim(),
        idempotencyKey: addIdempotencyKey.current,
      });

      message.success(`Blocked ${values.targetType === "user" ? "member" : "Server"} successfully.`);
      setIsAddModalOpen(false);
      addIdempotencyKey.current = crypto.randomUUID();

      // Refresh list
      try {
        const updated = await orpc.server.blocklist({ serverId: server.metadata.id });
        setBlocks(updated);
        onRefresh?.();
      } catch {
        message.warning("Block saved, but the list could not be refreshed. Reload the page to verify it.");
      }
    } catch (err: unknown) {
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
      onRefresh?.();
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
            <p className="text-xs text-white/70">
              Prevent specific Discord users or servers from interacting with {server.metadata.name} in Calls and Hubs.
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={!isInstalled}
          onClick={() => setIsAddModalOpen(true)}
          className="dashboard-btn-danger px-4 py-2.5 min-h-[44px] text-xs font-bold self-start sm:self-auto inline-flex items-center gap-2 cursor-pointer"
        >
          <PlusOutlined />
          <span>Add Block</span>
        </button>
      </div>

      {/* Blocklist Table */}
      <ServerBlocklistTable blocks={blocks} onRemoveBlock={handleRemoveBlock} />

      {/* Add Block Modal */}
      <ServerBlockModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddBlock}
        submitting={submitting}
        serverId={server.metadata.id}
      />
    </div>
  );
}
