import { REMOTE_ENDPOINT } from '$lib/api-url';

export function imageUrl(img: string) {
    return `${REMOTE_ENDPOINT}/v1/file/${img}`;
}