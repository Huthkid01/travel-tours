"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/** Thin top bar while a new route is loading */
export function NavigationProgress() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(true);
    const timer = setTimeout(() => setActive(false), 350);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!active) return null;

  return (
    <div
      className="pointer-events-none fixed top-0 right-0 left-0 z-[500] h-0.5 bg-gold-500 shadow-[0_0_8px_rgba(212,175,55,0.8)]"
      role="progressbar"
      aria-hidden
    />
  );
}
