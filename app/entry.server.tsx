import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import type { EntryContext } from "react-router";
import { ServerRouter } from "react-router";

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext
) {
  // server.ts injects the per-request CSP nonce; React Router must apply it to
  // its inline hydration scripts or the browser blocks them and the page never
  // hydrates.
  const nonce = request.headers.get("x-csp-nonce") ?? undefined;
  const body = await renderToReadableStream(
    <ServerRouter context={routerContext} url={request.url} nonce={nonce} />,
    {
      nonce,
      signal: request.signal,
      onError(error: unknown) {
        console.error(error);
        responseStatusCode = 500;
      },
    }
  );

  if (isbot(request.headers.get("user-agent") || "")) {
    await body.allReady;
  }

  responseHeaders.set("Content-Type", "text/html");

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
