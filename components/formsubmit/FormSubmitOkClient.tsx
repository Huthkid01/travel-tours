"use client";

import { useEffect, useState } from "react";

/** Shown after FormSubmit redirects here — notifies opener and closes popup */
export function FormSubmitOkClient() {
  const [standalone, setStandalone] = useState(false);

  useEffect(() => {
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage({ type: "formsubmit:success" }, window.location.origin);
      window.setTimeout(() => window.close(), 400);
      return;
    }
    setStandalone(true);
  }, []);

  if (!standalone) {
    return (
      <main className="flex min-h-[40vh] items-center justify-center p-8 text-center">
        <p className="text-sm text-navy-600 dark:text-navy-300">Sending… this window will close.</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-[40vh] flex-col items-center justify-center gap-3 p-8 text-center">
      <p className="text-sm font-medium text-navy-800 dark:text-navy-100">Message sent via FormSubmit.</p>
      <p className="text-sm text-navy-600 dark:text-navy-400">You can close this tab and return to the site.</p>
    </main>
  );
}
