# Phase 3 operations pack

## Service objectives

- Control Plane reads: p95 ≤ 500 ms.
- Ordinary mutations: p95 ≤ 1 s for request completion.
- Outbox lag: p95 ≤ 15 s; maximum < 5 minutes.
- Stuck operations: zero older than 5 minutes.
- Winter unexpected error rate: < 1%.
- Auth-denial anomalies: zero.
- Winter-owned storage RPO/RTO: 24 hours / 4 hours.
- Shared management RPO/RTO: 5 minutes / 30 minutes.

## Dashboards and alerts

Track request/error/latency by route and RPC template, authorization denials,
outbox age/retries, operation state/age, dependency failures, reconciliation
drift, OAuth failures, rate limits, and web vitals. Every alert names an owner,
runbook, escalation path, and severity.

### Outbox lag alerts (defined, wired in SigNoz)

Producer metric: `control_plane_outbox_pending_events` (Prometheus text
`control_plane_outbox_pending_events`, exposed by Control Plane; warning log at
`outbox_lag_warning_threshold`, default 100). Consumer signal: structured
`control_outbox_lag` log lines emitted every 30 s by
`ControlOutboxConsumer` with `pending_entries` (warning above 100).

- **Warn** — `max_over_time(control_plane_outbox_pending_events[5m]) > 100`:
  owner on-call, runbook `stuck operation / outbox backlog`, severity P3.
- **Page** — `control_plane_outbox_pending_events > 1000` for 10 m, or a
  `Control outbox consumer lag is high` log pattern for 15 m: severity P2;
  check Control Plane readiness and Redis stream depth before restarting the
  publisher deployment.

## Runbooks

Rollback; certificate expiry; bad migration; provider outage; stuck operation;
failed compensation; audit investigation; backup restore; secret rotation;
elevated authorization denials.

## Game day

Exercise one dependency outage and one application rollback in a
production-like environment. Link traces, alerts, operation records, and
recovery timing in the release evidence index.
