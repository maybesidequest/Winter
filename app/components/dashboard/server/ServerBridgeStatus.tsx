import { ConnectionOperationNotice } from "~/components/dashboard/connection/ConnectionOperationNotice";

interface ServerBridgeStatusProps {
  healthy: boolean;
  connected: boolean;
  statusMessage: string | null;
  latestOperationId: string | null;
}

export function ServerBridgeStatus({
  healthy,
  connected,
  statusMessage,
  latestOperationId,
}: ServerBridgeStatusProps) {
  const needsAttention = connected && !healthy;
  return (
    <>
      {needsAttention && (
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200" role="status">
          Observed health needs attention{statusMessage ? `: ${statusMessage}` : "."}
        </div>
      )}
      {latestOperationId && <ConnectionOperationNotice operationId={latestOperationId} />}
    </>
  );
}
