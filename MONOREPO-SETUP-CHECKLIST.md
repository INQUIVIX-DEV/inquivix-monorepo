# Monorepo Setup Checklist ✅

## ✅ Completed

### Repository Created
- [x] GitHub repo created: `INQUIVIX-DEV/inquivix-monorepo`
- [x] Initial commit pushed with full structure
- [x] Four deployment branches created:
  - [x] `main` (web deployments)
  - [x] `admin` (admin deployments)
  - [x] `api` (API deployments)
  - [x] `hub` (hub deployments)

### Folder Structure
- [x] `apps/web/` - Next.js app skeleton (public website)
- [x] `apps/admin/` - Next.js app skeleton (CMS admin)
- [x] `apps/api/` - Cloudflare Workers skeleton (REST API)
- [x] `apps/hub/` - Next.js app skeleton (internal platform)
- [x] `packages/ui/` - Shared components package
- [x] `packages/auth/` - Shared auth package
- [x] `packages/db/` - Shared database package
- [x] `packages/types/` - Shared types package
- [x] `packages/api-client/` - Shared API client package
- [x] `packages/utils/` - Shared utilities package
- [x] `packages/config/` - Shared config package
- [x] `packages/page-builder/` - Page builder package (Phase 2)

### Configuration Files
- [x] `turbo.json` - Turborepo configuration
- [x] `tsconfig.base.json` - Base TypeScript config
- [x] `package.json` (root) - Workspace definition
- [x] `.gitignore` - Git ignore rules
- [x] `README.md` - Project documentation

### CI/CD & Deployment
- [x] `.github/workflows/deploy-web.yml` - Web deployment workflow (Cloudflare Pages)
- [x] `.github/workflows/deploy-admin.yml` - Admin deployment workflow (Cloudflare Pages)
- [x] `.github/workflows/deploy-api.yml` - API deployment workflow (Cloudflare Workers)
- [x] `.github/workflows/deploy-hub.yml` - Hub deployment workflow (Cloudflare Pages)

### Documentation
- [x] Updated `project-brief-fasttrack.md` with separate API architecture
- [x] Updated `REPO-STRUCTURE.md` with 4-app layout (web, admin, api, hub)
- [x] Created `API-ARCHITECTURE.md` (complete API documentation)
- [x] Created `REPO-CREATED.md` (setup summary)

---

## 📋 To Do Before Development

### Local Setup (Developer)
- [ ] Clone: `git clone https://github.com/INQUIVIX-DEV/inquivix-monorepo.git`
- [ ] Install pnpm: `npm install -g pnpm`
- [ ] Run: `pnpm install`
- [ ] Create `.env.local` files in each app
- [ ] Install Wrangler for Workers development: `npm install -g wrangler`

### Cloudflare Configuration
- [ ] **Cloudflare Pages:** Connect branches to domains
  - [ ] Connect `main` branch to Cloudflare Pages (inquivix.com)
  - [ ] Connect `admin` branch to Cloudflare Pages (admin.inquivix.work)
  - [ ] Connect `hub` branch to Cloudflare Pages (hub.inquivix.work)
- [ ] **Cloudflare Workers:** Connect API branch
  - [ ] Connect `api` branch to Cloudflare Workers (api.inquivix.work)
  - [ ] Set up environment variables in Wrangler config
  - [ ] Configure domain routing for `api.inquivix.work/*`

### Supabase Setup
- [ ] Create project environment variables
- [ ] Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` to `.env.local` in web/admin/hub
- [ ] Add `SUPABASE_SERVICE_KEY` to API app secrets (wrangler)
- [ ] Set up JWT token verification keys in API

### Cloudflare R2 Setup
- [ ] Create R2 bucket for media storage (`inquivix-media`)
- [ ] Generate API tokens (Access Key ID + Secret)
- [ ] Add credentials to API app secrets (wrangler)
- [ ] Configure CORS on R2 bucket for inquivix.com origin

### API Setup (apps/api)
- [ ] Initialize Hono framework skeleton
- [ ] Create route handlers:
  - [ ] `GET /api/content/:slug` (content queries)
  - [ ] `POST /api/leads` (lead creation)
  - [ ] `GET /api/leads` (list leads, admin only)
  - [ ] `POST /api/contact` (contact form)
  - [ ] `POST /api/upload` (file to R2)
  - [ ] `GET /api/analytics` (analytics data, admin only)
  - [ ] `POST /api/chat` (chatbot proxy)
- [ ] Create middleware:
  - [ ] CORS headers
  - [ ] JWT verification
  - [ ] Error handling
  - [ ] Request logging
- [ ] Set up environment secrets in Cloudflare
- [ ] Test locally with `wrangler dev`

### Apps Development
- [ ] **apps/web** (Public Website)
  - [ ] Set up Next.js 15 with App Router
  - [ ] Create public site routes (/services, /blog, /about, /contact)
  - [ ] Import `@inquivix/ui` components
  - [ ] Set up `@inquivix/api-client` for calling API endpoints
  - [ ] Implement contact form (calls `POST /api/contact`)
  - [ ] Add GTM analytics tracking
  - [ ] Implement Dify chatbot widget

- [ ] **apps/admin** (CMS Admin)
  - [ ] Set up Next.js 15
  - [ ] Initialize Payload CMS
  - [ ] Create content collections (pages, posts, case studies, etc.)
  - [ ] Set up EN/KO localization
  - [ ] Configure media library (R2 storage)
  - [ ] Set up user management & RBAC
  - [ ] Create admin-only routes

- [ ] **apps/hub** (Internal Platform - Phase 2+)
  - [ ] Set up Next.js 15
  - [ ] Create internal dashboard
  - [ ] Set up auth-protected routes
  - [ ] Import auth from `@inquivix/auth`

### Shared Packages Development
- [ ] Populate `packages/ui` with shared components (Button, Card, Modal, etc.)
- [ ] Populate `packages/auth` with Supabase auth hooks and utilities
- [ ] Populate `packages/db` with database schema and types
- [ ] Create `packages/api-client` with typed fetch wrapper and hooks
- [ ] Populate `packages/config` with Inquivix brand colors, fonts, API endpoints
- [ ] Populate `packages/utils` with helper functions

---

## 🚀 Development Workflow

Once setup is complete:

1. **Run all apps locally:** `pnpm dev`
   - Opens dev servers:
     - Web: `http://localhost:3000`
     - Admin: `http://localhost:3001`
     - API: `http://localhost:8787` (Wrangler)
     - Hub: `http://localhost:3002`

2. **Work on features:** Edit files in `apps/*`, `packages/*`

3. **Test locally:** Changes hot-reload in dev mode

4. **Commit & push:** 
   - For web changes: `git add . && git commit && git push origin main`
   - For admin changes: `git push origin admin`
   - For API changes: `git push origin api`
   - For hub changes: `git push origin hub`

5. **Auto-deploy:** GitHub Actions automatically deploys to Cloudflare:
   - Push to `main` → auto-deploy to inquivix.com
   - Push to `admin` → auto-deploy to admin.inquivix.work
   - Push to `api` → auto-deploy to api.inquivix.work
   - Push to `hub` → auto-deploy to hub.inquivix.work

---

## 📚 Key Files

| File | Purpose |
|------|---------|
| `project-brief-fasttrack.md` | Project brief with architecture overview |
| `REPO-STRUCTURE.md` | Detailed monorepo architecture + development guide |
| `API-ARCHITECTURE.md` | Complete REST API documentation (endpoints, auth, deployment) |
| This file | Setup checklist for developers

---

## 🔗 Useful Links

- **Repository:** https://github.com/INQUIVIX-DEV/inquivix-monorepo
- **Turborepo Docs:** https://turbo.build/repo/docs
- **pnpm Docs:** https://pnpm.io/
- **Next.js Docs:** https://nextjs.org/docs
- **Payload CMS Docs:** https://payloadcms.com
- **Hono Docs:** https://hono.dev/ (for Cloudflare Workers API)
- **Cloudflare Pages Docs:** https://developers.cloudflare.com/pages/
- **Cloudflare Workers Docs:** https://developers.cloudflare.com/workers/
- **Wrangler CLI:** https://developers.cloudflare.com/workers/wrangler/install-and-update/

---

Status: **Ready for development** ✅

