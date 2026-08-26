import { useQuery } from "@tanstack/react-query";
import { Alert, Card, Col, Empty, Row, Skeleton, Statistic, Typography } from "antd";
import { Navigate, useOutletContext } from "react-router";
import { PageHeader, Section } from "~/components/dashboard/WorkspacePrimitives";
import { orpc } from "~/lib/orpc";

export default function DashboardProfile() {
  const { capabilities = {} } = useOutletContext<{ capabilities?: Record<string, boolean> }>();
  const profile = useQuery({
    ...orpc.user.getProfile.queryOptions(),
    enabled: capabilities.USER_PROFILE || import.meta.env.DEV,
  });
  if (!capabilities.USER_PROFILE && !import.meta.env.DEV) return <Navigate to="/dashboard" replace />;

  if (profile.isLoading) {
    return <><PageHeader eyebrow="Profile" title="Your profile" description="Your InterChat identity and public activity." /><Skeleton active /></>;
  }

  if (profile.isError) {
    return <><PageHeader eyebrow="Profile" title="Your profile" description="Your InterChat identity and public activity." /><Alert type="error" showIcon message="Your profile is temporarily unavailable." /></>;
  }

  if (!profile.data) {
    return <><PageHeader eyebrow="Profile" title="Your profile" description="Your InterChat identity and public activity." /><Empty description="No profile is available yet." /></>;
  }

  const value = profile.data;
  return <>
    <PageHeader eyebrow="Profile" title={value.displayName || value.username || "Your profile"} description="Your InterChat identity and public activity." />
    <Section title="Activity">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}><Card><Statistic title="Relayed messages" value={value.totalRelayedMessages} /></Card></Col>
        <Col xs={24} sm={8}><Card><Statistic title="Current streak" value={value.streakDays} suffix="days" /></Card></Col>
        <Col xs={24} sm={8}><Card><Statistic title="Member since" value={value.createdAt ? new Date(value.createdAt).toLocaleDateString() : "Unknown"} /></Card></Col>
      </Row>
      <Typography.Paragraph type="secondary" style={{ marginTop: 16 }}>
        Your profile uses the latest Control Plane data. Private badge settings are respected for other viewers.
      </Typography.Paragraph>
    </Section>
  </>;
}
