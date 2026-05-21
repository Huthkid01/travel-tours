import { Suspense } from "react";

export default function SuccessLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center">Loading...</div>}>{children}</Suspense>;
}
