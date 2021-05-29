import { LOCAL_ENDPOINT } from '$lib/api-url';
import type { Handle } from '@sveltejs/kit';
import axios from 'axios';
import * as cookie from 'cookie';

export const handle: Handle = async ({ render, request }) => {

    const cookies = cookie.parse(request.headers.cookie || '');

    if (!request.path.startsWith('/admin'))
        return {
            ...(await render(request)),
            status: 404,
        };

    try {
        const me = await axios.get(`${LOCAL_ENDPOINT}/v1/account/me`, {
            headers: request.headers,
        });
        const { role } = me.data;
        if (!role || role < 2000)
            throw new Error('Unauthorized');
        const response = await render(request);
        return {
            ...response,
        };
    } catch {
        return {
            status: 302,
            headers: {
                'Location': cookies.token ? '/' : `/login?r=${request.path}`,
            },
        };
    }

};
