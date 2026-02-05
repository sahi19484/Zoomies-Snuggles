import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize instrumentation / analytics / error reporting
try {
  // Sentry
  import('./services/sentry').then(m => m.initSentry()).catch(() => {});
  // Amplitude
  import('./services/amplitude').then(m => m.initAmplitude()).catch(() => {});
  // Google Analytics (gtag)
  import('./services/analytics').then(m => m.initGtag()).catch(() => {});
} catch (e) {
  // ignore initialization failures
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
