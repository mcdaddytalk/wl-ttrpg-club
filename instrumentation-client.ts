'use client';

import * as Sentry from '@sentry/nextjs';

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

export function register() {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1.0,
    // Add any additional config here
    // integrations: [...],
    // environment: process.env.NODE_ENV,
    debug: process.env.NODE_ENV === 'development',
  });
}