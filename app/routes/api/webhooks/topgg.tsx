import { type ActionFunctionArgs } from "react-router";
import { readRequestBody, RequestBodyTooLargeError } from "~/services/requestBody.server";
import { topGGService } from "~/services/topgg.server";

export const TOPGG_MAX_BODY_BYTES = 64 * 1024;

export async function loader() {
  return new Response("Method not allowed", { status: 405 });
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const signature = request.headers.get("x-topgg-signature");
    if (!signature) {
      return Response.json({ error: "Missing signature" }, { status: 401 });
    }

    const rawPayload = await readRequestBody(request, TOPGG_MAX_BODY_BYTES);

    const result = await topGGService.forwardVote({
      rawPayload,
      signature,
    });

    return Response.json(
      {
        success: true,
        userId: result.userId,
        totalVotes: result.totalVotes,
        currentStreak: result.currentStreak,
        isDuplicate: result.isDuplicate,
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof RequestBodyTooLargeError) {
      return Response.json({ error: "Payload too large" }, { status: 413 });
    }
    console.error("Error processing Top.gg webhook via control plane:", error);
    const status = error?.code === 7 || error?.code === 16 ? 401 : (error?.code === 3 ? 400 : 500);
    return Response.json(
      { error: error?.message || "Failed to record vote" },
      { status }
    );
  }
}
