import { QuestionCircleOutlined } from "@ant-design/icons";
import { Card, Col, Empty, Input, Row, Typography } from "antd";
import { useMemo, useState } from "react";
import { Link, Navigate, useOutletContext } from "react-router";
import { PageHeader, Section } from "~/components/dashboard/WorkspacePrimitives";
import { ADD_INTERCHAT_URL, SUPPORT_SERVER_URL } from "~/components/marketing/constants";

const resources = [
  { title: "Support server", description: "Ask the InterChat team for help or report a dashboard problem.", href: SUPPORT_SERVER_URL, label: "Open support" },
  { title: "Invite InterChat", description: "Add InterChat to another Discord server you manage.", href: ADD_INTERCHAT_URL, label: "Invite the bot" },
  { title: "Vote for InterChat", description: "Support the project and unlock voter perks when your vote is available.", href: "https://top.gg/bot/interchat/vote", label: "Vote on Top.gg" },
  { title: "Read Hub rules", description: "Open the Hub directory, choose a Hub, and read its current rules and status.", href: "/dashboard/browse", label: "Browse Hubs", internal: true },
];

const helpTopics = [
  { title: "Managing a Hub", body: "Open a Hub from your list to update its identity, rules, modules, invites, team, announcements, badges, logging, and audit history when your role allows it." },
  { title: "Connecting a Discord server", body: "Connection setup is available only after the server and channel workflow has been verified for your account. The Discord bot remains available for Calls and in-conversation actions." },
  { title: "Keeping your account private", body: "Profile and preferences are self-scoped. Private Hub details and staff tools are shown only when the Control Plane confirms your access." },
  { title: "Saving changes", body: "Changes use optimistic versions. If someone edits the same resource first, refresh and review the latest value before saving again." },
];

export default function DashboardHelp() {
  const { capabilities = {} } = useOutletContext<{ capabilities?: Record<string, boolean> }>();
  const [search, setSearch] = useState("");
  const filteredTopics = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) return helpTopics;
    return helpTopics.filter((topic) => `${topic.title} ${topic.body}`.toLocaleLowerCase().includes(query));
  }, [search]);
  if (!capabilities.USER_HELP && !import.meta.env.DEV) return <Navigate to="/dashboard" replace />;

  return <>
    <PageHeader eyebrow="Help" title="Help and resources" description="Find answers, invite InterChat, and get support." />
    <Section title="Search help">
      <Input.Search
        aria-label="Search help"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search managing Hubs, saving changes, privacy…"
        allowClear
        size="large"
      />
      <div className="mt-4 flex flex-col gap-3">
        {filteredTopics.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No help topics match that search." /> : filteredTopics.map((topic) => (
          <Card key={topic.title} size="small" title={topic.title}>
            <Typography.Text type="secondary">{topic.body}</Typography.Text>
          </Card>
        ))}
      </div>
    </Section>
    <Section title="Quick links">
      <Row gutter={[16, 16]}>
        {resources.map((resource) => <Col xs={24} md={8} key={resource.title}>
          <Card title={<span><QuestionCircleOutlined /> {resource.title}</span>} actions={[resource.internal ? <Link key="open" to={resource.href}>{resource.label} →</Link> : <a key="open" href={resource.href} target="_blank" rel="noreferrer">{resource.label} ↗</a>]}> 
            <Typography.Text type="secondary">{resource.description}</Typography.Text>
          </Card>
        </Col>)}
      </Row>
    </Section>
    <Section title="Using InterChat">
      <Typography.Paragraph>Use the Discord bot for Calls, message actions, and other in-conversation features. The dashboard is for managing Hubs, Servers, and your account.</Typography.Paragraph>
      <Typography.Paragraph type="secondary">For safety or account requests, contact the support team so we can verify the right context.</Typography.Paragraph>
    </Section>
  </>;
}
