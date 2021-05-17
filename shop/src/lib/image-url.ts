import { REMOTE_ENDPOINT } from '$lib/api-url';

const STATICALLY_CDN = import.meta.env.VITE_STATICALLY_CND as string;

export function imageUrl(img: string, width?: number) {
    if (STATICALLY_CDN) {
        return `${STATICALLY_CDN}${width ? `/w=${width}` : ''}/api/v1/file/${img}`;
    } else {
        return `${REMOTE_ENDPOINT}/v1/file/${img}`;
    }
}
