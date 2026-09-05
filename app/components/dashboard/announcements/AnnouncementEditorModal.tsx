import { Modal } from "antd";
import { DashboardSelect } from "~/components/dashboard/shared";

interface AnnouncementEditorModalProps {
  open: boolean;
  isEditing: boolean;
  isPending: boolean;
  title: string;
  content: string;
  scheduledFor: string;
  repeatIntervalMinutes: number;
  desiredState: "DRAFT" | "SCHEDULED" | "PAUSED";
  onTitleChange: (val: string) => void;
  onContentChange: (val: string) => void;
  onScheduledForChange: (val: string) => void;
  onRepeatIntervalMinutesChange: (val: number) => void;
  onDesiredStateChange: (val: "DRAFT" | "SCHEDULED" | "PAUSED") => void;
  onClose: () => void;
  onSubmit: () => void;
}

export function AnnouncementEditorModal({
  open,
  isEditing,
  isPending,
  title,
  content,
  scheduledFor,
  repeatIntervalMinutes,
  desiredState,
  onTitleChange,
  onContentChange,
  onScheduledForChange,
  onRepeatIntervalMinutesChange,
  onDesiredStateChange,
  onClose,
  onSubmit,
}: AnnouncementEditorModalProps) {
  return (
    <Modal
      title={isEditing ? "Edit Announcement" : "Create Announcement"}
      open={open}
      onOk={onSubmit}
      onCancel={onClose}
      confirmLoading={isPending}
      okText={isEditing ? "Update" : "Broadcast"}
    >
      <div className="mt-4 flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="announcement-title" className="text-xs font-bold text-white/90">
            Title
          </label>
          <input
            id="announcement-title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            maxLength={200}
            className="dashboard-input text-sm min-h-[42px]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="announcement-content" className="text-xs font-bold text-white/90">
            Announcement Content
          </label>
          <textarea
            id="announcement-content"
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="Write your announcement to all connected servers..."
            rows={5}
            maxLength={2000}
            className="dashboard-textarea text-sm min-h-[96px]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="announcement-scheduled-for" className="text-xs font-bold text-white/90">
            First delivery (optional)
          </label>
          <input
            id="announcement-scheduled-for"
            type="datetime-local"
            value={scheduledFor}
            onChange={(e) => onScheduledForChange(e.target.value)}
            className="dashboard-input text-sm min-h-[42px]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="announcement-repeat-interval" className="text-xs font-bold text-white/90">
            Repeat interval (minutes, 0 = one-time)
          </label>
          <input
            id="announcement-repeat-interval"
            type="number"
            min={0}
            max={525600}
            value={repeatIntervalMinutes}
            onChange={(e) => onRepeatIntervalMinutesChange(Number(e.target.value))}
            className="dashboard-input text-sm min-h-[42px]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="announcement-desired-state" className="text-xs font-bold text-white/90">
            Desired state
          </label>
          <DashboardSelect<typeof desiredState>
            id="announcement-desired-state"
            className="w-full"
            value={desiredState}
            onChange={(val) => onDesiredStateChange(val)}
            options={[
              { value: "DRAFT", label: "Draft" },
              { value: "SCHEDULED", label: "Scheduled" },
              { value: "PAUSED", label: "Paused" },
            ]}
          />
        </div>
      </div>
    </Modal>
  );
}

