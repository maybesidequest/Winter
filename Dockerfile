# syntax=docker/dockerfile:1.7

FROM oven/bun:1-slim AS development-dependencies
WORKDIR /app
COPY package.json bun.lock ./
RUN --mount=type=cache,target=/root/.bun/install/cache,sharing=locked \
    bun install --frozen-lockfile

FROM oven/bun:1-slim AS production-dependencies
WORKDIR /app
COPY package.json bun.lock ./
RUN --mount=type=cache,target=/root/.bun/install/cache,sharing=locked \
    bun install --frozen-lockfile --production

FROM development-dependencies AS build
COPY . .
RUN bun run build

FROM oven/bun:1-slim AS runtime

WORKDIR /app
ENV NODE_ENV=production

COPY --from=production-dependencies --chown=bun:bun /app/node_modules ./node_modules
COPY --from=build --chown=bun:bun /app/build ./build
COPY --from=build --chown=bun:bun /app/app/services/control ./app/services/control
COPY --from=build --chown=bun:bun /app/app/services/winterStorage.server.ts ./app/services/winterStorage.server.ts
COPY --from=build --chown=bun:bun /app/app/generated/control/v1 ./app/generated/control/v1
COPY --from=build --chown=bun:bun /app/tsconfig.json ./tsconfig.json
COPY --chown=bun:bun package.json bun.lock server.ts ./

USER bun

EXPOSE 4000
STOPSIGNAL SIGTERM

CMD ["bun", "run", "start"]
