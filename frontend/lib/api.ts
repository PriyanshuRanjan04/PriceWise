import axios from 'axios';

// Base axios instance — auth header is injected per-request via getAuthToken()
// Do NOT set Authorization here; use the withAuth() helper instead.
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;

/**
 * Returns an axios config object with the Clerk JWT attached.
 * Usage:
 *   await api.get('/api/v1/user/bookmarks', await withAuth(getToken))
 *   await api.post('/api/v1/user/bookmarks', body, await withAuth(getToken))
 *
 * Pass in the `getToken` function from Clerk's useAuth() hook.
 */
export async function withAuth(
    getToken: () => Promise<string | null>
): Promise<{ headers: Record<string, string> }> {
    const token = await getToken();
    return {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
}
