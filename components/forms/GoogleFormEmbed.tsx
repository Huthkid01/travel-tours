import { GOOGLE_FORM_SHARE_URL } from "@/lib/google-form";
import { ConsultationFormSection } from "@/components/forms/ConsultationFormSection";
import { ExternalLink } from "lucide-react";

export interface GoogleFormEmbedProps {
  title?: string;
  description?: string;
}

/**
 * Native consultation form (no Google iframe — avoids TrustedScript / font console errors).
 * Optional external link to the legacy Google Form opens in a new tab.
 */
export function GoogleFormEmbed({
  title = "Consultation Form",
  description = "Submit your details below. After you submit, pay by bank transfer to confirm your consultation.",
}: GoogleFormEmbedProps) {
  return (
    <div>
      <ConsultationFormSection title={title} description={description} />
      <p className="mt-4 text-center text-xs text-navy-500 dark:text-navy-400">
        <a
          href={GOOGLE_FORM_SHARE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-gold-600 hover:underline dark:text-gold-400"
        >
          Open legacy Google Form
          <ExternalLink className="h-3 w-3" aria-hidden />
        </a>
      </p>
    </div>
  );
}
