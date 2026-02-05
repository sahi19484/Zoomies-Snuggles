// Lightweight gtag loader + helper
export function initGtag() {
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!id || typeof window === 'undefined') return;

  // Insert gtag script
  if (!document.querySelector(`script[data-gtag="${id}"]`)) {
    const script = document.createElement('script');
    script.setAttribute('async', 'true');
    script.setAttribute('src', `https://www.googletagmanager.com/gtag/js?id=${id}`);
    script.setAttribute('data-gtag', id);
    document.head.appendChild(script);

    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(arguments);
    }
    (window as any).gtag = gtag;
    (window as any).gtag('js', new Date());
    (window as any).gtag('config', id);
  }
}

export function trackGtag(eventName: string, payload: Record<string, any> = {}) {
  try {
    if (typeof window === 'undefined' || !(window as any).gtag) return;
    (window as any).gtag('event', eventName, payload);
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') console.debug('gtag track failed', e);
  }
}
