import { useQuery } from "@tanstack/react-query";
import { orpc } from "~/lib/orpc";
import { presentConnectionOperation } from "./operationPresentation";

const TONE_CLASSES = {
  info: "border-sky-400/30 bg-sky-400/10 text-sky-50",
  success: "border-emerald-400/30 bg-emerald-400/10 text-emerald-50",
  warning: "border-amber-400/30 bg-amber-400/10 text-amber-50",
  danger: "border-red-400/30 bg-red-400/10 text-red-50",
} as const;

export function ConnectionOperationNotice({ operationId }: { operationId: string }) {
  const operationQuery = useQuery({
    ...orpc.operations.get.queryOptions({ input: { operationId } }),
    refetchInterval: (query) => {
      const operation = query.state.data;
      if (!operation) return 2_000;
      return presentConnectionOperation(operation).live ? 2_000 : false;
    },
  });

  if (operationQuery.isLoading) {
    return <p role="status" className="mt-1 text-xs text-sky-200/80">Checking bridge operation status…</p>;
  }

  if (operationQuery.isError) {
    return <p role="alert" className="mt-1 text-xs text-amber-200">Bridge operation status is temporarily unavailable. No state has been assumed.</p>;
  }

  if (!operationQuery.data) return null;
  const presentation = presentConnectionOperation(operationQuery.data);
  return (
    <div role={presentation.live ? "status" : "alert"} className={`mt-2 rounded-lg border px-3 py-2 text-xs ${TONE_CLASSES[presentation.tone]}`}>
      <strong className="block text-sm">{presentation.title}</strong>
      <span className="mt-0.5 block text-white/75">{presentation.detail}</span>
    </div>
  );
}
