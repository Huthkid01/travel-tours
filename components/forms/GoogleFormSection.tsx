"use client";

import { GoogleFormEmbed } from "@/components/forms/GoogleFormEmbed";
import { useGoogleFormConsent } from "@/components/forms/GoogleFormConsentProvider";
import { FileText } from "lucide-react";

interface GoogleFormSectionProps {
  title?: string;
  description?: string;
}

export function GoogleFormSection({
  title = "Consultation Form",
  description = "Complete our official Google Form to start your consultation.",
}: GoogleFormSectionProps) {
  const { ready, consent, openPopup } = useGoogleFormConsent();

  if (!ready) {
    return <div className="min-h-[200px] animate-pulse rounded-2xl bg-navy-100 dark:bg-navy-900" aria-hidden />;
  }

  if (consent === "accepted") {
    return <GoogleFormEmbed title={title} description={description} />;
  }

  return (
    <section className="rounded-2xl border border-dashed border-navy-200 bg-navy-50/80 p-8 text-center dark:border-navy-700 dark:bg-navy-900/50">
      <FileText className="mx-auto h-10 w-10 text-gold-500" />
      <h3 className="mt-3 font-display text-lg font-bold text-navy-900 dark:text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-navy-600 dark:text-navy-400">
        {consent === "rejected"
          ? "You declined cookies. Tap below to allow cookies and load the Google Form."
          : "Allow cookies from the site popup to load the consultation form here."}
      </p>
      <button
        type="button"
        onClick={openPopup}
        className="mt-5 inline-flex items-center justify-center rounded-full bg-gold-500 px-8 py-3 text-sm font-semibold text-navy-950 transition hover:bg-gold-400"
      >
        Open Google Form
      </button>
    </section>
  );
}
