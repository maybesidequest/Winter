import { CrownOutlined, CheckCircleOutlined } from "@ant-design/icons";
import type { UserResource } from "~/resources/user";

interface BillingSectionProps {
  userResource?: UserResource;
  isLoading?: boolean;
}

export function BillingSection({ userResource, isLoading }: BillingSectionProps) {
  const hasCustomer = !!userResource?.status.customerId;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 animate-pulse">
        <div className="h-28 rounded-2xl bg-white/5 border border-white/10" />
      </div>
    );
  }

  return (
    <div className="relative z-10 flex flex-col gap-5">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white font-['Sora'] tracking-tight">
          Subscription & Billing
        </h2>
        <p className="text-xs sm:text-sm text-white/50 mt-0.5">
          Manage your InterChat premium tier and hub booster subscriptions.
        </p>
      </div>

      {/* Plan Card */}
      <div
        className="relative overflow-hidden p-5 rounded-2xl border flex flex-col gap-4"
        style={{
          background: "linear-gradient(135deg, rgba(91, 76, 203, 0.2) 0%, #13141f 100%)",
          borderColor: "rgba(255, 255, 255, 0.08)",
          boxShadow: "0 4px 0 0 rgba(10, 8, 23, 0.75)",
        }}
      >
        <div className="dashboard-card-contours pointer-events-none" aria-hidden="true" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5b4ccb] flex items-center justify-center text-lg text-white font-bold">
              <CrownOutlined />
            </div>
            <div>
              <span className="text-xs text-violet-300 font-bold uppercase tracking-wider">
                Current Plan
              </span>
              <h3 className="text-lg font-bold text-white font-['Sora']">
                {hasCustomer ? "InterChat Plus" : "InterChat Community (Free)"}
              </h3>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#7ed493]/15 text-[#7ed493] border border-[#7ed493]/30">
            Active
          </span>
        </div>

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-white/70">
          <div className="flex items-center gap-2">
            <CheckCircleOutlined className="text-emerald-400" />
            <span>Unlimited Hub Bridges</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircleOutlined className="text-emerald-400" />
            <span>Real-time Safety Filtering</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircleOutlined className="text-emerald-400" />
            <span>Userphone 1:1 Matching</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircleOutlined className="text-emerald-400" />
            <span>Custom Automated Rules</span>
          </div>
        </div>
      </div>
    </div>
  );
}
