import { CheckOutlined, InboxOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Empty, List, Spin, Typography, message } from "antd";
import { Navigate, useOutletContext } from "react-router";
import { orpc } from "~/lib/orpc";
import { PageHeader } from "~/components/dashboard/WorkspacePrimitives";

const { Text } = Typography;

export default function InboxPage() {
  const { capabilities = {} } = useOutletContext<{ capabilities?: Record<string, boolean> }>();
  const queryClient = useQueryClient();
  const inbox = useQuery({
    ...orpc.user.getInbox.queryOptions(),
    enabled: capabilities.USER_INBOX || import.meta.env.DEV,
  });
  const acknowledge = useMutation(orpc.user.acknowledgeInbox.mutationOptions({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: orpc.user.getInbox.queryOptions().queryKey });
      message.success("Notification marked as read.");
    },
    onError: () => message.error("The notification could not be updated. Try again.")
  }));
  if (!capabilities.USER_INBOX && !import.meta.env.DEV) return <Navigate to="/dashboard" replace />;

  return <>
    <PageHeader eyebrow="Inbox" title="Your InterChat notifications" description="Official updates and system notifications from InterChat." />
    {inbox.isLoading && <div className="dashboard-alert dashboard-alert--sage"><Spin /> Loading notifications…</div>}
    {inbox.isError && <div className="dashboard-alert">Notifications are temporarily unavailable. Try again shortly.</div>}
    {inbox.data && <section className="dashboard-section"><div className="dashboard-panel dashboard-panel--wide">
      <List
        dataSource={inbox.data}
        locale={{ emptyText: <Empty image={<InboxOutlined />} description="You have no notifications." /> }}
        renderItem={(item) => <List.Item actions={!item.read ? [<Button key="ack" size="small" icon={<CheckOutlined />} loading={acknowledge.isPending} onClick={() => acknowledge.mutate({ itemId: item.id, idempotencyKey: crypto.randomUUID() })}>Mark read</Button>] : []}>
          <List.Item.Meta title={<Text strong>{item.title}</Text>} description={<><div>{item.body}</div><Text type="secondary">{item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}</Text></>} />
        </List.Item>}
      />
    </div></section>}
  </>;
}
