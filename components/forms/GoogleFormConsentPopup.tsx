"use client";

import { useGoogleFormConsent } from "@/components/forms/GoogleFormConsentProvider";
import { Cookie, X } from "lucide-react";
import { useEffect } from "react";

export function GoogleFormConsentPopup() {
  const { ready, popupOpen, consent, accept, reject, closePopup } = useGoogleFormConsent();

  useEffect(() => {
    if (!popupOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [popupOpen]);

  if (!ready || !popupOpen) return null;

  const scrollToForm = () => {
    document.getElementById("consultation-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleAccept = () => {
    accept();
    requestAnimationFrame(scrollToForm);
  };

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-navy-950/70 backdrop-blur-sm"
        aria-label="Close"
        onClick={consent === null ? reject : closePopup}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-navy-200 bg-white p-6 shadow-2xl sm:p-8 dark:border-navy-700 dark:bg-navy-900">
        {consent !== null && (
          <button
            type="button"
            onClick={closePopup}
            className="absolute top-4 right-4 rounded-full p-1 text-navy-500 hover:bg-navy-100 dark:hover:bg-navy-800"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-500/15">
          <Cookie className="h-7 w-7 text-gold-500" />
        </div>
        <h2
          id="cookie-consent-title"
          className="mt-4 text-center font-display text-xl font-bold text-navy-900 sm:text-2xl dark:text-white"
        >
          Cookies & consultation form
        </h2>
        <p className="mt-3 text-center text-sm text-navy-600 sm:text-base dark:text-navy-300">
          We use cookies so our Google consultation form can load. Allow cookies to open the form on this site.
          If you decline, you can still open it anytime from the video section.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={handleAccept}
            className="inline-flex flex-1 items-center justify-center rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-navy-950 transition hover:bg-gold-400 sm:flex-initial"
          >
            Allow cookies
          </button>
          <button
            type="button"
            onClick={reject}
            className="inline-flex flex-1 items-center justify-center rounded-full border border-navy-300 px-6 py-3 text-sm font-semibold text-navy-700 transition hover:bg-navy-50 sm:flex-initial dark:border-navy-600 dark:text-navy-200 dark:hover:bg-navy-800"
          >
            Decline
          </button>
        </div>
        <p className="mt-4 text-center text-xs text-navy-500">
          Or use{" "}
          <a href="/consultation" className="font-medium text-gold-600 hover:underline">
            our online application
          </a>
        </p>
      </div>
    </div>
  );
}
