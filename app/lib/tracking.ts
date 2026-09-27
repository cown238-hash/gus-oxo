declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>,
    ) => void;
  }
}

/** Send a custom event to Google Analytics 4. Safe to call anywhere —
 *  no-ops when gtag hasn't loaded yet (e.g. ad-blocker, consent denied). */
export function trackEvent(
  action: string,
  params?: Record<string, unknown>,
): void {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", action, params);
}
