# Repository Structure — INQ Web, INQ Admin, INQ API, INQ Hub

## Your Requirements Summary
- **Apps:** 3 frontend apps + 1 API layer
- **Deployments:** Independent (different cycles)
- **Ownership:** Solo (you, Riza)
- **Architecture:** Separate API layer for scalability and maintainability
- **Database:** 
  - Web + Admin share same DB (content sync)
  - Hub + Admin share same auth
  - API is the single backend for all frontend apps
- **Future:** Page builder feature (likely in Hub/Admin)

---

## Recommendation: Monorepo (Turborepo) + Shared Packages

### Why Monorepo for Your Case?

| Factor | Monorepo Advantage |
|--------|-------------------|
| **Shared DB** | Easier to keep Web + Admin in sync with unified schema management |
| **Shared Auth** | Hub + Admin auth logic centralized, easier to maintain |
| **Page Builder** | Can be shared library used by both Admin (editing) + Hub (rendering) |
| **Solo maintenance** | One git repo, one PR process, consistent dependency versions |
| **Independent deploys** | Each app deploys on its own schedule (Cloudflare Pages for each) |
| **Future scaling** | Easy to add more apps (docs.inquivix.work, etc.) without repo sprawl |

---

## Proposed Monorepo Structure

```
inquivix-monorepo/
├── apps/
│   ├── web/                          # Public website (Next.js SSG)
│   │   ├── src/
│   │   │   ├── app/                  # Next.js App Router
│   │   │   ├── components/
│   │   │   ├── lib/
│   │   │   └── pages/
│   │   ├── package.json
│   │   ├── next.config.ts
│   │   └── tsconfig.json
│   │
│   ├── admin/                        # CMS admin + content management (Next.js + Payload)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── lib/
│   │   │   └── (payload)/            # Payload CMS routes
│   │   ├── payload.config.ts         # Payload CMS configuration
│   │   ├── package.json
│   │   ├── next.config.ts
│   │   └── tsconfig.json
│   │
│   ├── api/                          # REST API Layer (Cloudflare Workers)
│   │   ├── src/
│   │   │   ├── routes/               # API route handlers
│   │   │   │   ├── content.ts        # Content queries
│   │   │   │   ├── leads.ts          # Lead management
│   │   │   │   ├── contact.ts        # Contact form
│   │   │   │   ├── upload.ts         # File uploads to R2
│   │   │   │   ├── analytics.ts      # Analytics endpoints
│   │   │   │   └── chat.ts           # Chatbot endpoints
│   │   │   ├── middleware/           # Auth, CORS, logging
│   │   │   ├── lib/
│   │   │   │   ├── supabase.ts       # Supabase client
│   │   │   │   ├── r2.ts             # Cloudflare R2 client
│   │   │   │   ├── auth.ts           # JWT verification
│   │   │   │   └── (more helpers)
│   │   │   └── index.ts              # Worker entry point
│   │   ├── wrangler.toml             # Cloudflare Workers config
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── hub/                          # Internal operations platform (Next.js)
│       ├── src/
│       │   ├── app/
│       │   ├── components/
│       │   ├── lib/
│       │   └── pages/
│       ├── package.json
│       ├── next.config.ts
│       └── tsconfig.json
│
├── packages/                         # Shared code
│   ├── ui/                           # Shared React components
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   └── (more...)
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── auth/                         # Shared auth logic + hooks (Supabase)
│   │   ├── src/
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useUser.ts
│   │   │   │   └── useSession.ts
│   │   │   ├── lib/
│   │   │   │   ├── supabase.ts       # Supabase client config
│   │   │   │   ├── jwt.ts
│   │   │   │   └── roles.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── db/                           # Shared database schema + types
│   │   ├── src/
│   │   │   ├── schema/
│   │   │   │   ├── users.sql
│   │   │   │   ├── content.sql
│   │   │   │   ├── pages.sql
│   │   │   │   └── (more...)
│   │   │   ├── types/
│   │   │   │   ├── index.ts          # TypeScript types from schema
│   │   │   │   ├── users.ts
│   │   │   │   ├── content.ts
│   │   │   │   └── (more...)
│   │   │   └── migrations/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── types/                        # Shared TypeScript types
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── api.ts
│   │   │   ├── models.ts
│   │   │   └── (more...)
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── api-client/                   # Fetch wrapper for calling api.inquivix.work
│   │   ├── src/
│   │   │   ├── client.ts             # Typed API client
│   │   │   ├── hooks/                # useQuery, useMutation wrappers
│   │   │   │   ├── useContent.ts
│   │   │   │   ├── useLeads.ts
│   │   │   │   └── (more...)
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── page-builder/                 # Page builder library (Phase 2)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Editor.tsx        # For Admin
│   │   │   │   ├── Renderer.tsx      # For Web + Hub
│   │   │   │   └── (blocks, etc)
│   │   │   ├── hooks/
│   │   │   ├── utils/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── utils/                        # Shared utilities (helpers, formatters)
│   │   ├── src/
│   │   │   ├── date.ts
│   │   │   ├── string.ts
│   │   │   ├── api.ts
│   │   │   └── (more...)
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── config/                       # Shared config (colors, constants, env)
│       ├── src/
│       │   ├── colors.ts             # Inquivix brand colors
│       │   ├── fonts.ts              # Typography config
│       │   ├── api-endpoints.ts      # API base URL (api.inquivix.work)
│       │   └── constants.ts
│       ├── package.json
│       └── tsconfig.json
│
├── .github/
│   └── workflows/
│       ├── deploy-web.yml            # Deploy web on push to main
│       ├── deploy-admin.yml          # Deploy admin on push to main
│       ├── deploy-api.yml            # Deploy API on push to main
│       ├── deploy-hub.yml            # Deploy hub on push to main
│       └── test.yml                  # Run tests across monorepo
│
├── turbo.json                        # Turborepo config
├── package.json                      # Root workspace
├── tsconfig.base.json                # Shared TypeScript config
├── pnpm-workspace.yaml               # pnpm workspaces (or yarn workspaces)
├── README.md
└── .gitignore
```

---

## How Each App Uses the Shared Packages

### `apps/web` (Public Website — Next.js SSG)
```
├── imports from:
│   ├── @inquivix/ui (design components)
│   ├── @inquivix/types (TS types)
│   ├── @inquivix/config (brand colors, API endpoints)
│   ├── @inquivix/api-client (useContent, useLeads hooks)
│   └── @inquivix/utils (helpers)
│
├── unique to web:
│   ├── Static pages (/services, /blog, /about, etc)
│   ├── SEO components & metadata
│   ├── Dify chatbot widget (external API)
│   ├── Contact form (calls api.inquivix.work/api/contact)
│   └── Analytics tracking (GTM)
```

### `apps/admin` (CMS Admin — Next.js + Payload)
```
├── imports from:
│   ├── @inquivix/ui (design components)
│   ├── @inquivix/types (TS types)
│   ├── @inquivix/config (brand colors)
│   ├── @inquivix/auth (useAuth, useUser, Supabase)
│   ├── @inquivix/api-client (for admin API calls)
│   ├── @inquivix/db (schema, migrations, types)
│   ├── @inquivix/page-builder (Editor component - Phase 2)
│   └── @inquivix/utils (helpers)
│
├── unique to admin:
│   ├── Payload CMS setup (all content collections)
│   ├── Content management UI
│   ├── User/role management
│   ├── Media library (Cloudflare R2 integration)
│   ├── Analytics dashboard
│   └── Page builder editor (Phase 2)
```

### `apps/api` (REST API Layer — Cloudflare Workers)
```
├── imports from:
│   ├── @inquivix/types (TS types for API responses)
│   ├── @inquivix/auth (JWT verification, roles.ts)
│   ├── @inquivix/config (API constants)
│   └── @inquivix/utils (helpers)
│
├── unique to api:
│   ├── Payload CMS queries (admin-side queries)
│   ├── Supabase client initialization
│   ├── Cloudflare R2 upload handling
│   ├── Contact form processing
│   ├── Lead management (create, read, update)
│   ├── JWT token verification
│   ├── CORS headers & middleware
│   ├── Analytics aggregation endpoints
│   └── Chatbot API proxying
```

### `apps/hub` (Internal Platform — Next.js)
```
├── imports from:
│   ├── @inquivix/ui (design components)
│   ├── @inquivix/types (TS types)
│   ├── @inquivix/config (brand colors, API endpoints)
│   ├── @inquivix/auth (useAuth, useUser, Supabase)
│   ├── @inquivix/api-client (useLeads, other hooks)
│   ├── @inquivix/db (database types - read-only for most)
│   ├── @inquivix/page-builder (Renderer component - Phase 2)
│   └── @inquivix/utils (helpers)
│
├── unique to hub:
│   ├── Internal dashboard
│   ├── Project management
│   ├── File library (Supabase Storage - Phase 2)
│   ├── Workflow management
│   ├── Team collaboration
│   └── Page renderer (Phase 2)
```

---

## Deployment Setup

### Each App Deployed to Cloudflare

**apps/web**
- Domain: `inquivix.com`
- Platform: Cloudflare Pages
- GitHub: Push to `main` → auto-deploy
- Environment: Public website (static/SSG)

**apps/admin**
- Domain: `admin.inquivix.work`
- Platform: Cloudflare Pages
- GitHub: Push to `admin` branch → auto-deploy
- Environment: CMS & admin panel (protected by auth)

**apps/api**
- Domain: `api.inquivix.work`
- Platform: Cloudflare Workers
- GitHub: Push to `api` branch → auto-deploy
- Environment: REST API layer (serves all frontends)

**apps/hub**
- Domain: `hub.inquivix.work`
- Platform: Cloudflare Pages
- GitHub: Push to `hub` branch → auto-deploy
- Environment: Internal operations (auth-required)

### Branch Strategy

```
main              (production web at inquivix.com)
  ↓ (auto-deploy to Cloudflare Pages)

admin             (production admin at admin.inquivix.work)
  ↓ (auto-deploy to Cloudflare Pages)

api               (production API at api.inquivix.work)
  ↓ (auto-deploy to Cloudflare Workers)

hub               (production hub at hub.inquivix.work)
  ↓ (auto-deploy to Cloudflare Pages)

develop           (staging branch for testing)
  ↓ (can deploy to staging domains)
```

---

## Dependency Management

### Root `package.json` (Turborepo workspace)

```json
{
  "name": "inquivix-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check",
    "db:migrate": "node tools/scripts/migrate-db.ts",
    "db:seed": "node tools/scripts/seed-db.ts"
  },
  "devDependencies": {
    "turbo": "^2.x"
  }
}
```

### App-Specific `package.json` Example (`apps/web`)

```json
{
  "name": "@inquivix/web",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "@inquivix/ui": "*",
    "@inquivix/auth": "*",
    "@inquivix/types": "*",
    "@inquivix/config": "*",
    "@inquivix/db": "*",
    "@inquivix/utils": "*",
    "supabase": "^2.x"
  }
}
```

---

## Development Workflow

### Local Development

```bash
# Clone monorepo
git clone https://github.com/INQUIVIX-DEV/inquivix-monorepo.git
cd inquivix-monorepo

# Install all dependencies (pnpm)
pnpm install

# Run all apps in dev mode
pnpm dev

# Run specific app
pnpm --filter @inquivix/web dev

# Run tests across monorepo
pnpm test

# Type check all apps
pnpm type-check
```

### Making Changes

**Scenario 1: Update shared component**
```bash
# Edit: packages/ui/src/components/Button.tsx
# This auto-updates in all 3 apps (web, admin, hub) on next rebuild
# Each app independently deploys when ready
```

**Scenario 2: Update auth logic**
```bash
# Edit: packages/auth/src/hooks/useAuth.ts
# All 3 apps using this hook get the update on next rebuild
```

**Scenario 3: Update database schema**
```bash
# Edit: packages/db/src/schema/pages.sql
# Run migration: pnpm db:migrate
# TypeScript types auto-sync from schema
```

**Scenario 4: Update web features**
```bash
# Edit: apps/web/src/...
# Push to main → auto-deploy to inquivix.com
# No impact on admin or hub
```

---

## Page Builder (Phase 2) Integration

### Structure
```
packages/page-builder/
├── src/
│   ├── components/
│   │   ├── Editor.tsx       # Editing interface (used by Admin)
│   │   ├── Renderer.tsx     # Page rendering (used by Web + Hub)
│   │   ├── blocks/          # Reusable block components
│   │   │   ├── TextBlock.tsx
│   │   │   ├── ImageBlock.tsx
│   │   │   ├── HeroBlock.tsx
│   │   │   └── (more...)
│   │   └── Canvas.tsx
│   ├── hooks/
│   │   ├── usePageBuilder.ts
│   │   ├── useBlocks.ts
│   │   └── useDragDrop.ts
│   ├── utils/
│   │   ├── serialization.ts  # Save/load pages
│   │   └── validation.ts
│   └── index.ts
```

### Usage

**In Admin:**
```typescript
import { Editor } from "@inquivix/page-builder"

export default function PageEditorPage({ pageId }) {
  return <Editor pageId={pageId} />
}
```

**In Web:**
```typescript
import { Renderer } from "@inquivix/page-builder"

export default function Page({ slug }) {
  return <Renderer slug={slug} />
}
```

---

## Git Workflow Example

```bash
# Start new feature (shared UI component)
git checkout -b feature/new-button

# Edit package
nano packages/ui/src/components/Button.tsx

# Test in web app
pnpm --filter @inquivix/web dev
# visit localhost:3000

# Commit and push
git add .
git commit -m "feat(ui): add new button variant"
git push origin feature/new-button

# Create PR
# Merge to main when ready

# Each app independently deploys when it needs to
```

---

## Why This Structure Works for You

| Goal | How Monorepo Helps |
|------|-------------------|
| **Shared auth** | `@inquivix/auth` package used by all 3 apps |
| **Sync Web + Admin DB** | Single `@inquivix/db` schema, both import types |
| **Page builder** | Shared library, Editor in Admin, Renderer in Web/Hub |
| **Independent deploys** | Each app has own branch, deploys independently |
| **Solo management** | One git repo, one linting/testing pipeline |
| **Code reuse** | Shared components, auth, utils — no duplication |
| **Scaling** | Easy to add new apps (docs.inquivix.work, etc) |
| **Type safety** | Shared types, TypeScript auto-sync across apps |

---

## Alternative: Separate Repos (Less Recommended)

If you prefer separate repos instead of monorepo:

```
inquivix-web/
inquivix-admin/
inquivix-hub/
```

**Downsides for your use case:**
- ❌ Web + Admin out of sync on DB schema
- ❌ Auth logic duplicated across repos
- ❌ Page builder code duplicated (editing + rendering)
- ❌ Dependency versions diverge
- ❌ Need separate npm packages for shared code anyway
- ❌ More overhead for solo maintenance

**Upside:**
- ✅ Simpler initial setup (just clone 3 repos)
- ✅ Smaller git history per repo

---

## Recommendation: Start with Monorepo

**Tools:**
- **Monorepo manager:** Turborepo (simplest for your case)
- **Package manager:** pnpm (fastest, best workspaces support)
- **Deployment:** Cloudflare Pages (3 separate branches → 3 deploys)

This gives you:
- ✅ Shared code, no duplication
- ✅ Web + Admin stay in sync
- ✅ Page builder shared between apps
- ✅ Independent deployments
- ✅ Solo maintenance friendly
- ✅ Easy to scale when team grows

**Start with this structure, and you won't regret it.** 👍

