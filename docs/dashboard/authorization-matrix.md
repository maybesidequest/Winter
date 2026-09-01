# Phase 3 authorization matrix

Authorization is enforced by Control Plane at execution time. Winter metadata
controls visibility only and is never an authorization decision.

| Actor | Resource/action | Required policy | Required deny cases | Evidence |
| --- | --- | --- | --- | --- |
| Hub owner | Hub configuration, Team, lifecycle | exact Hub ownership | unrelated Hub, protected role, owner removal | pending |
| Hub staff | configured Hub staff action | exact Hub permission and target rank | equal/higher rank, removed staff, wrong Hub | pending |
| Server manager | Server settings, blocklist, channel connection | exact Server management permission | another Server, wrong channel guild | pending |
| Authenticated user | own profile/preferences/inbox/appeal | actor equals session subject | another user’s ID, private enumeration | pending |
| Service principal | operation progress | method allowlist and operation ownership | browser actor, wrong parent, replay conflict | pending |

Every list query must apply the same parent and privacy policy as its
single-resource endpoint. Companion IDs from the browser are untrusted.
