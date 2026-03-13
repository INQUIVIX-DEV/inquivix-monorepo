# API Architecture — `api.inquivix.work`

## Overview

The API layer is a **separate Cloudflare Workers application** that serves as the single backend for all frontend apps:
- `inquivix.com` (public website)
- `admin.inquivix.work` (CMS admin)
- `hub.inquivix.work` (internal platform)

**Benefits:**
- ✅ Frontends are pure frontend (no API routes) → faster static generation
- ✅ API scales independently without redeploying frontends
- ✅ Single source of truth for backend logic
- ✅ Easy to monitor, cache, and rate-limit
- ✅ Clear separation of concerns
- ✅ ~$0 cost on Cloudflare's generous Workers free tier

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Compute** | Cloudflare Workers | Edge compute, global distribution |
| **Framework** | Hono | Lightweight, typed HTTP routing |
| **Database** | Supabase PostgreSQL | Shared with admin/web for content sync |
| **Auth** | Supabase Auth + JWT | Team member authentication |
| **File Storage** | Cloudflare R2 | Media uploads for website |
| **CMS Queries** | Payload CMS API | Query content from admin app |
| **Config** | `wrangler.toml` | Cloudflare Workers configuration |

---

## Directory Structure

```
apps/api/
├── src/
│   ├── index.ts                  # Worker entry point
│   ├── routes/                   # API endpoints
│   │   ├── content.ts            # GET /api/content/:slug
│   │   ├── leads.ts              # POST/GET /api/leads
│   │   ├── contact.ts            # POST /api/contact (form handling)
│   │   ├── upload.ts             # POST /api/upload (file to R2)
│   │   ├── analytics.ts          # GET /api/analytics
│   │   └── chat.ts               # POST /api/chat (chatbot proxy)
│   │
│   ├── middleware/               # Shared middleware
│   │   ├── cors.ts               # CORS headers
│   │   ├── auth.ts               # JWT verification
│   │   ├── logging.ts            # Request logging
│   │   └── error.ts              # Error handling
│   │
│   └── lib/                      # Shared utilities
│       ├── supabase.ts           # Supabase client
│       ├── r2.ts                 # Cloudflare R2 client
│       ├── jwt.ts                # JWT verification logic
│       ├── payload.ts            # Payload CMS queries
│       └── validators.ts         # Request validation (Zod)
│
├── wrangler.toml                # Cloudflare Workers config
├── package.json
├── tsconfig.json
└── worker-configuration.d.ts   # Type definitions for Worker env
```

---

## API Endpoints

### Content Queries

**`GET /api/content/:slug`** — Fetch a page or post by slug

```typescript
// Request
GET /api/content/services

// Response (200)
{
  "type": "page",
  "slug": "services",
  "title": "Services",
  "content": {...},
  "seo": {
    "title": "...",
    "description": "..."
  }
}
```

**Implementation:**
- Query Payload CMS (via admin app) for content with matching slug
- Cache response in Cloudflare (1 hour TTL)
- Return structured data for frontend to render

---

### Lead Management

**`POST /api/leads`** — Create a lead from contact form or other source

```typescript
// Request
POST /api/leads
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Acme Inc",
  "message": "Interested in SEO services",
  "source": "contact-form"
}

// Response (201)
{
  "id": "lead-uuid",
  "created_at": "2026-03-13T...",
  "status": "new"
}
```

**Implementation:**
- Validate input with Zod
- Create record in Supabase `leads` table
- Send webhook/email notification
- Return lead ID

---

**`GET /api/leads`** — Fetch leads (admin only)

```typescript
// Request
GET /api/leads?status=new&limit=50
Authorization: Bearer <jwt-token>

// Response (200)
{
  "data": [
    {
      "id": "...",
      "name": "...",
      "email": "...",
      "status": "new",
      "created_at": "..."
    }
  ],
  "total": 127
}
```

**Implementation:**
- Verify JWT token (must be admin or manager)
- Query Supabase `leads` table
- Return paginated results
- Auth-gated (admin only)

---

### Contact Form

**`POST /api/contact`** — Handle contact form submissions (public)

```typescript
// Request
POST /api/contact
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@company.com",
  "subject": "Website inquiry",
  "message": "Can you help us with...",
  "phone": "+82-10-1234-5678"
}

// Response (200)
{
  "success": true,
  "message": "Thank you for your message"
}
```

**Implementation:**
- Validate input (Zod schema)
- Save to Supabase `contact_submissions` table
- Send confirmation email to user (Resend)
- Send notification email to team (Resend)
- Return success message

---

### File Uploads

**`POST /api/upload`** — Upload file to Cloudflare R2 (team only)

```typescript
// Request
POST /api/upload
Content-Type: multipart/form-data
Authorization: Bearer <jwt-token>

{
  "file": <binary>,
  "folder": "blog" | "resources" | "case-studies"
}

// Response (201)
{
  "url": "https://cdn.inquivix.com/blog/filename.jpg",
  "key": "blog/filename.jpg",
  "size": 2048576
}
```

**Implementation:**
- Verify JWT (admin/team only)
- Validate file type & size
- Generate unique filename
- Upload to R2 bucket
- Return public URL (via Cloudflare CDN)

---

### Analytics

**`GET /api/analytics`** — Aggregate website analytics (admin only)

```typescript
// Request
GET /api/analytics?period=month&metric=pageviews
Authorization: Bearer <jwt-token>

// Response (200)
{
  "period": "month",
  "data": [
    {
      "date": "2026-03-01",
      "pageviews": 1250,
      "visitors": 890,
      "sessions": 950
    },
    ...
  ],
  "summary": {
    "total_pageviews": 38000,
    "total_visitors": 22500
  }
}
```

**Implementation:**
- Query GTM/GA4 API or Supabase analytics table
- Aggregate data by time period
- Return summary + daily breakdown
- Auth-gated (admin only)

---

### Chatbot

**`POST /api/chat`** — Proxy chatbot requests (public)

```typescript
// Request
POST /api/chat
Content-Type: application/json

{
  "message": "What services do you offer?",
  "session_id": "session-uuid"
}

// Response (200)
{
  "reply": "We offer Korean market entry services...",
  "session_id": "session-uuid"
}
```

**Implementation:**
- Forward to Dify chatbot API
- Cache session in Supabase
- Return streamed response
- Public endpoint (no auth required)

---

## Authentication & Authorization

### JWT Token Flow

1. **Team member logs in** (via Supabase Auth in admin/hub app)
2. **Token sent to api.inquivix.work** in `Authorization: Bearer <token>` header
3. **API verifies JWT** with Supabase public key
4. **Route handler checks role** (admin, manager, viewer, etc.)
5. **Request proceeds or rejected** with 401/403

### Implementation (Middleware)

```typescript
// middleware/auth.ts
export async function verifyAuth(req: Request) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (!token) throw new Error('No token');
  
  const { data, error } = await supabase.auth.getUser(token);
  if (error) throw new Error('Invalid token');
  
  return data.user;
}

// routes/leads.ts
export async function handleGetLeads(req: Request, env) {
  const user = await verifyAuth(req);
  
  // Check role
  if (!['admin', 'manager'].includes(user.role)) {
    return new Response('Forbidden', { status: 403 });
  }
  
  // Proceed...
}
```

---

## CORS Policy

All endpoints allow requests from:
- `https://inquivix.com`
- `https://admin.inquivix.work`
- `https://hub.inquivix.work`

**Middleware (cors.ts):**

```typescript
export function setCorsHeaders(response: Response, origin: string) {
  const allowedOrigins = [
    'https://inquivix.com',
    'https://admin.inquivix.work',
    'https://hub.inquivix.work'
  ];
  
  if (allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  
  return response;
}
```

---

## Error Handling

All endpoints return structured error responses:

```typescript
// 400 Bad Request
{
  "error": "VALIDATION_ERROR",
  "message": "Email is required",
  "details": { "field": "email" }
}

// 401 Unauthorized
{
  "error": "UNAUTHORIZED",
  "message": "Invalid or missing token"
}

// 403 Forbidden
{
  "error": "FORBIDDEN",
  "message": "Admin role required"
}

// 500 Internal Server Error
{
  "error": "INTERNAL_SERVER_ERROR",
  "message": "Something went wrong"
}
```

---

## Deployment

### Cloudflare Workers Setup

**Step 1: Configure `wrangler.toml`**

```toml
name = "inquivix-api"
main = "src/index.ts"
compatibility_date = "2025-03-13"

[env.production]
route = "api.inquivix.work/*"
zone_id = "your-zone-id"

[env.production.vars]
SUPABASE_URL = "https://xxx.supabase.co"
SUPABASE_ANON_KEY = "your-key"
R2_BUCKET = "inquivix-media"
R2_ACCOUNT_ID = "your-account-id"
PAYLOAD_CMS_URL = "https://admin.inquivix.work"
```

**Step 2: Deploy**

```bash
# Via GitHub Actions (automatic)
git push origin api

# Or manually
wrangler deploy --env production
```

**Step 3: Connect Domain**

- In Cloudflare dashboard
- Workers > API > Settings
- Add route: `api.inquivix.work/*`

---

## Environment Variables

Store securely in Cloudflare Workers secrets:

```bash
wrangler secret put SUPABASE_URL --env production
wrangler secret put SUPABASE_ANON_KEY --env production
wrangler secret put SUPABASE_SERVICE_KEY --env production
wrangler secret put R2_ACCESS_KEY_ID --env production
wrangler secret put R2_SECRET_ACCESS_KEY --env production
```

Access in code:

```typescript
const supabaseUrl = env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_ANON_KEY;
```

---

## Rate Limiting

**Public endpoints (contact, chat):**
- 10 requests per minute per IP

**Admin endpoints (leads, analytics, upload):**
- 100 requests per minute per user

**Content endpoints:**
- 1000 requests per minute (cached)

**Implementation:**
- Use `env.RATE_LIMITER` (Durable Objects)
- Or store in KV for simple counting

---

## Caching Strategy

| Endpoint | Cache TTL | Invalidation |
|----------|-----------|--------------|
| `GET /api/content/:slug` | 1 hour | On content update in admin |
| `GET /api/analytics` | 30 minutes | Manual or scheduled |
| `GET /api/leads` | None | Always fresh |
| `POST /api/contact` | N/A | — |
| `POST /api/upload` | N/A | — |

**Cache invalidation example:**

```typescript
// When admin updates content
POST /api/content/:slug/invalidate
Authorization: Bearer <admin-token>

// Clears Cloudflare cache for that slug
```

---

## Monitoring & Logging

**Enable Cloudflare Analytics Engine:**

```typescript
// Log requests
await env.ANALYTICS_ENGINE.writeDataPoint({
  indexes: ['api', req.method, endpoint],
  blobs: [timestamp, user_id, status],
  doubles: [duration_ms]
});
```

**View metrics:**
- Cloudflare dashboard > Workers > Analytics
- Request count, latency, errors by endpoint

---

## Testing

**Local development:**

```bash
# Install Wrangler
npm install -g wrangler

# Run locally
wrangler dev --env production

# API available at http://localhost:8787
curl http://localhost:8787/api/content/services
```

**Integration tests:**

```typescript
// test/api.test.ts
import { Hono } from 'hono';
import { app } from '../src/index';

test('GET /api/content/:slug', async () => {
  const response = await app.request(
    new Request('http://api/api/content/services')
  );
  expect(response.status).toBe(200);
});
```

---

## Next Steps

1. **Initialize API app** in monorepo
   - `pnpm create hono@latest apps/api --template cloudflare-workers`
   
2. **Set up environment variables** in Cloudflare
   - Supabase credentials
   - R2 bucket credentials
   - Domain configuration

3. **Create route handlers** (start with content queries)

4. **Set up GitHub Actions** for auto-deploy on push to `api` branch

5. **Test locally** before deploying to production

---

## Related Files

- `projects/website-migration/project-brief-fasttrack.md` — Overall architecture
- `REPO-STRUCTURE.md` — Monorepo structure & deployments
- `MONOREPO-SETUP-CHECKLIST.md` — Developer setup tasks
