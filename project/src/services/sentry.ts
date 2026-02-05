import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    dsn,
    integrations: [new BrowserTracing()],
    tracesSampleRate: Number(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE) || 0.05,
    environment: import.meta.env.MODE,
    release: import.meta.env.VITE_SENTRY_RELEASE || undefined,
  });
}

export { Sentry };
