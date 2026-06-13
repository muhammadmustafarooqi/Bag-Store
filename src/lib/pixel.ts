export function fbEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    try {
      if (params) {
        (window as any).fbq('track', eventName, params);
      } else {
        (window as any).fbq('track', eventName);
      }
    } catch (err) {
      console.error('Facebook Pixel tracking error:', err);
    }
  }
}
