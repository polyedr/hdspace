# Core API contract (upgrade baseline)

Base URL: `{host}/api/v1` (local: `http://localhost:18000/api/v1`)

## In scope for cutover

| Area | Method | Path | Notes |
|------|--------|------|-------|
| Health | GET | `/health/` | outside `/api/v1` |
| Health detailed | GET | `/health/detailed/` | DB + Redis |
| JWT create | POST | `/djauth/jwt/create/` | username + password → access, refresh |
| JWT refresh | POST | `/djauth/jwt/refresh/` | refresh → access |
| Register | POST | `/djauth/users/` | username, email, password, re_password |
| Projects list/create | GET/POST | `/projects/projects/` | |
| Project detail | GET/PATCH/DELETE | `/projects/projects/{id}/` | |
| Project + screens | GET | `/projects/screens-for-project/{id}/` | editor bootstrap |
| Screens | GET/POST | `/projects/project-screens/` | |
| Screen detail | GET/PATCH/DELETE | `/projects/project-screens/{pk}/` | |
| Scenarios | CRUD | `/projects/` scenario ViewSets | via `api/scenario.ts` |
| Elements | CRUD / bulk | `/projects/` element ViewSets | tree via parent FK |
| Import/export | GET/POST | project/screen import-export endpoints | |

## Temporarily out of scope (disabled in upgrade)

- Stripe / subscriptions (`/subscriptions/`, `/stripe/`)
- Stream Chat (`/schat/`, `streamchat` claim optional)
- Social auth (`/djauth/` social)
- Mask R-CNN (`/virtualize_simple/maskrcnn/`)
- Invite/billing side paths not used by editor core

## Frontend clients (source of truth)

- [frontend/src/api/user.ts](../frontend/src/api/user.ts)
- [frontend/src/api/project.ts](../frontend/src/api/project.ts)
- [frontend/src/api/screen.ts](../frontend/src/api/screen.ts)
- [frontend/src/api/scenario.ts](../frontend/src/api/scenario.ts)
- [frontend/src/api/element.ts](../frontend/src/api/element.ts)
- [frontend/src/api/import.ts](../frontend/src/api/import.ts)
- [frontend/src/config/settings.ts](../frontend/src/config/settings.ts)

## Smoke expectations

1. Health returns `{"status":"ok"}`.
2. JWT create returns non-empty `access` and `refresh`.
3. Authenticated `GET /projects/projects/` returns 200.
4. Create project → open with screens → mutate element/screen without 5xx.
