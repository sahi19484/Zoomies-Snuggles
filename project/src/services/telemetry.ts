export interface TelemetryPayload {
  [key: string]: any;
}

export function trackEvent(name: string, payload?: TelemetryPayload) {
  try {
    const event = {
      name,
      payload: payload || {},
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    };

    // If gtag (Google Analytics) is present, send an event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      try {
        (window as any).gtag('event', name, payload || {});
      } catch (e) {
        // ignore GA errors
      }
    }

    // Try to deliver to a telemetry endpoint if one exists (graceful fallback)
    if (typeof window !== 'undefined' && (navigator as any).sendBeacon) {
      try {
        const url = '/api/telemetry';
        (navigator as any).sendBeacon(url, JSON.stringify(event));
      } catch (e) {
        // Ignore failure — fallback to fetch below
      }
    } else if (typeof window !== 'undefined') {
      // Best-effort async POST, do not block UI
      fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
        keepalive: true
      }).catch(() => {});
    }

    // Always emit a console trace for local debugging
    if (process.env.NODE_ENV !== 'production') {
      console.info('Telemetry event:', event);
    }
  } catch (e) {
    // Non-blocking — telemetry must not break app
    if (process.env.NODE_ENV !== 'production') console.debug('Telemetry error', e);
  }
}

export function trackPermissionDenied(details: TelemetryPayload = {}) {
  trackEvent('permission_denied', details);
}
