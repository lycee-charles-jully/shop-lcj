import { LOCAL_ENDPOINT } from '$lib/api-url';
import type { GetSession, Handle } from '@sveltejs/kit';
import axios from 'axios';
import * as cookie from 'cookie';


export const getSession: GetSession = req => ({
    user: req.locals.user,
});


export const handle: Handle = async ({ resolve, request }) => {

    const cookies = cookie.parse(request.headers.cookie || '');

    if (!request.path.startsWith('/admin')) {
        const response = await resolve(request);
        return {
            ...response,
            status: 404,
            headers: {
                ...response.headers,
                'X-Robots-Tag': 'noindex, nofollow',
            },
        };
    }

    try {
        const me = await axios.get(`${LOCAL_ENDPOINT}/v1/account/me`, {
            headers: request.headers,
        });
        const { role } = me.data;
        if (!role || role < 2000)
            throw new Error('Unauthorized');
        request.locals.user = me.data;
        const response = await resolve(request);
        return {
            ...response,
            headers: {
                ...response.headers,
                'X-Robots-Tag': 'noindex, nofollow',
            },
        };
    } catch {
        return {
            status: 302,
            headers: {
                'Location': cookies.token ? '/' : `/login?r=${request.path}`,
                'X-Robots-Tag': 'noindex, nofollow',
            },
        };
    }

};
