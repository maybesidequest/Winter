import { useQuery } from "@tanstack/react-query";
import { Alert, Card, Col, Empty, List, Row, Select, Skeleton, Statistic, Typography } from "antd";
import { useState } from "react";
import { Navigate, useOutletContext } from "react-router";
import { PageHeader, Section } from "~/components/dashboard/WorkspacePrimitives";
import { orpc } from "~/lib/orpc";

export default function DashboardActivity() {
  const { capabilities = {} } = useOutletContext<{ capabilities?: Record<string, boolean> }>();
  const now = new Date();
  const [year, setYear] = useState(now.getUTCFullYear());
  const [month, setMonth] = useState(now.getUTCMonth() + 1);
  const activity = useQuery({
    ...orpc.user.getActivity.queryOptions({ input: { year, month, limit: 5 } }),
    enabled: capabilities.USER_ACTIVITY || import.meta.env.DEV,
  });
  if (!capabilities.USER_ACTIVITY && !import.meta.env.DEV) return <Navigate to="/dashboard" replace />;

  if (activity.isLoading) {
    return <><PageHeader eyebrow="Activity" title="Your activity" description="A clear view of your InterChat participation." /><Skeleton active /></>;
  }

  if (activity.isError) {
    return <><PageHeader eyebrow="Activity" title="Your activity" description="A clear view of your InterChat participation." /><Alert type="error" showIcon message="Your activity is temporarily unavailable." /></>;
  }

  if (!activity.data) {
    return <><PageHeader eyebrow="Activity" title="Your activity" description="A clear view of your InterChat participation." /><Empty description="No activity is available yet." /></>;
  }

  const value = activity.data;
  return <>
    <PageHeader eyebrow="Activity" title="Your activity" description="A clear view of your InterChat participation." />
    <Section title="At a glance">
      <div className="mb-4 flex items-center gap-2">
        <Typography.Text type="secondary">Period</Typography.Text>
        <Select aria-label="Activity month" value={month} onChange={setMonth} options={Array.from({ length: 12 }, (_, index) => ({ value: index + 1, label: new Date(Date.UTC(2000, index, 1)).toLocaleString(undefined, { month: "long" }) }))} />
        <Select aria-label="Activity year" value={year} onChange={setYear} options={[year - 1, year, year + 1].map((value) => ({ value, label: String(value) }))} />
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}><Card><Statistic title="Messages" value={value.lifetimeMessages} /></Card></Col>
        <Col xs={24} sm={8}><Card><Statistic title="Current streak" value={value.currentStreak} suffix="days" /></Card></Col>
        <Col xs={24} sm={8}><Card><Statistic title="Best streak" value={value.longestStreak} suffix="days" /></Card></Col>
      </Row>
      <Typography.Paragraph type="secondary" style={{ marginTop: 16 }}>
        {value.messageRank > 0 ? `You rank #${value.messageRank} for messages.` : "Your message rank is not available yet."}
      </Typography.Paragraph>
    </Section>
    <Section title="Your top Hubs">
      {value.topHubs.length === 0 ? <Empty description="You have no Hub activity for this period." /> : <List
        dataSource={value.topHubs}
        renderItem={(hub) => <List.Item>
          <List.Item.Meta title={hub.hubName || "Unavailable Hub"} description={`${hub.messageCount} messages · ${hub.sharePercent}% of your Hub activity`} />
        </List.Item>}
      />}
    </Section>
  </>;
}
