import { CheckCircleOutlined, ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import type { ServerResource } from "~/resources/server";

interface ServerOverviewCardProps {
  server: ServerResource;
  botClientId?: string;
}

export function ServerOverviewCard({ server, botClientId = "798748015435055134" }: ServerOverviewCardProps) {
  const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${botClientId}&guild_id=${server.metadata.id}&disable_guild_select=true`;

  return (
    <div className="flex flex-col gap-6 w-full">
      <section className="p-6 rounded-2xl border border-white/[0.08] bg-[#13141f]">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-300 text-2xl">
            {server.status.botInstalled ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white">Bot installation</h2>
            <p className="mt-1 text-sm text-white/65">
              {server.status.botInstalled
                ? "InterChat is installed in this server."
                : "InterChat needs to be installed before this server can use Hub features."}
            </p>
          </div>
          {!server.status.botInstalled && (
            <a
              href={inviteUrl}
              target="_blank"
              rel="noreferrer"
              className="dashboard-btn-primary px-5 py-3 text-sm flex-shrink-0"
            >
              <PlusOutlined />
              <span>Add to Discord</span>
            </a>
          )}
        </div>
      </section>

      <section className="p-6 rounded-2xl border border-white/[0.08] bg-[#13141f]">
        <h2 className="text-base font-bold text-white">Server management</h2>
        <p className="mt-2 text-sm text-white/55">
          Server settings and Hub connections will appear here once their Control Plane workflows are ready.
        </p>
      </section>
    </div>
  );
}
