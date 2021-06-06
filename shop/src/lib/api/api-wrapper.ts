import * as Sentry from '@sentry/browser';
import { API_URL } from '$lib/helpers/api-url';
import { browser } from '$app/env';


export async function apiWrapper<R>(url: string, options: ApiWrapperOptions<R> = {}): Promise<WrapperResult<R>> {

    const fetch = options.fetch || (typeof window === 'object' && window.fetch);

    if (typeof options.body !== 'undefined')
        options.init = {
            ...options.init,
            body: JSON.stringify(options.body),
            headers: {
                ...options.init?.headers,
                'Content-Type': 'application/json',
            },
        };

    if (options.method)
        options.init = {
            ...options.init,
            method: options.method,
        };

    const reqUrl = `${API_URL}/v1${url}`;
    let res: Response;

    const handleError: HandleErrorFn = (userError, status, codeError) => {
        status = status || res?.status || 500;
        if (browser && codeError)
            Sentry.captureException(codeError instanceof Error ? codeError : new Error(codeError), {
                tags: {
                    fetchUrl: `${options.method || 'GET'} ${options.reqPattern ? `${API_URL}/v1${options.reqPattern}` : reqUrl}`,
                },
            });
        else if (status >= 500)
            console.error(codeError || userError);
        return {
            data: null,
            error: userError instanceof Error ? userError.message : userError,
            status,
        };
    };

    if (typeof fetch !== 'function')
        return handleError('Impossible d\'effectuer la requête.', 500, new Error('Unable to make any request, fetch is undefined'));

    try {
        res = await fetch(reqUrl, options.init);
    } catch (e) {
        if (e.message?.includes('ECONNREFUSED'))
            return handleError(
                'Impossible d\'établir la connexion avec le serveur. Veuillez réessayer d\'ici quelques temps.',
                503,
                new Error('Cannot reach the server'),
            );
        return handleError('Impossible d\'effectuer la requête. Veuillez réessayer.', 503, e);
    }

    let resBody: string;
    try {
        resBody = await res.text();
    } catch (e) {
        return handleError('Impossible de récupérer les données. Veuillez réessayer.', 500, e);
    }

    let resData: any;
    try {
        resData = JSON.parse(resBody);
    } catch (e) {
        return handleError('Impossible de traiter les données. Veuillez réessayer.', 500, e);
    }

    if (!res.ok && !(options.allowedStatus && isAllowedStatus(res.status, options.allowedStatus))) {
        const errorMessage = (Array.isArray(resData?.message) ? resData.message.join(', ') : resData.message) || resBody;
        if (res.status < 500)
            return handleError(`${res.statusText}: ${errorMessage}`, res.status);
        else
            return handleError(
                'Une erreur est survenue au niveau du serveur. Veuillez réessayer.',
                res.status,
                new Error(`${res.statusText}: ${errorMessage}`),
            );
    }

    if (options.validate) {
        const validateResult = options.validate(resData, handleError, res);
        if (validateResult && validateResult.error)
            return validateResult;
    }

    return {
        error: null,
        data: resData,
        status: 200,
    };

}


function isAllowedStatus(status: number, allowedStatus: number | RegExp | (number | RegExp)[]): boolean {

    if (Array.isArray(allowedStatus))
        return allowedStatus.some(s => isAllowedStatus(status, s));

    if (typeof allowedStatus === 'number')
        return status === allowedStatus;
    else
        return !!status.toString().match(allowedStatus);
}


interface ApiWrapperOptions<R> {
    /** The fetch method (must be provided for ssr */
    fetch?: (info: RequestInfo, init?: RequestInit) => Promise<Response>;
    /** The request method */
    method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
    /* Options passed to the fetch function */
    init?: RequestInit;
    /** The request body */
    body?: any;
    /** The pattern of the request used, if it has dynamic values (eg: /product/:slug) */
    reqPattern?: string;
    /** A custom validation function */
    validate?: (data: R, onError: HandleErrorFn, res: Response) => void | WrapperResult<R>;
    /** The status code that won't be catched by the status validator */
    allowedStatus?: number | RegExp | (number | RegExp)[];
}

interface WrapperResult<R> {
    data: R;
    error: string | null;
    status: number;
}

type HandleErrorFn = (userError: string | Error, status?: number | null, codeError?: string | Error) => WrapperResult<null>;
