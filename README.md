# Inquivix Monorepo

This is the unified repository for all Inquivix applications:
- **apps/web** - Public website (inquivix.com)
- **apps/admin** - CMS & admin panel (admin.inquivix.work)
- **apps/hub** - Internal operations platform (hub.inquivix.work)

## Quick Start

```bash
# Install dependencies
pnpm install

# Run all apps in dev mode
pnpm dev

# Build all apps
pnpm build

# Run tests
pnpm test
```

## Apps

See individual `apps/*/README.md` for app-specific documentation.

## Packages

Shared libraries in `packages/` that all apps depend on:
- `ui` - Shared React components
- `auth` - Authentication logic
- `db` - Database schemas & types
- `types` - Shared TypeScript types
- `utils` - Helper utilities
- `config` - Brand configuration
- `page-builder` - Page builder (Phase 2)

## Documentation

See `REPO-STRUCTURE.md` for detailed architecture.
