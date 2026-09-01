# Phase 3 release journeys

Each journey must record prerequisites, happy path, empty state, denied state,
validation, stale conflict, dependency outage, partial/pending effect,
recovery action, audit result, and next step.

| Journey | Entry point | Canonical operation | Browser evidence | Status |
| --- | --- | --- | --- | --- |
| Connect channel to public Hub | Server → Hubs | Connection create/operation | pending | pending |
| Rule CRUD/reorder/remove | Hub → Modules | versioned rule mutation | pending | pending |
| Calls configuration | Server → Calls | canonical Server config | pending | pending |
| Block/unblock target | Server → Blocklist | scoped target mutation | pending | pending |
| Team invite/restrict/remove | Hub → Team | previewed access mutation | pending | pending |
| Audit diff/restore | Hub → Audit | safe restore mutation | pending | pending |

Five existing nontechnical users must attempt all six journeys without
developer coaching. Record build SHA, environment, timing, assistance,
wrong turns, serious errors, and retest results.
