import { CloseOutlined } from "@ant-design/icons";
import { message } from "antd";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { orpc } from "~/lib/orpc";
import { createHubSchema } from "~/schemas/hub";
import { WizardSidebar } from "~/components/CreateHubWizard/WizardSidebar";
import { IdentityStep } from "~/components/CreateHubWizard/IdentityStep";
import { DefaultsStep } from "~/components/CreateHubWizard/DefaultsStep";
import { ReviewStep } from "~/components/CreateHubWizard/ReviewStep";
import { INITIAL_FORM, STEP_ITEMS } from "~/components/CreateHubWizard/types";
import type { HubFormValues } from "~/components/CreateHubWizard/types";

interface CreateHubWizardProps {
  mode: "inline" | "modal";
  open?: boolean;
  onCancel?: () => void;
  isFirstHub: boolean;
  onCreated?: (hubId: string) => void;
}

export function CreateHubWizard({ mode, open = false, onCancel, isFirstHub, onCreated }: CreateHubWizardProps) {
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof HubFormValues, string>>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<HubFormValues>({ ...INITIAL_FORM });
  const handledHubIdRef = useRef<string | null>(null);
  const idempotencyKeyRef = useRef<string>(crypto.randomUUID());

  const createHubMutation = useMutation(
    orpc.hub.createHub.mutationOptions({
      onSuccess: (data) => {
        if (!data.hubId || handledHubIdRef.current === data.hubId) return;
        handledHubIdRef.current = data.hubId;
        message.success(isFirstHub ? "Your first hub is ready." : "Hub created successfully.");
        onCreated?.(data.hubId);
        onCancel?.();
      },
      onError: (error) => message.error(error.message || "Failed to create hub"),
    })
  );

  const isSubmitting = createHubMutation.isPending;
  const isOpen = mode === "inline" || open;
  const canClose = !isSubmitting && !isFirstHub;

  const handleClose = () => {
    if (canClose && onCancel) onCancel();
  };

  useEffect(() => {
    if (!isOpen) return;
    setCurrentStep(0);
    setFormData({ ...INITIAL_FORM });
    setFieldErrors({});
    handledHubIdRef.current = null;
    idempotencyKeyRef.current = crypto.randomUUID();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || mode !== "modal") return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && canClose) handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, canClose, mode]);

  if (!isOpen) return null;

  const updateField = <K extends keyof HubFormValues>(field: K, value: HubFormValues[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextLabel = currentStep === 1 ? "Review Hub" : "Continue";
  const canAdvanceBasics = formData.name.trim().length > 0 && formData.shortDescription.trim().length > 0;

  const handleNext = () => {
    if (currentStep === 0 && !canAdvanceBasics) {
      message.error("Add a hub name and short description before continuing.");
      return;
    }
    setCurrentStep((step) => Math.min(step + 1, STEP_ITEMS.length - 1));
  };

  const handleSubmit = () => {
    const parsed = createHubSchema.safeParse(formData);
    if (!parsed.success) {
      const errors: Partial<Record<keyof HubFormValues, string>> = {};
      for (const err of parsed.error.issues) {
        errors[String(err.path[0]) as keyof HubFormValues] = err.message;
      }
      setFieldErrors(errors);
      if (errors.name || errors.shortDescription || errors.description) {
        setCurrentStep(0);
      } else if (errors.visibility || errors.language || errors.region || errors.welcomeMessage) {
        setCurrentStep(1);
      }
      return;
    }
    setFieldErrors({});
    createHubMutation.mutate({ ...parsed.data, idempotencyKey: idempotencyKeyRef.current });
  };

  const shell = (
    <div
      className="hub-wizard-shell relative w-full max-w-4xl min-h-[580px] max-h-[90vh] rounded-3xl overflow-hidden flex flex-col md:flex-row border select-none animate-fadeIn"
      style={{
        background: "#13141f",
        borderColor: "rgba(255, 255, 255, 0.08)",
        boxShadow: "0 4px 0 0 rgba(10, 8, 23, 0.85), 0 24px 48px rgba(0, 0, 0, 0.6)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {mode === "modal" && canClose && (
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close Create Hub"
        >
          <CloseOutlined className="text-sm" />
        </button>
      )}

      <WizardSidebar isFirstHub={isFirstHub} currentStep={currentStep} />

      <div className="hub-wizard-content flex-1 p-6 md:p-8 flex flex-col justify-between overflow-y-auto dark-scrollbar relative">
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
            <h3 className="text-lg md:text-xl font-bold text-white font-['Sora'] tracking-tight m-0">
              {STEP_ITEMS[currentStep].title}
            </h3>
            <span className="text-xs font-semibold text-white/40 font-['Sora']">
              Step {currentStep + 1} of {STEP_ITEMS.length}
            </span>
          </div>

          <div className="flex-1">
            {currentStep === 0 && (
              <IdentityStep formData={formData} updateField={updateField} fieldErrors={fieldErrors} />
            )}
            {currentStep === 1 && (
              <DefaultsStep formData={formData} updateField={updateField} />
            )}
            {currentStep === 2 && (
              <ReviewStep formData={formData} />
            )}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between gap-3 pt-6 mt-6 border-t border-white/[0.08]">
          {!(isFirstHub && currentStep === 0) ? (
            <button
              type="button"
              onClick={currentStep === 0 ? handleClose : () => setCurrentStep((s) => Math.max(s - 1, 0))}
              disabled={isSubmitting}
              className="dashboard-btn-secondary px-5 py-2 text-xs font-bold"
            >
              {currentStep === 0 ? "Cancel" : "Back"}
            </button>
          ) : <div />}

          <button
            type="button"
            disabled={isSubmitting}
            onClick={currentStep === STEP_ITEMS.length - 1 ? handleSubmit : handleNext}
            className="dashboard-btn-primary px-6 py-2 text-xs font-bold flex items-center gap-2"
          >
            {isSubmitting && currentStep === STEP_ITEMS.length - 1 ? (
              <span>Creating...</span>
            ) : currentStep === STEP_ITEMS.length - 1 ? (
              <span>{isFirstHub ? "Create First Hub" : "Create Hub"}</span>
            ) : (
              <span>{nextLabel}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  if (mode === "modal") {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none animate-fadeIn"
        style={{
          background: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget && canClose) handleClose();
        }}
      >
        {shell}
      </div>
    );
  }

  return shell;
}
