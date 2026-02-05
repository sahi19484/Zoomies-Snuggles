# Monitoring & Analytics Setup

This project includes initial integration for Sentry (error reporting), Amplitude (product analytics), and Google Analytics (gtag). Follow the steps below to enable them in production.

## Environment variables
Add these to your environment (local `.env` and Vercel Environment Variables):

- `VITE_SENTRY_DSN` — Sentry DSN
- `VITE_SENTRY_RELEASE` — Optional release name (e.g., `v1.0.0`)
- `VITE_SENTRY_TRACES_SAMPLE_RATE` — Fraction for performance tracing (default `0.05`)
- `VITE_AMPLITUDE_API_KEY` — Amplitude API key
- `VITE_GA_MEASUREMENT_ID` — Google Analytics Measurement ID (G-XXXXXX)

## How it works
- `src/services/sentry.ts` initializes Sentry if `VITE_SENTRY_DSN` is set.
- `src/services/amplitude.ts` initializes Amplitude if `VITE_AMPLITUDE_API_KEY` is set.
- `src/services/analytics.ts` loads `gtag.js` when `VITE_GA_MEASUREMENT_ID` is set.
- All three are initialized in `src/main.tsx` on app startup.
- `src/services/telemetry.ts` forwards events to gtag and Amplitude and will send to `/api/telemetry` if available.

## Build config for Sentry
To get source-mapped stack traces in Sentry, ensure `build.sourcemap = true` in `vite.config.ts` (already enabled by default in this repo). You should upload source maps to Sentry during your deploy pipeline (use `sentry-cli` and set `SENTRY_AUTH_TOKEN` in CI).

## Next steps
- Add the environment variables to your Vercel project and redeploy.
- Verify that Sentry receives events by triggering a test error in dev/production.
- Confirm Amplitude events appear in the Amplitude dashboard.

I added a tiny Vercel serverless endpoint `/api/telemetry` to receive events and optionally forward them to another endpoint or Sentry (see `api/telemetry.js`).

### GitHub Actions: Sentry release upload
A GitHub Actions workflow has been added to upload releases and source maps to Sentry on pushes to `main`: `.github/workflows/sentry-release.yml`.

Secrets to add to GitHub repository settings (Actions > Secrets):
- `SENTRY_AUTH_TOKEN` (required)
- `SENTRY_ORG` (required)
- `SENTRY_PROJECT` (required)
- `TELEMETRY_HEALTHCHECK_URL` (recommended) — URL used by the telemetry healthcheck workflow to POST a test event (e.g., https://your-site.vercel.app/api/telemetry)
- `TELEMETRY_HEALTHCHECK_SECRET` (optional) — secret header value used by the healthcheck if you protect the endpoint

Server environment variables (Vercel / Production):
- `SENTRY_DSN` (optional) — used by the `/api/telemetry` serverless route to forward events to Sentry
- `TELEMETRY_FORWARD_URL` / `TELEMETRY_FORWARD_SECRET` (optional) — forward telemetry to an external collector

Make sure `SENTRY_AUTH_TOKEN`, `SENTRY_ORG` and `SENTRY_PROJECT` are set in GitHub for the release workflow to succeed.