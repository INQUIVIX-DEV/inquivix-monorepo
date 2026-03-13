# API Client

Typed fetch wrapper for calling `api.inquivix.work` from frontend apps.

## Usage

```typescript
import { createLead, submitContact, getContent } from '@inquivix/api-client';

// Create a lead
const response = await createLead({
  name: 'John Doe',
  email: 'john@example.com',
  company: 'Acme Inc',
  message: 'Interested in your services',
});

if (response.error) {
  console.error(response.error.message);
} else {
  console.log('Lead created:', response.data);
}

// Submit contact form
await submitContact({
  name: 'Jane Smith',
  email: 'jane@company.com',
  subject: 'Website Inquiry',
  message: 'Can you help with Korean market entry?',
  phone: '+82-10-1234-5678',
});

// Get page content
const page = await getContent('services');
```

## API Functions

### Content
- `getContent(slug: string)` — Fetch page/post by slug

### Leads
- `createLead(data)` — Create a new lead
- `getLeads(token, options)` — List leads (admin only)

### Contact
- `submitContact(data)` — Submit contact form (public)

### File Upload
- `uploadFile(file, folder, token)` — Upload to R2 (team only)

### Analytics
- `getAnalytics(token, options)` — Get analytics data (admin only)

### Chatbot
- `sendChatMessage(data)` — Send message to chatbot (public)

### Health
- `healthCheck()` — Check API health

## Environment Variables

Set `NEXT_PUBLIC_API_URL` in your app's `.env.local`:

```bash
NEXT_PUBLIC_API_URL=https://api.inquivix.work
```

Defaults to `https://api.inquivix.work` if not set.

## Authentication

Pass JWT token for protected endpoints:

```typescript
const token = await getAuthToken(); // From @inquivix/auth
const leads = await getLeads(token);
```

## Error Handling

All functions return `{ data?, error? }`:

```typescript
const { data, error } = await createLead(...);

if (error) {
  console.error(error.error, error.message);
}
```

## Development

```bash
# Build
pnpm build

# Type check
pnpm type-check
```
