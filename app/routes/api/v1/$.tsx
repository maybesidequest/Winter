import { RPCHandler } from "@orpc/server/fetch";
import { appRouter } from "../../../rpc/router";
import { enforceRpcRequestSecurity } from "../../../rpc/requestSecurity";
import type { Route } from "./+types/$";

const handler = new RPCHandler(appRouter, { strictGetMethodPluginEnabled: false });

export async function handleRequest(request: Request) {
  const rejected = enforceRpcRequestSecurity(request);
  if (rejected) return rejected;

  const result = await handler.handle(request, {
    prefix: "/api/v1",
    context: { request },
  });

  if (result.matched) {
    return result.response;
  }

  return new Response("Not found", { status: 404 });
}

export async function loader({ request }: Route.LoaderArgs) {
  return handleRequest(request);
}

export async function action({ request }: Route.ActionArgs) {
  return handleRequest(request);
}
