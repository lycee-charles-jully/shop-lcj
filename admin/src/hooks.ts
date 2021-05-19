import { LOCAL_ENDPOINT } from '$lib/api-url';
import type { Handle } from '@sveltejs/kit';
import axios from 'axios';

export const handle: Handle = async ({ render, request }) => {

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
        request.path = '/admin/unauthorized';
        const response = await render(request);
        return {
            ...response,
            status: 401,
        };
    }


};
