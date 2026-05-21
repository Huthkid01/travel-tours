"use client";

import { useEffect } from "react";

/** Scrolls to #section when landing on home (e.g. nav “Google Form” from another page) */
export function HashScrollOnLoad() {
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;

    const scrollToHash = () => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    requestAnimationFrame(scrollToHash);
    const t = window.setTimeout(scrollToHash, 150);
    return () => window.clearTimeout(t);
  }, []);

  return null;
}
