import { useQueries, useQuery } from "@tanstack/react-query";
import { Alert, Card, Empty, Spin, Typography } from "antd";
import { useMemo, type ComponentProps } from "react";
import { Navigate, useOutletContext } from "react-router";
import CytoscapeComponent from "react-cytoscapejs";
import { orpc } from "~/lib/orpc";

const { Title, Paragraph } = Typography;
type CytoscapeElements = ComponentProps<typeof CytoscapeComponent>["elements"];

const NAME_UNAVAILABLE = "Name unavailable";
const CONNECTIONS_UNAVAILABLE = "Connections unavailable";

interface GraphNode { data: { id: string; label: string }; classes?: string }
interface GraphEdge { data: { source: string; target: string } }

export default function StaffRelationships() {
  const { capabilities = {} } = useOutletContext<{ capabilities?: Record<string, boolean> }>();
  const hubs = useQuery(orpc.hub.getUserHubs.queryOptions());
  const servers = useQuery(orpc.server.list.queryOptions({ input: {} }));
  const hubList = hubs.data ?? [];

  const connectionQueries = useQueries({
    queries: hubList.map((hub) => ({
      ...orpc.hub.getConnections.queryOptions({ input: { hubId: hub.metadata.id } }),
    })),
  });
  const settled = connectionQueries.every((query) => query.isSuccess || query.isError);
  const anyConnectionFailed = connectionQueries.some((query) => query.isError);

  const serverNames = useMemo(() => {
    const names = new Map<string, string>();
    for (const server of servers.data ?? []) {
      if (server.metadata.id) names.set(server.metadata.id, server.metadata.name || NAME_UNAVAILABLE);
    }
    return names;
  }, [servers.data]);

  const elements = useMemo<CytoscapeElements>(() => {
    if (!hubList.length || !settled) return [];
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];
    const serverIds = new Set<string>();

    hubList.forEach((hub, index) => {
      const hubNode: GraphNode = {
        data: { id: `hub:${hub.metadata.id}`, label: hub.metadata.name || NAME_UNAVAILABLE },
        classes: "hub",
      };
      const query = connectionQueries[index];
      if (query?.isError) {
        hubNode.data.label = `${hubNode.data.label} (${CONNECTIONS_UNAVAILABLE})`;
        hubNode.classes = "hub hub-degraded";
      }
      nodes.push(hubNode);

      for (const connection of query?.data ?? []) {
        const serverId = connection.spec.serverId;
        if (!serverId || serverIds.has(serverId)) continue;
        serverIds.add(serverId);
        // Server names are only resolvable for Servers the actor manages;
        // unresolvable names stay explicit instead of fabricating a label.
        nodes.push({ data: { id: `server:${serverId}`, label: serverNames.get(serverId) ?? NAME_UNAVAILABLE } });
        edges.push({ data: { source: `hub:${hub.metadata.id}`, target: `server:${serverId}` } });
      }
    });

    return [...nodes, ...edges];
  }, [hubList, connectionQueries, serverNames, settled]);

  return (
    <div>
      {!capabilities.CONNECTIONS && !import.meta.env.DEV ? <Navigate to="/dashboard" replace /> : null}
      <Title level={2}>Hub-Server Relationships</Title>
      <Paragraph>Visualize how the Servers you manage are connected to your Hubs.</Paragraph>
      {hubs.isLoading || servers.isLoading ? (
        <div className="dashboard-alert dashboard-alert--sage"><Spin /> Loading relationships…</div>
      ) : null}
      {hubs.isError ? (
        <Alert type="warning" showIcon message="Hub data is temporarily unavailable. Try again shortly." />
      ) : null}
      {servers.isError ? (
        <Alert type="warning" showIcon message="Server names are temporarily unavailable; connections will show without names." />
      ) : null}
      {anyConnectionFailed ? (
        <Alert type="warning" showIcon message="Connection data is unavailable for some Hubs; those Hubs are marked in the graph." />
      ) : null}
      <Card bodyStyle={{ padding: 0, height: 500 }}>
        {hubList.length === 0 && !hubs.isLoading && !hubs.isError ? (
          <Empty description="You are not a member of any Hub yet." style={{ paddingTop: 200 }} />
        ) : elements.length > 0 ? (
          <CytoscapeComponent
            elements={elements}
            style={{ width: "100%", height: "100%" }}
            layout={{ name: "cose" }}
            stylesheet={[
              {
                selector: "node",
                style: {
                  "background-color": "#1677ff",
                  label: "data(label)",
                  color: "#fff",
                  "text-outline-color": "#1677ff",
                  "text-outline-width": 2,
                },
              },
              {
                selector: "node.hub",
                style: {
                  "background-color": "#722ed1",
                  "text-outline-color": "#722ed1",
                  shape: "hexagon",
                  width: 50,
                  height: 50,
                },
              },
              {
                selector: "node.hub-degraded",
                style: {
                  "background-color": "#faad14",
                  "text-outline-color": "#faad14",
                },
              },
              {
                selector: "edge",
                style: {
                  width: 3,
                  "line-color": "#303030",
                  "target-arrow-color": "#303030",
                  "target-arrow-shape": "triangle",
                  "curve-style": "bezier",
                },
              },
            ]}
          />
        ) : null}
      </Card>
    </div>
  );
}
