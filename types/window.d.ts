export {};

declare global {
  interface Window {
    FlutterwaveCheckout?: (options: Record<string, unknown>) => void;
    PaystackPop?: {
      setup: (options: Record<string, unknown>) => { openIframe: () => void };
    };
  }
}
