// app/instrumentation.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  // You can configure this further for environments
  environment: process.env.NODE_ENV,
  debug: process.env.NODE_ENV === 'development',
});
