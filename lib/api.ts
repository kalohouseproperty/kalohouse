'use client';

const rawApiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
export const apiBaseUrl = rawApiBaseUrl.endsWith('/')
    ? rawApiBaseUrl.slice(0, -1)
    : rawApiBaseUrl;

    function stripApiPrefix(url: string) {
        return url.replace(/\/api\/v1\/?$/, '');
    }
    function isLoopbackHostname(hostname: string) {
        return hostname === 'localhost' || hostname === '127.0.0.1';
    }
    function getBrowserReachableOrigin(){
        if (typeof window === 'undefined') {
            return null;
        }
        try {
            const configureUrl = new URL(apiBaseUrl, window.location.origin);
            if (isLoopbackHostname(configureUrl.hostname) && !isLoopbackHostname(window.location.hostname)) {
                configureUrl.hostname = window.location.hostname;
                configureUrl.port = window.location.port || "8000";
                configureUrl.protocol = window.location.protocol;
            }            
            return configureUrl.origin;
        }catch (e) {
            return window.location.origin;
        }
    }

    function getMediaBaseUrl(){
        const origin = getBrowserReachableOrigin();
        if (origin) return origin;
        if (/^https?:\/\//.test(apiBaseUrl)) {
            try {
                return new URL(apiBaseUrl).origin;
            }catch (e) {
                return stripApiPrefix(apiBaseUrl);
            }
        }
        return stripApiPrefix(apiBaseUrl);
    }

    const mediaBaseUrl = getMediaBaseUrl();

    export async function getAccessToken(): Promise<string | null> {
        // NextAuth handle session on the server side, 
        // for client-side fetch we can expand this to get the JWT if needed.
        return null;
    }

export const getMediaUrl = (path: string) => {
    if (!path) {
        console.warn('[Media] Empty path provided');
        return '';
    }
    if(path.startsWith('http')) {
        console.log('[Media] External URL:', path);
        return path;
    }
    
    // Local uploaded files (/uploads/*) should always use the current page's domain (frontend)
    // not the backend domain
    if (path.startsWith('/uploads')) {
        const baseUrl = typeof window !== 'undefined' 
            ? window.location.origin 
            : 'http://localhost:3000';
        const resolvedUrl = `${baseUrl}${path}`;
        console.log('[Media] Local upload URL:', { originalPath: path, baseUrl, resolvedUrl });
        return resolvedUrl;
    }
    
    // For other paths, use the configured media base URL
    const resolvedUrl = `${mediaBaseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
    console.log('[Media] Backend URL:', { originalPath: path, baseUrl: mediaBaseUrl, resolvedUrl });
    return resolvedUrl;
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await getAccessToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(options.headers || {})
    };
    const response = await fetch(`${apiBaseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`, {
        ...options,
        headers,
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({detail: ' unknown error'}));
        throw new Error(error.detail || response.statusText);
    }
    return response.json();
}

export const api = {
    get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
    post: <T>(endpoint: string, body?: any) => request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
    put: <T>(endpoint: string, body?: any) => request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
    delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};