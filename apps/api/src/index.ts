import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Env = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_KEY: string;
  R2: R2Bucket;
  CACHE: KVNamespace;
  ENVIRONMENT: string;
};

const app = new Hono<{ Bindings: Env }>();

// CORS middleware
app.use(
  '*',
  cors({
    origin: ['https://inquivix.com', 'https://admin.inquivix.work', 'https://hub.inquivix.work'],
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Content routes (placeholder)
app.get('/api/content/:slug', (c) => {
  const slug = c.req.param('slug');
  return c.json(
    {
      error: 'NOT_IMPLEMENTED',
      message: 'Content endpoint not yet implemented',
      slug,
    },
    501
  );
});

// Leads routes (placeholder)
app.post('/api/leads', (c) => {
  return c.json(
    {
      error: 'NOT_IMPLEMENTED',
      message: 'Lead creation endpoint not yet implemented',
    },
    501
  );
});

app.get('/api/leads', (c) => {
  return c.json(
    {
      error: 'NOT_IMPLEMENTED',
      message: 'Lead list endpoint not yet implemented',
    },
    501
  );
});

// Contact form (placeholder)
app.post('/api/contact', (c) => {
  return c.json(
    {
      error: 'NOT_IMPLEMENTED',
      message: 'Contact form endpoint not yet implemented',
    },
    501
  );
});

// File upload (placeholder)
app.post('/api/upload', (c) => {
  return c.json(
    {
      error: 'NOT_IMPLEMENTED',
      message: 'File upload endpoint not yet implemented',
    },
    501
  );
});

// Analytics (placeholder)
app.get('/api/analytics', (c) => {
  return c.json(
    {
      error: 'NOT_IMPLEMENTED',
      message: 'Analytics endpoint not yet implemented',
    },
    501
  );
});

// Chatbot (placeholder)
app.post('/api/chat', (c) => {
  return c.json(
    {
      error: 'NOT_IMPLEMENTED',
      message: 'Chatbot endpoint not yet implemented',
    },
    501
  );
});

// 404 handler
app.notFound((c) => {
  return c.json(
    {
      error: 'NOT_FOUND',
      message: `Endpoint ${c.req.method} ${c.req.path} not found`,
    },
    404
  );
});

// Error handler
app.onError((err, c) => {
  console.error(err);
  return c.json(
    {
      error: 'INTERNAL_SERVER_ERROR',
      message: err.message,
    },
    500
  );
});

export default app;
