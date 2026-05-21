import { Suspense } from "react";

export default function PaymentLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="container-custom py-32">Loading payment...</div>}>{children}</Suspense>;
}
