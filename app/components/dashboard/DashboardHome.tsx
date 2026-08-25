import { ArrowRightOutlined, CloudServerOutlined, ClusterOutlined } from "@ant-design/icons";
import { Link, useOutletContext } from "react-router";
import { PageHeader } from "./PageHeader";
import type { ServerResource } from "~/resources/server";
import type { HubResource } from "~/resources/hub";

type DashboardContext = {
  servers?: ServerResource[];
  hubs?: HubResource[];
};

export function DashboardHome() {
  const context = useOutletContext<DashboardContext>();
  const servers = context?.servers ?? [];
  const hubs = context?.hubs ?? [];

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Overview"
        title="Your InterChat workspace"
        description="Manage the Hubs and Discord servers you have access to."
        actions={import.meta.env.DEV ? (
          <Link
            to="/dashboard/browse"
            className="dashboard-btn-secondary !min-h-[34px] !px-3.5 !py-1.5 !text-xs !font-bold"
          >
            <span>Explore Hubs</span>
            <ArrowRightOutlined className="text-[10px]" />
          </Link>
        ) : undefined}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/dashboard/hubs"
          className="dashboard-card p-5 rounded-2xl border border-white/[0.08] hover:border-violet-400/40 transition-colors"
        >
          <ClusterOutlined className="text-xl text-violet-400" />
          <p className="mt-4 text-xs uppercase tracking-wider text-white/45">Hubs you manage</p>
          <p className="mt-1 text-3xl font-bold text-white">{hubs.length}</p>
        </Link>
        <Link
          to="/dashboard/servers"
          className="dashboard-card p-5 rounded-2xl border border-white/[0.08] hover:border-sky-400/40 transition-colors"
        >
          <CloudServerOutlined className="text-xl text-sky-400" />
          <p className="mt-4 text-xs uppercase tracking-wider text-white/45">Servers you manage</p>
          <p className="mt-1 text-3xl font-bold text-white">{servers.length}</p>
        </Link>
      </div>

      <section className="dashboard-card p-6 rounded-2xl border border-white/[0.08]">
        <h2 className="text-base font-bold text-white">Activity</h2>
        <p className="mt-2 text-sm text-white/55">
          Activity history is not available yet. Your Hub and Server changes will still be saved and audited.
        </p>
      </section>
    </div>
  );
}
