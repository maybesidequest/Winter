import type { ReactNode } from "react";
import { Link } from "react-router";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { PageHeader } from "./PageHeader";

interface PlaceholderViewProps {
  eyebrow?: string;
  title: string;
  description: string;
  tag?: string;
  iconNode?: ReactNode;
  backTo?: string;
  backLabel?: string;
}

export function PlaceholderView({
  eyebrow = "Workspace",
  title,
  description,
  tag,
  iconNode,
  backTo = "/dashboard",
  backLabel = "Back to Dashboard",
}: PlaceholderViewProps) {
  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={
          <Link
            to={backTo}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2"
          >
            <ArrowLeftOutlined className="text-[10px]" />
            <span>{backLabel}</span>
          </Link>
        }
      />

      <div
        className="relative overflow-hidden p-8 md:p-12 rounded-3xl border flex flex-col items-center justify-center text-center gap-4"
        style={{
          background: "rgba(21, 20, 36, 0.85)",
          borderColor: "rgba(255, 255, 255, 0.09)",
        }}
      >
        <div className="dashboard-card-contours pointer-events-none" aria-hidden="true" />

        <div className="relative z-10 flex flex-col items-center gap-4">
          {iconNode && (
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl mb-1 text-violet-400">
              {iconNode}
            </div>
          )}

          {tag && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#5b4ccb]/20 text-violet-300 border border-[#5b4ccb]/40">
              {tag}
            </span>
          )}

          <h3 className="text-xl font-bold text-white font-['Sora']">{title}</h3>
          <p className="text-sm text-white/60 max-w-md leading-relaxed">{description}</p>

          <div className="mt-4 pt-4 border-t border-white/10 text-xs text-white/40">
            InterChat Control Plane · Configured via Discord & Web Dashboard
          </div>
        </div>
      </div>
    </div>
  );
}
