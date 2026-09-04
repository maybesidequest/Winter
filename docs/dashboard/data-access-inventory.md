# Winter data-access inventory

Update this table whenever a credential, datastore, migration, or external
dependency changes. The inventory must describe the deployed permission, not
only the application code.

| Credential/datastore | Owner | Purpose | Allowed data | Forbidden data | Rotation/expiry | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| `WINTER_DATABASE_URL` | Winter | OAuth tokens, favorites, saved views | Winter-owned schema only | InterChat Hub/Server/control tables | key rotation runbook | pending |
| `WINTER_REDIS_URI` | Winter | rate limits and short-lived UI state | Winter keyspace only | Control Plane canonical resources | key rotation runbook | pending |
| Control Plane mTLS identity | Control Plane | typed management RPCs | authorized resource responses | direct Iris/Polarizer/SQL access | certificate expiry runbook | pending |
| Discord OAuth credential | Winter | signed-in user OAuth experience | user-authorized OAuth scope | bot token and management writes | refresh/revocation tests | pending |

Winter must not receive `DATABASE_URL`, `DISCORD_TOKEN`, Iris credentials,
Polarizer credentials, or a Drizzle mapping for Atlas-owned management tables.

## Bot-owned telemetry tables (outside the management boundary)

The bot writes engagement telemetry directly: `HubActivityMetrics`,
`HubUserStats`, streak/message/call counters, and `ServerData` name/icon
inventory + call counters. These are Discord-event-derived observability
projections, not InterChat management resources: no Winter route reads them,
no management decision is authorized from them, and the canonical Hub/Server
configuration remains Control Plane-owned. Reads of management resources
(Hub, Connection, rules) use the outbox-fed local projection only
(`shared/tasks/control_outbox_consumer.py`); every management mutation goes
through `shared/control_client.py`.

