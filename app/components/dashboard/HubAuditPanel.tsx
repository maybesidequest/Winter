import { useQuery } from "@tanstack/react-query";
import { Alert, Empty, List, Spin, Tag, Typography } from "antd";
import { orpc } from "~/lib/orpc";
import { DashboardSectionCard, DashboardSectionTitle } from "./shared";
import type { HubResource } from "~/resources/hub";

const { Text } = Typography;

export function HubAuditPanel({ hub }: { hub: HubResource }) {
  const query = useQuery(orpc.hub.listAudit.queryOptions({ input: { hubId: hub.metadata.id, limit: 50, offset: 0 } }));
  return (
    <DashboardSectionCard title={<DashboardSectionTitle>Audit history</DashboardSectionTitle>}>
      {query.isLoading ? <Spin /> : query.isError ? <Alert type="error" message="Audit history is temporarily unavailable." /> : (
        <List
          dataSource={query.data?.entries || []}
          locale={{ emptyText: <Empty description="No changes have been recorded yet." /> }}
          renderItem={(entry) => (
            <List.Item>
              <List.Item.Meta
                title={<Text>{entry.summary}</Text>}
                description={<span><Tag>{entry.eventType}</Tag> {entry.source || "Control Plane"} · {entry.createdAt ? new Date(entry.createdAt).toLocaleString() : "Unknown time"}</span>}
              />
            </List.Item>
          )}
        />
      )}
    </DashboardSectionCard>
  );
}
