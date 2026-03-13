# API — Cloudflare Workers

REST API layer serving all frontend applications.

## Quick Start

```bash
# Install dependencies
pnpm install

# Run locally
wrangler dev

# Deploy to production
wrangler deploy --env production
```

## Structure

- `src/index.ts` — Main entry point, route definitions
- `src/routes/` — API endpoint handlers
- `src/middleware/` — CORS, auth, logging, error handling
- `src/lib/` — Shared utilities (Supabase, R2, JWT, etc.)
- `wrangler.toml` — Cloudflare Workers configuration

## Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/health` | Health check | No |
| GET | `/api/content/:slug` | Get page/post by slug | No |
| POST | `/api/leads` | Create lead | No |
| GET | `/api/leads` | List leads (paginated) | Admin |
| POST | `/api/contact` | Submit contact form | No |
| POST | `/api/upload` | Upload file to R2 | Team |
| GET | `/api/analytics` | Get analytics data | Admin |
| POST | `/api/chat` | Chatbot message | No |

## Documentation

See [API-ARCHITECTURE.md](../../API-ARCHITECTURE.md) for complete API documentation.

## Environment Variables

Create `.env.local` or configure in Cloudflare secrets:

```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
R2_BUCKET=inquivix-media
PAYLOAD_CMS_URL=https://admin.inquivix.work
```

## Development

1. **Local:** `wrangler dev` → http://localhost:8787
2. **Staging:** Configure additional `wrangler.toml` environment
3. **Production:** Push to `api` branch → auto-deploys via GitHub Actions

## Testing

```bash
# Test local endpoint
curl http://localhost:8787/health

# With auth token
curl -H "Authorization: Bearer <token>" \
  http://localhost:8787/api/leads
```
