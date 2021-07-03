import { REMOTE_ENDPOINT } from '$lib/helpers/api-url';

const STATICALLY_CDN = import.meta.env.VITE_STATICALLY_CND as string | undefined;

export function imageUrl(img: string, width?: number) {
    if (STATICALLY_CDN) {
        return `${STATICALLY_CDN}${width ? `/w=${width}` : ''}/api/v1/file/${img}`;
    } else {
        return `${REMOTE_ENDPOINT}/v1/file/${img}${width ? `?size=${width}` : ''}`;
    }
}


export function staticImageUrl(img: string, width?: number) {
    if (STATICALLY_CDN) {
        return `${STATICALLY_CDN}${width ? `/w=${width}` : ''}/${img}`;
    } else {
        return `/${img}${width ? `?size=${width}` : ''}`;
    }
}
