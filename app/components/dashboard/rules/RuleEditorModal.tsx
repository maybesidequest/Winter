import { Modal } from "antd";

interface RuleEditorModalProps {
  open: boolean;
  isEditing: boolean;
  isPending: boolean;
  title: string;
  description: string;
  onTitleChange: (val: string) => void;
  onDescriptionChange: (val: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export function RuleEditorModal({
  open,
  isEditing,
  isPending,
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onClose,
  onSubmit,
}: RuleEditorModalProps) {
  return (
    <Modal
      title={<span className="text-white font-['Sora'] text-base font-bold">{isEditing ? "Edit Rule" : "Add Hub Rule"}</span>}
      open={open}
      onOk={onSubmit}
      onCancel={onClose}
      confirmLoading={isPending}
      okText={isEditing ? "Save Changes" : "Create Rule"}
      cancelButtonProps={{ className: "dashboard-btn-secondary" }}
      okButtonProps={{ className: "dashboard-btn-primary" }}
      styles={{
        root: { background: "#13141f", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16 },
        header: { background: "transparent", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 12, marginBottom: 0 },
        body: { paddingTop: 20 },
      }}
    >
      <div className="flex flex-col gap-3.5 mt-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-white/90">Rule Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="e.g. Be respectful and avoid toxic behavior"
            maxLength={100}
            className="dashboard-input text-xs"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-white/90">Description & Guidelines</label>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Explain expected behavior, prohibited content, or disciplinary actions..."
            rows={4}
            maxLength={1000}
            className="dashboard-textarea text-xs"
          />
        </div>
      </div>
    </Modal>
  );
}

