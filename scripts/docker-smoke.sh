#!/usr/bin/env bash
set -euo pipefail

image="${WINTER_SMOKE_IMAGE:-interchat-winter-phase1-smoke}"
port="${WINTER_SMOKE_PORT:-4010}"
container="winter-smoke-$RANDOM"

docker build --tag "$image" .
docker run --detach --rm --name "$container" --publish "$port:4000" \
  --env SESSION_SECRET=smoke-session-secret \
  --env JWT_SECRET=smoke-jwt-secret \
  --env BEACON_JWT_SECRET=smoke-beacon-jwt-secret \
  --env OAUTH_TOKEN_ENCRYPTION_KEY=smoke-token-secret \
  --env WINTER_DATABASE_URL=postgres://invalid@127.0.0.1:1/winter \
  --env DISCORD_CLIENT_ID=smoke-client \
  --env DISCORD_CLIENT_SECRET=smoke-secret \
  --env DISCORD_CALLBACK_URL=http://localhost/auth/discord/callback \
  "$image" >/dev/null
cleanup() { docker rm --force "$container" >/dev/null 2>&1 || true; }
trap cleanup EXIT

for _ in $(seq 1 30); do
  status="$(curl --silent --output /dev/null --write-out '%{http_code}' "http://127.0.0.1:$port/healthz" || true)"
  [[ "$status" == "200" ]] && break
  sleep 1
done

[[ "$status" == "200" ]] || { echo "Winter /healthz did not become ready (status $status)" >&2; exit 1; }
ready_status="$(curl --silent --output /dev/null --write-out '%{http_code}' "http://127.0.0.1:$port/readyz" || true)"
[[ "$ready_status" =~ ^(200|503)$ ]] || { echo "Winter /readyz did not respond (status $ready_status)" >&2; exit 1; }
echo "Winter image smoke passed: /healthz=$status /readyz=$ready_status"
