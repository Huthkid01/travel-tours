"use client";

import {
  GOOGLE_FORM_CONSENT_KEY,
  type GoogleFormConsentStatus,
  readGoogleFormConsent,
  writeGoogleFormConsent,
} from "@/lib/google-form-consent";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface GoogleFormConsentContextValue {
  ready: boolean;
  consent: GoogleFormConsentStatus | null;
  popupOpen: boolean;
  accept: () => void;
  reject: () => void;
  openPopup: () => void;
  closePopup: () => void;
}

const GoogleFormConsentContext = createContext<GoogleFormConsentContextValue | null>(null);

export function GoogleFormConsentProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [consent, setConsent] = useState<GoogleFormConsentStatus | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const stored = readGoogleFormConsent();
    setConsent(stored);
    setPopupOpen(stored === null);
    setReady(true);
  }, []);

  const accept = useCallback(() => {
    writeGoogleFormConsent("accepted");
    setConsent("accepted");
    setPopupOpen(false);
  }, []);

  const reject = useCallback(() => {
    writeGoogleFormConsent("rejected");
    setConsent("rejected");
    setPopupOpen(false);
  }, []);

  const openPopup = useCallback(() => setPopupOpen(true), []);
  const closePopup = useCallback(() => setPopupOpen(false), []);

  const value = useMemo(
    () => ({ ready, consent, popupOpen, accept, reject, openPopup, closePopup }),
    [ready, consent, popupOpen, accept, reject, openPopup, closePopup]
  );

  return (
    <GoogleFormConsentContext.Provider value={value}>{children}</GoogleFormConsentContext.Provider>
  );
}

export function useGoogleFormConsent() {
  const ctx = useContext(GoogleFormConsentContext);
  if (!ctx) {
    throw new Error("useGoogleFormConsent must be used within GoogleFormConsentProvider");
  }
  return ctx;
}

/** @deprecated use GOOGLE_FORM_CONSENT_KEY */
export const CONSENT_KEY = GOOGLE_FORM_CONSENT_KEY;
