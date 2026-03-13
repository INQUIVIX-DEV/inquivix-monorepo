# Inquivix Monorepo

**Fast-track website migration:** WordPress → Next.js + Payload CMS + Cloudflare Workers API

## Overview

This monorepo contains 4 independent apps (frontend + API layer) + 8 shared packages, all deployed separately to Cloudflare.

| App | Domain | Stack | Purpose |
|-----|--------|-------|---------|
| **web** | inquivix.com | Next.js (SSG) | Public website |
| **admin** | admin.inquivix.work | Next.js + Payload CMS | Content management |
| **api** | api.inquivix.work | Cloudflare Workers + Hono | REST API layer |
| **hub** | hub.inquivix.work | Next.js | Internal operations (Phase 2+) |

## Architecture

**Three-tier separation:** Frontend apps call shared API layer, which talks to database/storage.

```
Web/Admin/Hub (Cloudflare Pages) → api.inquivix.work (Workers) → Supabase + R2
```

Key benefits:
- Frontends are **pure frontend** — no API routes
- API scales independently
- Shared code via `@inquivix/api-client` package
- ~$0/month on Cloudflare Workers (free tier)

See `API-ARCHITECTURE.md` for full API endpoint specifications.

## Quick Start

```bash
# Install dependencies
pnpm install

# Run all apps locally (web:3000, admin:3001, api:8787, hub:3002)
pnpm dev

# Build all
pnpm build

# Test
pnpm test
```

## Packages

Shared libraries (used by frontends):
- **ui** — React components
- **types** — TypeScript interfaces
- **config** — Brand colors, fonts, constants
- **utils** — Helpers
- **auth** — Supabase auth logic
- **db** — Database schemas & types
- **api-client** — Typed fetch wrapper for calling `api.inquivix.work`
- **page-builder** — Page editor (Phase 2)

## Documentation

- **`PROJECT-BRIEF.md`** — Full project vision, timeline, features
- **`API-ARCHITECTURE.md`** — API endpoints, authentication, deployment
- **`REPO-STRUCTURE.md`** — Detailed monorepo structure
- **`MONOREPO-SETUP-CHECKLIST.md`** — Setup tasks and progress

## Key Tech

| Layer | Stack |
|-------|-------|
| Frontend | Next.js 15, Tailwind, next-intl (i18n) |
| CMS | Payload CMS (embedded in admin app) |
| API | Cloudflare Workers + Hono |
| Database | Supabase PostgreSQL |
| Storage | Cloudflare R2 (public), Supabase Storage (private, Phase 2+) |
| Deployment | Cloudflare Pages (frontend) + Workers (API) |
| Email | Resend |

## Next Steps

1. Read `PROJECT-BRIEF.md` for timeline and scope
2. Check `API-ARCHITECTURE.md` for API implementation details
3. See individual `apps/*/README.md` for app-specific setup
4. Run `pnpm dev` to start all apps locally

## Questions?

See documentation files or check individual app READMEs.
