import { LOCAL_ENDPOINT } from '$lib/api-url';
import type { GetSession, Handle } from '@sveltejs/kit';
import axios from 'axios';
import * as cookie from 'cookie';

export const getSession: GetSession = req => ({
    /** Returns true if the auth token is set */
    user: req.locals.user,
});


export const handle: Handle = async ({ request, render }) => {

    const cookies = request.headers.cookie
        ? cookie.parse(request.headers.cookie)
        : {};

    let user = null;
    if (cookies.token)
        try {
            user = await axios.get(`${LOCAL_ENDPOINT}/v1/auth/me`, {
                headers: request.headers,
            })
                .then(res => res.data);
        } catch (e) {
        }

    request.locals.user = user;

    return render(request);
};
