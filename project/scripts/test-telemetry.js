#!/usr/bin/env node
/**
 * Simple script to POST a test telemetry event to /api/telemetry.
 * Usage:
 *   TELEMETRY_URL="http://localhost:3000/api/telemetry" node scripts/test-telemetry.js
 *   TELEMETRY_FORWARD_SECRET="your-secret" node scripts/test-telemetry.js
 */

const os = require('os');

const url = process.env.TELEMETRY_URL || 'http://localhost:3000/api/telemetry';
const secret = process.env.TELEMETRY_FORWARD_SECRET || process.env.TELEMETRY_SECRET || '';

const event = {
  name: 'test_event',
  payload: {
    test: true,
    timestamp: new Date().toISOString(),
    hostname: os.hostname(),
    env: process.env.NODE_ENV || 'development'
  }
};

(async function () {
  try {
    if (typeof fetch !== 'function') {
      // Node 18+ has fetch; if not available, require node-fetch fallback
      try {
        global.fetch = (await import('node-fetch')).default;
      } catch (_) {
        console.error('fetch is not available in this Node runtime. Use Node 18+ or install node-fetch.');
        process.exit(1);
      }
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(secret ? { 'x-telemetry-secret': secret } : {})
      },
      body: JSON.stringify(event),
    });

    const text = await res.text();
    console.log('POST', url);
    console.log('Status:', res.status);
    console.log('Response:', text);
    process.exit(res.ok ? 0 : 1);
  } catch (err) {
    console.error('Error posting telemetry:', err);
    process.exit(1);
  }
})();
