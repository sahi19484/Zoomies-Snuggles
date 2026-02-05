// Vercel Serverless function: /api/telemetry
// Accepts POST JSON body and logs it. Optionally forwards to TELEMETRY_FORWARD_URL and to Sentry if configured.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const event = req.body || {};

    // Basic validation
    if (!event || typeof event !== 'object') {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    // Log to server logs for easy debugging
    console.log('[telemetry] received', JSON.stringify(event));

    // Optionally forward to an external telemetry sink
    const forwardUrl = process.env.TELEMETRY_FORWARD_URL;
    const forwardSecret = process.env.TELEMETRY_FORWARD_SECRET;

    if (forwardUrl) {
      try {
        await fetch(forwardUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(forwardSecret ? { 'x-telemetry-secret': forwardSecret } : {}),
          },
          body: JSON.stringify(event),
        });
      } catch (e) {
        console.error('[telemetry] forward failed', e);
      }
    }

    // Optionally send to Sentry (server-side) if configured
    if (process.env.SENTRY_DSN) {
      try {
        // Lazy require so we don't fail when dependency is missing
        // The @sentry/node dependency is optional — this block is best-effort
        // and will silently fail if not present.
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const Sentry = require('@sentry/node');
        if (Sentry && !Sentry.getCurrentHub().getClient()) {
          Sentry.init({ dsn: process.env.SENTRY_DSN });
        }
        Sentry.captureMessage('telemetry_event', {
          level: 'info',
          extra: event,
        });
      } catch (e) {
        console.error('[telemetry] sentry forward failed', e);
      }
    }

    return res.status(200).json({ status: 'ok' });
  } catch (err) {
    console.error('[telemetry] handler error', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
