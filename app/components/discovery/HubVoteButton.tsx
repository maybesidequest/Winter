import { useState } from "react";
import { LikeOutlined, LikeFilled } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "~/lib/orpc";

interface HubVoteButtonProps {
  hubId: string;
  initialVoteCount: number;
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
  const queryClient = useQueryClient();

  const upvoteMutation = useMutation(
    orpc.hubDiscovery.upvote.mutationOptions({
      onMutate: () => {
        setVoteCount((prev) => prev + 1);
        setVoted(true);
        setErrorMsg(null);
      },
      onError: (error: any) => {
        // Rollback on error
        setVoteCount((prev) => Math.max(0, prev - 1));
        setVoted(hasVoted);
        setErrorMsg(error.message || "Failed to vote");
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
    upvoteMutation.mutate({ hubId });
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
            ? "bg-violet-500/20 border border-violet-400/40 text-violet-200 cursor-default shadow-[0_0_12px_rgba(139,92,246,0.2)]"
            : "bg-white/[0.05] hover:bg-violet-500/15 border border-white/10 hover:border-violet-500/30 text-white/80 hover:text-white cursor-pointer active:scale-95"
        }`}
      >
        {voted ? (
          <LikeFilled className="text-violet-400 text-xs" />
        ) : (
          <LikeOutlined className="text-xs" />
        )}
        <span className="font-['Sora'] font-semibold">{voteCount}</span>
      </button>

      {errorMsg && (
        <div className="absolute -top-7 left-0 whitespace-nowrap bg-red-950/90 border border-red-500/40 text-red-300 text-[10px] px-2 py-0.5 rounded-md shadow-md">
          {errorMsg}
        </div>
      )}
    </div>
  );
}
