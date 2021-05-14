import type { GetSession } from '@sveltejs/kit';
import * as cookie from 'cookie';

export const getSession: GetSession = req => {
    const cookies = req.headers.cookie
        ? cookie.parse(req.headers.cookie)
        : {};

    return {
        /** Returns true if the auth token is set */
        auth: typeof cookies?.token === 'string',
    };
};
