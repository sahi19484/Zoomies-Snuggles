import { init as amplitudeInit, track as amplitudeTrack } from '@amplitude/analytics-browser';

let _initialized = false;
export function initAmplitude() {
  const key = import.meta.env.VITE_AMPLITUDE_API_KEY;
  if (!key) return;
  try {
    amplitudeInit(key);
    _initialized = true;
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') console.debug('Amplitude init failed', e);
  }
}

export function trackAmplitude(eventName: string, payload?: Record<string, any>) {
  try {
    if (!_initialized) return;
    amplitudeTrack(eventName, payload || {});
    if (process.env.NODE_ENV !== 'production') console.info('Amplitude track:', eventName, payload || {});
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') console.debug('Amplitude track failed', e);
  }
}
