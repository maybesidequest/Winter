import { useRef, useState } from "react";
import { LikeOutlined, LikeFilled } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "~/lib/orpc";

interface HubVoteButtonProps {
  hubId: string;
  initialVoteCount?: number;
  hasVoted?: boolean;
}

export function HubVoteButton({
  hubId,
  initialVoteCount,
  hasVoted = false,
}: HubVoteButtonProps) {
  const [voteCount, setVoteCount] = useState(initialVoteCount);
  const [voted, setVoted] = useState(hasVoted);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const idempotencyKeyRef = useRef(crypto.randomUUID());
  const queryClient = useQueryClient();

  const upvoteMutation = useMutation(
    orpc.hubDiscovery.upvote.mutationOptions({
      onMutate: () => {
        setVoteCount((prev) => (prev ?? 0) + 1);
        setVoted(true);
        setErrorMsg(null);
      },
      onError: (error: unknown) => {
        // Rollback on error
        setVoteCount((prev) => (prev === undefined ? undefined : Math.max(0, prev - 1)));
        setVoted(hasVoted);
        setErrorMsg(error instanceof Error ? error.message : "Failed to vote");
      },
      onSuccess: (data) => {
        if (data.upvoteCount !== undefined) {
          setVoteCount(data.upvoteCount);
        }
        queryClient.invalidateQueries({
          queryKey: orpc.hubDiscovery.key(),
        });
      },
    })
  );

  const handleVote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (voted || upvoteMutation.isPending) return;
    upvoteMutation.mutate({ hubId, idempotencyKey: idempotencyKeyRef.current });
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleVote}
        disabled={voted || upvoteMutation.isPending}
        title={voted ? "You upvoted this hub (12h cooldown)" : "Upvote this hub"}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
          voted
            ? "bg-violet-500/20 border border-violet-400/50 text-violet-200 cursor-default shadow-[0_1.5px_0_0_rgba(129,117,238,0.4),0_0_12px_rgba(139,92,246,0.2)]"
            : "bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] hover:border-violet-400/40 text-white/80 hover:text-white cursor-pointer shadow-[0_1.5px_0_0_rgba(255,255,255,0.12)] hover:shadow-[0_2.5px_0_0_rgba(129,117,238,0.4)] active:shadow-[0_0.5px_0_0_rgba(255,255,255,0.12)] hover:-translate-y-[1px] active:translate-y-[1px]"
        }`}
      >
        {voted ? (
          <LikeFilled className="text-violet-400 text-xs" />
        ) : (
          <LikeOutlined className="text-xs" />
        )}
        <span className="font-['Sora'] font-semibold">{voteCount ?? "—"}</span>
      </button>

      {errorMsg && (
        <div className="absolute -top-7 left-0 whitespace-nowrap bg-red-950/90 border border-red-500/40 text-red-300 text-[10px] px-2 py-0.5 rounded-md shadow-md">
          {errorMsg}
        </div>
      )}
    </div>
  );
}
