import { PlaceholderView } from "~/components/dashboard/PlaceholderView";

export default function BrowseRoute() {
  return (
    <PlaceholderView
      eyebrow="Network Directory"
      title="Explore Hubs"
      description="Browse public InterChat hubs, find matching communities for your server, or request a new cross-server bridge."
      tag="Directory"
      icon="🌐"
      backTo="/dashboard"
      backLabel="Return to Dashboard"
    />
  );
}
