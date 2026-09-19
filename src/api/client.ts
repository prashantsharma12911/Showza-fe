import axios from 'axios';

// In production the app is served over HTTPS, so calling the HTTP backend directly is
// blocked as mixed content. Use same-origin relative URLs there; vercel.json rewrites
// /api/* to the backend. In dev, call the backend directly.
export const API_BASE_URL = import.meta.env.DEV
  ? import.meta.env.VITE_API_BASE_URL || 'http://Showza-dev-env.eba-c3h2hppu.ap-south-1.elasticbeanstalk.com'
  : '';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const STATUS_MESSAGES: Record<number, string> = {
  400: 'That request was invalid. Please check the form and try again.',
  401: 'Your session has expired. Please sign in again.',
  403: "You don't have permission to perform this action.",
  404: "The item you're looking for could not be found. It may have already been deleted.",
  405: 'This action is not supported.',
  409: 'This change conflicts with existing data. Please refresh the page and try again.',
  422: 'Some of the information provided is invalid.',
  429: 'Too many requests. Please wait a moment and try again.',
};

function friendlyStatusMessage(status: number): string {
  if (STATUS_MESSAGES[status]) return STATUS_MESSAGES[status];
  if (status >= 500) return 'Something went wrong on our end. Please try again in a few minutes.';
  return 'The request could not be completed. Please try again.';
}

// Only surface backend-provided detail when it reads like a real, short
// message meant for humans — never raw HTML error pages or stack traces.
function safeBackendDetail(data: unknown): string | null {
  const candidate =
    typeof data === 'string' ? data : (data as any)?.message ?? (data as any)?.error ?? null;
  if (!candidate || typeof candidate !== 'string') return null;
  if (candidate.length > 160) return null;
  if (/<[a-z][\s\S]*>/i.test(candidate)) return null;
  if (/internal server error|whitelabel/i.test(candidate)) return null;
  return candidate;
}

export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return 'The server is taking longer than expected to respond. Please try again.';
    }
    if (error.response) {
      const friendly = friendlyStatusMessage(error.response.status);
      const detail = safeBackendDetail(error.response.data);
      return detail && detail.toLowerCase() !== friendly.toLowerCase() ? `${friendly} (${detail})` : friendly;
    }
    if (error.request) {
      if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        return 'You appear to be offline. Please check your internet connection and try again.';
      }
      return 'We couldn’t reach the server. Please try again shortly.';
    }
  }
  return 'An unexpected error occurred. Please try again.';
}
