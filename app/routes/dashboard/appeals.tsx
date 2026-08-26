import { SafetyCertificateOutlined, SendOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Empty, Form, Input, List, Modal, Spin, Tag, Typography, message } from "antd";
import { useRef, useState } from "react";
import { Navigate, useOutletContext } from "react-router";
import { PageHeader, Section } from "~/components/dashboard/WorkspacePrimitives";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";
import { orpc } from "~/lib/orpc";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function AppealsPage() {
  const { capabilities = {} } = useOutletContext<{ capabilities?: Record<string, boolean> }>();
  const queryClient = useQueryClient();
  const appealKeys = useRef<Record<string, string>>({});
  const [selectedInfraction, setSelectedInfraction] = useState<{
    id: string;
    hubId: string;
    hubName?: string;
    type: string;
    reason: string;
  } | null>(null);
  const [appealReason, setAppealReason] = useState("");

  const infractionsQuery = useQuery({
    ...orpc.moderation.listMyAppealableInfractions.queryOptions(),
    enabled: capabilities.MODERATION || import.meta.env.DEV,
  });

  const submitAppeal = useMutation(
    orpc.moderation.submitAppeal.mutationOptions({
      onSuccess: async () => {
        message.success("Appeal submitted successfully. Hub staff will review it.");
        setSelectedInfraction(null);
        setAppealReason("");
        await queryClient.invalidateQueries({
          queryKey: orpc.moderation.listMyAppealableInfractions.queryOptions().queryKey,
        });
      },
      onError: (err: any) => {
        message.error(err?.message || "Failed to submit appeal. Please try again.");
      },
    })
  );

  if (!capabilities.MODERATION && !import.meta.env.DEV) {
    return <Navigate to="/dashboard" replace />;
  }

  const infractions = infractionsQuery.data || [];

  return (
    <>
      <PageHeader
        eyebrow="Safety"
        title="Moderation Appeals"
        description="Review sanctions on your account and submit an appeal for eligible Hub infractions."
      />

      <Section title="Appealable Infractions">
        {infractionsQuery.isLoading && (
          <div className="dashboard-alert dashboard-alert--sage">
            <Spin /> Loading infractions…
          </div>
        )}

        {infractionsQuery.isError && (
          <div className="dashboard-alert">
            Unable to load infractions at this time. Please try again later.
          </div>
        )}

        {!infractionsQuery.isLoading && !infractionsQuery.isError && (
          <div style={dashboardGlassCardStyle}>
            <List
              dataSource={infractions}
              locale={{
                emptyText: (
                  <Empty
                    image={<SafetyCertificateOutlined style={{ fontSize: 48, color: "#8175ee" }} />}
                    description="You have no active sanctions or appealable infractions."
                  />
                ),
              }}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button
                      key="appeal"
                      type="primary"
                      className="dashboard-btn-primary"
                      onClick={() => {
                        setSelectedInfraction(item);
                        setAppealReason("");
                        appealKeys.current[item.id] ??= crypto.randomUUID();
                      }}
                    >
                      Appeal sanction
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <div className="flex items-center gap-2">
                        <Tag color={item.type === "SANCTION_TYPE_BAN" ? "red" : item.type === "SANCTION_TYPE_MUTE" ? "orange" : "blue"}>
                          {item.type.replace("SANCTION_TYPE_", "")}
                        </Tag>
                        <Text strong>{item.hubName || "Hub Sanction"}</Text>
                      </div>
                    }
                    description={
                      <div className="flex flex-col gap-1 mt-1">
                        <Paragraph style={{ margin: 0 }}>
                          <Text type="secondary">Reason: </Text>
                          {item.reason}
                        </Paragraph>
                        {item.createdAt && (
                          <Text type="secondary" style={{ fontSize: "0.8rem" }}>
                            Issued: {new Date(item.createdAt).toLocaleString()}
                          </Text>
                        )}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        )}
      </Section>

      <Modal
        title={
          <div className="flex items-center gap-2">
            <SafetyCertificateOutlined style={{ color: "#8175ee" }} />
            <span>Submit Appeal</span>
          </div>
        }
        open={Boolean(selectedInfraction)}
        onCancel={() => setSelectedInfraction(null)}
        footer={null}
        destroyOnClose
      >
        {selectedInfraction && (
          <Form
            layout="vertical"
            onFinish={() => {
              if (appealReason.trim().length < 10) {
                message.warning("Please provide a detailed explanation of at least 10 characters.");
                return;
              }
              submitAppeal.mutate({
                hubId: selectedInfraction.hubId,
                infractionId: selectedInfraction.id,
                reason: appealReason.trim(),
                idempotencyKey: appealKeys.current[selectedInfraction.id] ??= crypto.randomUUID(),
              });
            }}
          >
            <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/10">
              <Text type="secondary" className="text-xs uppercase font-semibold">
                Sanction Details
              </Text>
              <div className="mt-1 flex items-center gap-2">
                <Tag color="red">{selectedInfraction.type}</Tag>
                <Text strong>{selectedInfraction.hubName || "Hub sanction"}</Text>
              </div>
              <Paragraph className="mt-2 text-sm" style={{ margin: 0 }}>
                <Text type="secondary">Original reason: </Text>
                {selectedInfraction.reason}
              </Paragraph>
            </div>

            <Form.Item
              label="Why should this sanction be reviewed or revoked?"
              required
              extra="Be respectful and provide any context or clarification for the Hub moderators."
            >
              <TextArea
                rows={4}
                maxLength={2000}
                showCount
                value={appealReason}
                onChange={(e) => setAppealReason(e.target.value)}
                placeholder="Explain what happened and why you are appealing…"
              />
            </Form.Item>

            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={() => setSelectedInfraction(null)}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitAppeal.isPending}
                icon={<SendOutlined />}
                className="dashboard-btn-primary"
              >
                Submit appeal
              </Button>
            </div>
          </Form>
        )}
      </Modal>
    </>
  );
}
