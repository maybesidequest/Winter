import { useParams } from "react-router";
import { PlaceholderView } from "~/components/dashboard/PlaceholderView";

export default function CallsRoute() {
  const params = useParams();
  const tab = params.tab || "lobbies";

  const isHistory = tab === "history";

  return (
    <PlaceholderView
      eyebrow="Realtime Matchmaking"
      title={isHistory ? "Call History" : "Active Lobbies"}
      description={
        isHistory
          ? "Inspect completed cross-server text calls, message analytics, and user reports."
          : "Spontaneous 1:1 cross-server text connections currently active across the InterChat network."
      }
      tag={isHistory ? "Archive" : "Realtime Matchmaking"}
      icon="⚡"
      backTo="/dashboard"
      backLabel="Return to Dashboard"
    />
  );
}
