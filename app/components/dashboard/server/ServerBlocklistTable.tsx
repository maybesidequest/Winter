import {
  CloudServerOutlined,
  DeleteOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Popconfirm } from "antd";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";
import type { ServerBlockResource } from "~/resources/server";

export interface ServerBlocklistTableProps {
  blocks: ServerBlockResource[];
  isLoading?: boolean;
  onRemoveBlock: (blockId: string) => Promise<void>;
}

export function ServerBlocklistTable({ blocks, isLoading = false, onRemoveBlock }: ServerBlocklistTableProps) {
  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl border flex flex-col gap-3 animate-pulse" style={dashboardGlassCardStyle}>
        <div className="h-6 w-36 bg-white/[0.08] rounded-md" />
        <div className="h-12 w-full bg-white/[0.04] rounded-xl" />
        <div className="h-12 w-full bg-white/[0.04] rounded-xl" />
      </div>
    );
  }

  if (blocks.length === 0) {
    return (
      <div
        className="p-8 md:p-12 rounded-2xl border flex flex-col items-center justify-center text-center gap-3"
        style={dashboardGlassCardStyle}
      >
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 text-2xl">
          <SafetyCertificateOutlined />
        </div>
        <div className="flex flex-col gap-1 max-w-sm">
          <h3 className="text-base font-bold text-white font-['Sora']">
            Your Blocklist is Clean
          </h3>
          <p className="text-xs text-white/70">
            No members or servers are blocked. Everyone can chat across bridges and connect in calls.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-4 rounded-2xl border overflow-hidden"
      style={dashboardGlassCardStyle}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-white/[0.08] text-white/70 uppercase tracking-wider font-semibold">
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Member or Server</th>
              <th className="py-3 px-4">Reason</th>
              <th className="py-3 px-4">Added by</th>
              <th className="py-3 px-4">Date Added</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {blocks.map((block) => (
              <tr key={block.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-semibold border ${block.targetType === "user"
                      ? "bg-violet-500/10 text-violet-300 border-violet-500/20"
                      : "bg-sky-500/10 text-sky-300 border-sky-500/20"
                      }`}
                  >
                    {block.targetType === "user" ? <UserOutlined /> : <CloudServerOutlined />}
                    <span>{block.targetType === "user" ? "MEMBER" : "SERVER"}</span>
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-white font-medium">
                    {block.targetName || (block.targetType === "user" ? "Discord member" : "Discord Server")}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-white/70">{block.reason || "—"}</td>
                <td className="py-3.5 px-4 text-white/70">Staff member</td>
                <td className="py-3.5 px-4 text-white/70">
                  {block.createdAt ? new Date(block.createdAt).toLocaleDateString() : "Unknown"}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <Popconfirm
                    title="Remove this block?"
                    description="This member or server will be able to join calls and bridge messages again."
                    okText="Unblock"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                    onConfirm={() => onRemoveBlock(block.id)}
                  >
                    <button
                      type="button"
                      className="dashboard-btn-danger-subtle px-3 py-1.5 text-xs min-h-[36px] inline-flex items-center gap-1.5 cursor-pointer"
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
  );
}
