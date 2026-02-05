#!/usr/bin/env node
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(bodyParser.json());

app.post('/api/telemetry', async (req, res) => {
  const event = req.body;
  console.log('[local-telemetry] received', JSON.stringify(event));

  // Optional forward
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
      console.error('[local-telemetry] forward failed', e);
    }
  }

  res.json({ status: 'ok' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`[local-telemetry] listening on http://localhost:${port}/api/telemetry`);
});
