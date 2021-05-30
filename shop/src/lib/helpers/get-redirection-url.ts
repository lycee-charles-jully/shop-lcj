export function getRedirectionUrl(query: URLSearchParams): string | null {
    const r = query.get('r');

    if (!r)
        return null;

    if (r.startsWith('/') && !r.includes('.'))
        return r;
    else
        return null;
}
