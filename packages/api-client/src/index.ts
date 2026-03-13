/**
 * API Client
 *
 * Typed fetch wrapper for calling api.inquivix.work from frontend apps.
 * Used by web, admin, and hub apps to make API requests.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.inquivix.work';

export interface ApiError {
  error: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

/**
 * Make an API request
 */
export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
  token?: string
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data as ApiError,
      };
    }

    return {
      data: data as T,
    };
  } catch (err) {
    return {
      error: {
        error: 'NETWORK_ERROR',
        message: err instanceof Error ? err.message : 'Network request failed',
      },
    };
  }
}

/**
 * Content API
 */
export async function getContent(slug: string) {
  return apiRequest(`/api/content/${slug}`, {
    method: 'GET',
  });
}

/**
 * Leads API
 */
export async function createLead(data: {
  name: string;
  email: string;
  company?: string;
  message?: string;
  source?: string;
}) {
  return apiRequest('/api/leads', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getLeads(token: string, { status, limit }: { status?: string; limit?: number } = {}) {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (limit) params.append('limit', String(limit));

  return apiRequest(`/api/leads?${params.toString()}`, { method: 'GET' }, token);
}

/**
 * Contact Form API
 */
export async function submitContact(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}) {
  return apiRequest('/api/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * File Upload API
 */
export async function uploadFile(file: File, folder: 'blog' | 'resources' | 'case-studies', token: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  return apiRequest('/api/upload', {
    method: 'POST',
    body: formData,
    headers: {
      // Remove Content-Type to let browser set it with boundary
    },
  }, token);
}

/**
 * Analytics API
 */
export async function getAnalytics(
  token: string,
  { period, metric }: { period?: string; metric?: string } = {}
) {
  const params = new URLSearchParams();
  if (period) params.append('period', period);
  if (metric) params.append('metric', metric);

  return apiRequest(`/api/analytics?${params.toString()}`, { method: 'GET' }, token);
}

/**
 * Chatbot API
 */
export async function sendChatMessage(data: { message: string; session_id?: string }) {
  return apiRequest('/api/chat', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Health Check
 */
export async function healthCheck() {
  return apiRequest('/health', { method: 'GET' });
}
