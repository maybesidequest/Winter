# Phase 3 threat model

## Trust boundaries

Browser → Winter session/BFF → Control Plane mTLS → Iris, Discord REST,
Polarizer, PostgreSQL, Redis/EventBus, and outbox consumers.

## Required controls

- OAuth state is single-use and cleared on every callback outcome.
- Sessions rotate after login; cookies are `__Host-`, Secure, HttpOnly,
  SameSite=Lax, and expire after 12 hours.
- Every mutation validates same-origin and a signed-session CSRF token.
- Resource IDs, parent IDs, versions, and confirmation names are reloaded and
  revalidated by Control Plane.
- TLS identities have exact method allowlists; actor fields never grant access.
- Discord URLs, redirects, webhook-like values, and exports are allowlisted,
  bounded, authorized, and audited.
- Audit, logs, traces, browser payloads, fixtures, and errors redact secrets.
- Rate limits fail closed when Redis is unavailable.

## Review record

An independent reviewer must sign the threat model, BOLA/CSRF evidence,
credential inventory, NetworkPolicies, and image/dependency scan before staging.
