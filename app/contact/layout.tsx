import type { ReactNode } from "react";

export default function ContactLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://maps.google.com" />
      <link rel="preconnect" href="https://www.google.com" />
      <link rel="preconnect" href="https://staticmap.openstreetmap.de" />
      <link rel="dns-prefetch" href="https://maps.googleapis.com" />
      {children}
    </>
  );
}
