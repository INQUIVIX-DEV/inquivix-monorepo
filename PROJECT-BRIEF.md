# Inquivix Website — Fast-Track Brief (Phase 1)

**Project:** WordPress → Next.js + Payload CMS
**Scope:** inquivix.com public website + CMS only
**Domain:** inquivix.com
**Status:** Draft
**Author:** Riza
**Date:** March 2026

> **Context:** This is a scoped-down Phase 1 brief, created in response to Joon's direction to get the website live fast. **Approach: Build the site in stages, with a "go-live gate" after Week 3 when the core site is stable and content is editable. Weeks 4–8 add features (forms, chatbot, analytics, SEO) that don't block launch.** The long-term vision (Inquivix Hub, AI page builder, internal chatbot, RBAC builder) is documented in [project-brief.md](project-brief.md) and remains the target — it just doesn't happen in Phase 1.

---

## 1. What This Phase Covers

**In scope:**
- inquivix.com public website (Next.js)
- Payload CMS (content management for the website)
- EN + KO multilingual support
- SEO setup
- GTM + analytics
- Contact forms + lead capture
- Cloudflare deployment (Workers + Pages)
- **Dify external chatbot** (visitor-facing on inquivix.com)

**Deferred to later phases:**
- Inquivix Hub (`hub.inquivix.work`) — internal operations platform
- AI page builder — Claude-powered content generation
- Internal knowledge chatbot — team-facing RAG assistant
- RBAC builder — custom role creation UI
- `docs.inquivix.work` — internal team documentation site

---

## 2. Why Payload CMS

Joon's original suggestion was Sanity. After researching both, Payload CMS is the better fit for Inquivix:

### Sanity — Current Pricing Reality

| Plan | Price | Roles Available |
|------|-------|----------------|
| Free | $0 | Admin + Viewer only — **no Editor role** |
| Growth | $15/seat/month | Editor role unlocked |

For 4 content editors + 1 SEO + 1 manager = **~$90/month ongoing**, and you're still on a hosted platform you don't control. Custom roles require Enterprise (custom pricing).

### Payload CMS

| Property | Detail |
|----------|--------|
| **Cost** | Free forever — open source, MIT license |
| **Hosting** | Self-hosted inside the Next.js app — deploys on Cloudflare Pages |
| **Vendor lock-in** | None — you own the code and data completely |
| **Setup** | One command: `npx create-payload-app` |
| **Admin panel** | Full admin UI out of the box |
| **Auth + RBAC** | Built-in user management and access control |
| **Localization** | EN/KO built-in |
| **File storage** | Integrated media management |
| **API** | REST + GraphQL included |
| **Live preview** | Supported natively |
| **Backing** | Recently acquired by Figma — well-resourced, active development |
| **Custom Branding** | ✅ Fully customizable admin UI with company branding (see below) |

**Key advantage:** Payload installs *inside* the Next.js app — it's not a separate service to deploy or maintain. One Cloudflare Pages deployment, one codebase.

### Custom Dashboard with Inquivix Branding — Built-In

Payload's admin interface is **fully customizable** using React components. You can:

- **Replace the entire dashboard** with a custom React component using Inquivix brand colors, fonts, and logo
- **Inject custom components** at any point in the admin UI (navigation, headers, sidebars, auth pages)
- **Build multiple custom views** — e.g., separate "Content Management Mode" and "Organization Mode" switching, exactly as planned for Inquivix Hub

Since Payload is embedded *inside* your Next.js app (not a separate service), the custom dashboard lives in the same codebase and deploys together. You have full React/TypeScript freedom to build any admin experience you want.

**Phase 1 approach:** Use Payload's default admin (clean, functional, ready immediately).  
**Phase 2+ approach:** Gradually replace it with a fully branded Inquivix admin as Inquivix Hub is built — no data migration needed.

**Long-term fit:** Payload's admin can evolve or be completely replaced with a custom dashboard using the same database — no migration required because you own everything.

---

## 3. Tech Stack

### Frontend Layer (inquivix.com, admin.inquivix.work, hub.inquivix.work)
| Layer | Technology | Replaces |
|-------|-----------|---------|
| Framework | Next.js 15 (App Router) | WordPress + Blocksy theme |
| CMS (Admin App only) | Payload CMS (embedded in Next.js) | WordPress admin + ACF + CPT UI |
| Styling | Tailwind CSS v4 | Blocksy + block plugins |
| Multilingual | next-intl | WPML |
| SEO (Web App only) | next-seo + custom metadata | Rank Math SEO |
| Analytics (Web App only) | GTM via next/script | GTM4WP |
| UTM Tracking (Web App only) | Custom hook | HandL UTM Grabber |
| Image Optimization | Next.js Image | Imagify |
| Carousel / Sliders | Embla Carousel | WP Carousel Pro |

### Backend/API Layer (api.inquivix.work)
| Layer | Technology | Purpose |
|-------|-----------|---------|
| Compute | Cloudflare Workers | Edge compute for REST API |
| Runtime | Hono (lightweight API framework) | HTTP routing & handlers |
| Database | Supabase PostgreSQL | Shared by Web + Admin apps |
| Auth | Supabase Auth | Team member verification |

### Shared Infrastructure
| Layer | Technology | Replaces |
|-------|-----------|---------|
| File Storage (Public) | Cloudflare R2 | WP Media Library |
| File Storage (Internal) | Supabase Storage (Phase 2+) | — |
| Email | Resend | WP Mail SMTP |
| Caching / CDN | Cloudflare Pages + Workers | WP Rocket + Object Cache Pro |
| Security | Cloudflare WAF + Next.js middleware | Wordfence |
| Deployment | Cloudflare Pages (auto-deploy from git) | Manual WP updates |

### What's NOT in this phase

| Feature | Why Deferred |
|---------|-------------|
| AI page builder (Claude API) | Phase 2 — significant build, needs its own phase |
| Google Nano Banana (AI image gen) | Phase 2 — tied to AI builder |
| Dify chatbots | Independent — can deploy separately, not gated by website |
| Supabase Storage (internal) | Phase 2+ — Phase 1 uses Cloudflare R2 for public media; Supabase Storage added for Hub internal files |
| Custom RBAC builder UI | Phase 2 — Payload's built-in roles are sufficient for Phase 1 |

---

## 4. Architecture — Phase 1

Three-tier separation: **Frontend** → **API Layer** → **Database + Storage**

```
┌─────────────────────────────────────────────────────────────┐
│              CLOUDFLARE PAGES (Static/SSG)                  │
├────────────────────┬────────────────────┬──────────────────┤
│   inquivix.com     │ admin.inquivix     │ hub.inquivix     │
│   (Next.js SSG)    │ .work (Next.js)    │ .work (Next.js)  │
│   - Public site    │ - CMS UI           │ - Internal ops   │
│   - No API routes  │ - No API routes    │ - No API routes  │
└────────────────────┴────────────────────┴──────────────────┘
         │                   │                      │
         └───────────────────┴──────────────────────┘
                         │
          Calls api.inquivix.work ↓
┌─────────────────────────────────────────────┐
│   api.inquivix.work (Cloudflare Workers)    │
│   REST API Layer                            │
│                                             │
│   GET  /content/:slug                       │
│   POST /leads                               │
│   POST /contact (form submission)           │
│   POST /upload (file to R2)                 │
│   GET  /analytics                           │
│   POST /chat (chatbot)                      │
└─────────────────────────────────────────────┘
         │                    │
         ▼                    ▼
    ┌────────────────┐  ┌──────────────────┐
    │ Supabase       │  │ Cloudflare R2    │
    │ PostgreSQL     │  │ Storage          │
    │                │  │                  │
    │ Content, users,│  │ Website imgs     │
    │ leads, CMS     │  │ PDFs, assets     │
    │ metadata       │  │                  │
    └────────────────┘  └──────────────────┘
```

### Key Improvements:

- **Frontend is pure frontend** — no API routes, faster static generation
- **Separate API layer** — can scale/cache independently, easier to monitor
- **Cloudflare Workers** — ultra-low latency, ~$0 cost for Inquivix's traffic
- **CORS-enabled** — all 3 frontends safely call the same API
- **Easier maintenance** — API logic in one place, not duplicated across apps
- **Better security** — public website doesn't expose internal endpoints

### Storage split (hybrid):
- **Public media** (website images, PDFs, blog assets) → Cloudflare R2 (zero egress fees, CDN-optimized)
- **Internal files** (future Inquivix Hub docs, uploads) → Supabase Storage (Phase 2+, auth-integrated)

### Domain Map — Phase 1

| Domain | Purpose | Stack | Phase |
|--------|---------|-------|-------|
| `inquivix.com` | Public website (frontend only) | Next.js SSG on Cloudflare Pages | ✅ Phase 1 |
| `admin.inquivix.work` | CMS admin panel (team only) | Next.js + Payload CMS on Cloudflare Pages | ✅ Phase 1 |
| `api.inquivix.work` | REST API layer | Cloudflare Workers | ✅ Phase 1 |
| `hub.inquivix.work` | Inquivix Hub (internal platform) | Next.js on Cloudflare Pages | ⏳ Phase 2+ |

### Code Repository Structure

All code lives in **one monorepo** on GitHub (INQUIVIX-DEV org):

```
inquivix-monorepo/
├── apps/
│   ├── web/          → inquivix.com (public website, Next.js SSG)
│   ├── admin/        → admin.inquivix.work (CMS & content mgmt, Next.js + Payload)
│   ├── api/          → api.inquivix.work (REST API layer, Cloudflare Workers)
│   └── hub/          → hub.inquivix.work (internal ops platform, Phase 2+)
│
└── packages/
    ├── ui/           → Shared UI components (used by web, admin, hub)
    ├── auth/         → Shared login logic (Hub + Admin)
    ├── db/           → Database schema & types (Web + Admin share same DB)
    ├── types/        → Shared data types (used across all apps)
    ├── api-client/   → Fetch wrapper for calling api.inquivix.work (used by web, admin, hub)
    ├── page-builder/ → Page editor (Phase 2, used by Admin + Web)
    ├── utils/        → Shared helpers
    └── config/       → Brand colors, fonts, constants
```

**What this means:**
- 4 independent apps (web, admin, api, hub) — each deploys separately to Cloudflare
- Web/Admin/Hub are **frontend only** (no `/api` routes) — all backend logic lives in the API layer
- Shared code (components, auth, database types, API client) prevents duplication
- Web + Admin always stay in sync with the same content via shared `@inquivix/db` package
- Easy to scale API independently without redeploying frontends

---

## 5. Content Architecture

### 5.1 Content Types (Payload Collections)

All existing WordPress content types will be recreated as Payload collections:

| Collection | Description | Custom Fields |
|-----------|-------------|---------------|
| Pages | Static pages (Home, About, Contact, Services landing, etc.) | Flexible block-based layout |
| Blog / Posts | SEO articles, published frequently | Author, category, tags, reading time |
| Case Studies | Client success stories | Client name, industry, services used, results/metrics, featured image |
| Industries | Vertical landing pages (Fashion, Beauty, F&B, etc.) | Industry icon, related services, related case studies |
| Resources | Guides, whitepapers, downloadables | Resource type, file upload, gated (yes/no), form trigger |
| Services | Individual service pages | Service category, key features, related case studies |
| Media | All uploaded files and images | Alt text, caption, dimensions |
| Users | CMS team members | Role, name, avatar |
| Form Submissions | Contact form leads | All fields + UTM data |

### 5.2 Languages

- **English (EN)** — primary
- **Korean (KO)** — full translation of all content, managed via Payload's built-in localization
- URL structure: `/en/` and `/ko/`
- Language switcher in navigation
- Separate SEO metadata per language
- hreflang tags for search engines

---

## 6. CMS Admin — What the Team Gets

Payload CMS admin panel gives the content team a clean, functional editing experience from day one — without building a custom dashboard.

### 6.1 Roles in Phase 1

Payload handles role-based access with built-in field-level control:

| Role | Access |
|------|--------|
| **Super Admin (Riza)** | Full access — all collections, settings, users, media |
| **Manager (Joon)** | Read-only access to form submissions + analytics |
| **Content Editor** | Create/edit/publish all content types, upload media |
| **SEO Editor** | Edit SEO metadata fields only across all content types |

> Phase 1 roles are managed directly in Payload's admin. The custom RBAC builder UI (where Joon or Riza can create/edit roles without touching code) is a Phase 2 feature.

### 6.2 Content Workflow

```
Content Editor creates or edits content in Payload admin
        ↓
Sets status to "Draft" or "Published"
        ↓
If approval flow is needed:
  Sets to "Pending Review"
        ↓
  Manager or Super Admin approves → Published live
  Manager or Super Admin rejects → Back to Editor with note
```

Payload supports draft/published status natively. A basic approval flow can be added via a custom status field.

### 6.3 Media Management

- Payload media library handles all image/file uploads
- Images auto-processed on upload (resize, WebP conversion)
- **Phase 1:** Stored in Cloudflare R2 (cheap ~$0.015/GB, fast, zero egress fees)
  - Website images, PDFs, blog assets all go to R2
  - R2 URLs cached via Cloudflare CDN
- **Phase 2+:** Add Supabase Storage for internal/auth-protected files (Inquivix Hub)
- Alt text and captions managed in Payload

---

## 6.4 Storage Architecture — Hybrid (R2 + Supabase)

**Why this approach?**

| Aspect | Decision | Why |
|--------|----------|-----|
| **Public Media** | Cloudflare R2 | Zero egress fees + CDN = fastest, cheapest for website assets |
| **Internal Files** | Supabase Storage (Phase 2+) | Auth-integrated with DB, perfect for Hub + internal uploads |
| **Year 1 Cost** | ~$26/month | R2: ~$0.75/mo, Supabase Pro: $25/mo (includes 100 GB + PostgreSQL DB) |
| **Scaling Cost** | Predictable | R2 stays at $0.015/GB, no egress surprises |
| **Vendor Risk** | Low | Both portable; you own all data |

**Implementation Timeline:**

- **Week 1–3 (Phase 1):** Configure R2, integrate Payload → R2, migrate WordPress images
- **Week 4+ (Phase 2):** Add Supabase Storage for Hub (no website file migration needed)

---

## 7. Public Website Features

### 7.1 SEO

- Per-page metadata (title, description, Open Graph, Twitter Card) — per language
- Schema markup: Organization, Article, FAQ, BreadcrumbList
- Auto-generated XML sitemap
- Robots.txt management
- Canonical URLs + hreflang for EN/KO
- Table of Contents on long-form posts and resources

### 7.2 Analytics & Marketing Attribution

- Google Tag Manager (GTM) — GA4, Meta Pixel, LinkedIn Insight Tag loaded via GTM
- UTM parameters captured on all form submissions
- UTM data stored with every lead record in the database

### 7.3 Forms & Lead Capture

- Multi-step contact form with conditional logic
- File upload support (client can attach brief)
- Email notification to Inquivix team on every submission (Resend)
- Auto-responder email to the lead
- All submissions stored in Payload (Form Submissions collection) with full UTM data
- Spam protection: honeypot + rate limiting

### 7.4 UI Components

- Client logo carousel
- Testimonial / review slider
- Case study carousel
- Sticky navigation header on scroll
- Responsive, mobile-first design

### 7.5 Performance Targets

- Cloudflare Pages + CDN for global edge caching
- Next.js Image component (WebP, lazy load, responsive sizes)
- Core Web Vitals: LCP < 2.5s, CLS < 0.1, FID < 100ms
- GTM loaded after page render — no render-blocking
- Google Fonts with `font-display: swap`

### 7.6 Security

- Cloudflare WAF in front of all traffic
- Payload admin route protected (no public access)
- SSL enforced
- Security headers: HSTS, CSP, X-Frame-Options, X-Content-Type-Options
- Bot protection via Cloudflare
- Rate limiting on form endpoints via Next.js middleware

### 7.7 Dify External Chatbot (Visitor-Facing)

A conversational AI assistant embedded on inquivix.com to help prospects and visitors learn about Inquivix's services, Korean market expertise, and how to work with Inquivix — without waiting for a team reply.

| Property | Detail |
|----------|--------|
| **Platform** | Dify (self-hosted, Docker) |
| **Audience** | Website visitors, potential clients |
| **Purpose** | Answer questions about services, Korea market, pricing range, how to get started |
| **Knowledge Sources** | Inquivix service pages, case study summaries, FAQ, Korean market guides |
| **Tone** | Matches Inquivix brand voice — consultative, confident, educational |
| **Lead Hook** | If visitor shows buying intent, chatbot nudges toward contact form |
| **Languages** | EN + KO |
| **Access** | Public — no login required, embedded widget on website |

**Setup:** Dify is deployed as a separate Docker instance (not in the Next.js app). The chatbot widget is embedded via a script tag on inquivix.com. Knowledge base contains only public-approved content — it has **zero access to internal data**.

---

## 8. Build Phases — 8 Weeks

> **Developer:** Riza — solo, full-stack + design + DevOps
> **Hours:** ~4–5 focused hours/day, running alongside other Inquivix projects

### Launch Strategy: **Go-Live After Week 3, Enhancements in Weeks 4–8**

The site is built in two parts:

1. **Weeks 1–3 (Launch Ready):** Core site + Payload CMS with all existing content accessible and editable. Site goes live when stable.
2. **Weeks 4–8 (Post-Launch Enhancements):** Add features (forms, analytics, chatbot, SEO optimizations) that don't block launch.

| Week | Focus | Deliverables | Launch Blocker? |
|------|-------|-------------|---|
| **Week 1** | Foundation + content clone | Next.js + Payload setup; WordPress site data imported to Payload; database schema created; base Tailwind config; Cloudflare Pages + R2 deployed | — |
| **Week 2** | All pages + navigation live | Home, About, Services, Contact, Blog/Resources pages built from cloned content; EN/KO language switcher; responsive layout; navigation complete | — |
| **Week 3** | Payload admin + QA ready | Payload dashboard polished; user roles configured (Manager, Editor, SEO Editor); team training; end-to-end workflow tested; site stable and editable | — |
| **→ GO-LIVE GATE** | **Site launches on inquivix.com** | **WordPress decommissioned. All content editable from Payload.** | **CRITICAL** |
| **Week 4** | Contact forms + UTM | Multi-step contact form; file upload; UTM capture; form submissions stored in Payload; Resend email notifications | No |
| **Week 5** | Analytics + GTM | Google Tag Manager integration; GA4, Meta Pixel, LinkedIn Insight; UTM data flowing; dashboard setup | No |
| **Week 6** | Dify external chatbot | Dify deployed; external chatbot configured; knowledge base (EN/KO); widget embedded; tested | No |
| **Week 7** | SEO + metadata | Per-page SEO fields; XML sitemap; hreflang; robots.txt; schema markup (Organization, Article, FAQ, Breadcrumbs) | No |
| **Week 8** | Performance + final QA | Core Web Vitals optimization; image optimization; caching; Cloudflare WAF config; security headers; final polish | No |

### Phase 1 Definition of Done — Two Gates

**Gate 1: After Week 3 (Go-Live Ready)**
- [ ] Next.js + Payload fully set up on Cloudflare Pages
- [ ] All WordPress content imported and accessible in Payload
- [ ] All pages (Home, About, Services, Contact, Blog, Resources) displaying correctly (EN/KO)
- [ ] Payload dashboard functional and editable by content team
- [ ] User roles configured (Manager, Editor, SEO Editor)
- [ ] Team trained on Payload workflow
- [ ] Site stable, responsive, basic performance acceptable
- [ ] Ready for DNS cutover

**Gate 2: After Week 8 (Full Feature Launch)**
- [ ] Contact forms live (multi-step, file upload, UTM, email notifications)
- [ ] GTM, GA4, Meta Pixel, LinkedIn Insight live
- [ ] Dify external chatbot live (EN/KO)
- [ ] SEO setup complete (metadata per page, sitemaps, hreflang, schema)
- [ ] Core Web Vitals green
- [ ] Cloudflare WAF active and configured
- [ ] All post-launch enhancements completed
- [ ] Full QA passed

---

## 9. What Comes After Phase 1

Phase 1 gets the website live, WordPress retired, and the external chatbot live. The long-term vision continues from here:

| Phase | What Gets Built | Approx. Timeline |
|-------|----------------|-----------------|
| **Phase 2** | Inquivix Hub (`hub.inquivix.work`) — internal platform shell, Organisation Mode | TBD |
| **Phase 3** | AI Page Builder — Claude integration, block system, manual editing | TBD |
| **Phase 4** | Internal knowledge chatbot (Dify, RAG) — team-facing assistant | TBD |
| **Phase 5** | Custom RBAC builder, advanced permissions | TBD |

---

## 10. Risks & Notes

| Risk | Mitigation |
|------|-----------|
| Content migration takes longer than expected | Start migration in Week 5 early; prioritise EN first, KO follows |
| Payload admin learning curve for content team | Week 4 includes a CMS walkthrough + basic guide for editors |
| WordPress DNS cutover | Done in Week 6 only after full QA — old site stays live until go-live is confirmed |
| EN → KO translation not ready by launch | Launch with EN complete; KO pages can follow within 1–2 weeks post-launch |
| Scope creep | Any new feature requests go into Phase 2 backlog — not into this phase |

---

## 11. Summary

| | WordPress (Now) | Phase 1 Fast-Track |
|-|-----------------|--------------------|
| **Timeline: Go-Live Gate** | — | **After Week 3** (site + CMS ready) |
| **Timeline: Full Feature Launch** | — | **After Week 8** (all enhancements) |
| CMS | WordPress admin + 36 plugins | Payload CMS (embedded, free, owned) |
| Cost | Growing plugin subscriptions | Fixed infra (Cloudflare Pages + DB) — no per-feature fees |
| Performance | Slow — 4 caching plugins to compensate | Fast by default |
| Security | 36 attack surfaces | Minimal surface + Cloudflare |
| Multilingual | WPML (paid, complex) | next-intl + Payload localization (free, built-in) |
| Content editing | Generic WP admin | Clean Payload admin, role-specific access, live after Week 3 |
| AI features | None | Phase 2 (not blocked, ready to build after website is live) |
| Chatbot | None | External visitor-facing chatbot (EN/KO) — added Week 6, no launch blocker |
| Ownership | Vendor-dependent | 100% owned by Inquivix |

---

*Phase 1 is split into two gates: a go-live gate after Week 3 when the site and CMS are stable, then 5 weeks of post-launch enhancements (forms, analytics, chatbot, SEO, performance). This lets the website stop the SEO bleed immediately without waiting for all features to be complete.*

*Long-term vision: [project-brief.md](project-brief.md) (dev) | [Inquivix-Website-Migration—Project Brief.md](Inquivix-Website-Migration—Project%20Brief.md) (Joon-readable)*
