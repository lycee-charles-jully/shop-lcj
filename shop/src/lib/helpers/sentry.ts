import * as Sentry from '@sentry/browser';
import { Integrations } from '@sentry/tracing';
import { browser, dev } from '$app/env';

Sentry.init({
    dsn: 'https://2b3bfb5882eb49bdbeb9a0bc5e61c0ce@o796148.ingest.sentry.io/5802003',
    integrations: [
        new Integrations.BrowserTracing({
            tracingOrigins: [ dev ? 'localhost' : 'shop-lcj.fr' ],
        }),
    ],
    tracesSampleRate: 1.0,
    environment: dev ? 'dev' : 'production',
    enabled: browser && !dev,
    release: 'shop@1.0.0',
});
