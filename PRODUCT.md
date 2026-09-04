# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Both server owners/admins and hub owners/moderators are equally primary.

- **Server owners / admins:** connect a Discord server to hubs, configure calls and userphone, manage server staff and overrides, monitor activity and respond to moderation actions.
- **Hub owners / moderators:** curate a cross-server network, set moderation and routing policies, review linked servers, handle appeals and inbox reports, monitor network health.

Secondary audiences: hub/server staff assisting with moderation, and InterChat staff managing relationships and platform operations via `/staff`.

## Product Purpose

InterChat web dashboard and control plane for hub-based cross-server chat on Discord. It manages cross-server connections, hub moderation settings, live chat analytics, and user access.

Success means healthy connected networks: servers can discover and join curated hubs, cross-server messages flow reliably, moderation keeps networks safe, and owners can audit and resolve issues without leaving the dashboard.

## Positioning

Hub-curated cross-server chat network — not a single global chat relay and not bot-commands-only. Any neighboring Discord bot could copy message relaying, but not this product's combination: independently manageable Hub / Server / Moderation Policy / Routing Policy resources, explicit relationship resources (e.g. hub–server links), computed effective configuration, and auditability built for hundreds of hubs and thousands of servers.

## Operating Context

- **Core workflows:** browse and join hubs; link/unlink servers; configure calls and userphone per server; set bot, hub, and server moderation policies and routing policies; review activity and analytics; triage inbox reports; handle appeals; manage profile and settings.
- **Environments:** Discord (where chat happens) + web dashboard (where configuration happens) + Beacon Elixir SSE server for live message fanout into the UI.
- **Technical context:** React Router v7 + React 19 + oRPC + Drizzle ORM on PostgreSQL + Redis for session/caching. Real-time via Beacon SSE token flow. Auth via Discord OAuth. Top.gg webhook integration.
- **Rituals:** moderation review, appeal adjudication, server onboarding to hubs, activity monitoring.

## Capabilities and Constraints

Confirmed functionality (from current routes and stack):

- Marketing + privacy pages; Discord OAuth login/callback/logout.
- Dashboard: overview, inbox, profile, activity, appeals, help, browse, hubs + hub workspace (`hubId/view`), servers + server workspace (`serverId/view`), settings.
- Staff area: index + relationships management.
- APIs: Beacon SSE token, authenticated SSE stream, versioned REST (`api/v1/*`), Top.gg webhook.
- Resource-oriented architecture: `metadata` / `spec` / `status` separation; effective configuration always computed, never persisted (except dedicated cache); relationships as first-class resources; resource-oriented oRPC procedures; URL state for search/pagination/sorting/tabs/filters.

Durable constraints to preserve:

- Discord OAuth identity and Discord permission model as source of authority; permission evaluation lives in services, never inline in UI.
- Auditability: every configuration mutation must be capable of generating an audit event (e.g. HubCreated, ServerLinked, PolicyAssigned) without refactoring.
- Appeals and moderation workflows must remain explicit and reviewable.
- Validation schemas stay shared across oRPC, forms, and services; analytics/status never stored inside spec.

Explicitly undecided: pricing/packaging, public metrics or SLAs, additional resource types beyond the current Bot/Hub/Server/Policy/Route set.

## Brand Commitments

Name: InterChat. Discord-native control-plane product. No invented voice, testimonials, or identity claims beyond the current implementation. Binding visual constraints, if any, live in DESIGN.md — not here.

## Evidence on Hand

- Repo implementation: `app/routes.ts`, `app/resources/`, `app/services/`, `app/rpc/`, `drizzle/` schemas, `README.md`, `AGENTS.md`.
- No confirmed testimonials, case studies, benchmarks, partner-hub proof, or licensed assets provided. Future work must not fabricate customers, quotes, metrics, or pricing.

## Product Principles

1. **Resources over pages:** every configurable entity is an independently manageable resource with clear ownership.
2. **Desired vs. observed stays separate:** spec is user intent, status is observed reality, effective config is computed.
3. **Dual-audience parity:** server-side and hub-side workspaces are first-class; neither is a second-class settings screen.
4. **Moderation-first trust:** policy, routing, audit, and appeal paths must remain explicit, reviewable, and permission-checked in one place.
5. **Built for scale without redesign:** boundaries chosen today must hold for hundreds of hubs, thousands of servers, and new resource types.
