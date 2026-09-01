# Phase 3 test matrix

| Layer | Required coverage | Command/fixture | Owner | Status |
| --- | --- | --- | --- | --- |
| Protobuf | lint, breaking, generation, drift, N-1 | pinned Buf | protobuf | pending |
| Control Plane | unit, auth/BOLA, concurrency, idempotency, rollback | `uv run ic test` scopes | InterChat | pending |
| Database | Atlas lint/hash/forward/restore tests | disposable PostgreSQL | InterChat | pending |
| Bot | parity, typed errors, canonical deletion | Bot test scope | InterChat | pending |
| Winter | unit/component/typecheck/build | Bun scripts | Winter | pending |
| Browser | six journeys through real CP | Playwright | Winter | pending |
| Accessibility | axe, keyboard, zoom, mobile, screen reader | Playwright/manual record | Winter | pending |
| Load | ORPC and gRPC p95 budgets | pinned k6/async gRPC | release | pending |
| Outage | Iris, Discord, Polarizer, Redis, EventBus, outbox restart | injected adapters/staging | release | pending |
| Rollback | flag and image rollback with additive schema | production-like rehearsal | ops | pending |
