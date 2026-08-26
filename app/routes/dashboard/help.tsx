import { QuestionCircleOutlined } from "@ant-design/icons";
import { Card, Col, Row, Typography } from "antd";
import { PageHeader, Section } from "~/components/dashboard/WorkspacePrimitives";
import { SUPPORT_SERVER_URL } from "~/components/marketing/constants";

const resources = [
  { title: "Support server", description: "Ask the InterChat team for help or report a dashboard problem.", href: SUPPORT_SERVER_URL, label: "Open support" },
  { title: "Invite InterChat", description: "Add InterChat to another Discord server you manage.", href: "https://discord.com/oauth2/authorize?client_id=1087963156082468894&scope=bot%20applications.commands&permissions=536870912", label: "Invite the bot" },
  { title: "Vote for InterChat", description: "Support the project and unlock voter perks when your vote is available.", href: "https://top.gg/bot/interchat/vote", label: "Vote on Top.gg" },
];

export default function DashboardHelp() {
  return <>
    <PageHeader eyebrow="Help" title="Help & resources" description="Find answers, invite InterChat, and get support." />
    <Section title="Quick links">
      <Row gutter={[16, 16]}>
        {resources.map((resource) => <Col xs={24} md={8} key={resource.title}>
          <Card title={<span><QuestionCircleOutlined /> {resource.title}</span>} actions={[<a key="open" href={resource.href} target="_blank" rel="noreferrer">{resource.label} ↗</a>]}>
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
