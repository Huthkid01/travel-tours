"use client";

import { useGoogleFormConsent } from "@/components/forms/GoogleFormConsentProvider";
import { FileText } from "lucide-react";

/** Under the video — only after user declines cookies; reopens the site popup */
export function GoogleFormVideoPrompt() {
  const { ready, consent, openPopup } = useGoogleFormConsent();

  if (!ready || consent !== "rejected") return null;

  return (
    <div className="mx-auto mt-6 max-w-sm rounded-xl border border-gold-500/30 bg-gold-500/5 p-4 text-center sm:max-w-md">
      <FileText className="mx-auto h-6 w-6 text-gold-500" />
      <p className="mt-2 text-sm font-medium text-navy-800 dark:text-navy-100">Consultation form</p>
      <p className="mt-1 text-xs text-navy-600 dark:text-navy-400">
        Allow cookies to load our Google Form.
      </p>
      <button
        type="button"
        onClick={openPopup}
        className="mt-3 inline-flex items-center justify-center rounded-full bg-gold-500 px-5 py-2 text-xs font-semibold text-navy-950 transition hover:bg-gold-400"
      >
        Open Google Form
      </button>
    </div>
  );
}
