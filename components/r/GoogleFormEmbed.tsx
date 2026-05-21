import { getGoogleFormEmbedUrl } from "@/lib/google-form";
import { FileText } from "lucide-react";

export interface GoogleFormEmbedProps {
  formUrl?: string;
  title?: string;
  description?: string;
}

export function GoogleFormEmbed({
  formUrl = getGoogleFormEmbedUrl(),
  title = "Consultation Form",
  description = "Complete our consultation form to get started with your application.",
}: GoogleFormEmbedProps) {
  if (formUrl) {
    return (
      <section className="rounded-2xl border border-navy-100 bg-white p-4 shadow-xl sm:p-6 dark:border-navy-800 dark:bg-navy-900">
        <h2 className="font-display text-xl font-bold text-navy-900 sm:text-2xl dark:text-white">{title}</h2>
        {description && <p className="mt-2 text-sm text-navy-600 sm:text-base dark:text-navy-300">{description}</p>}
        <div className="mt-4 overflow-hidden rounded-xl border border-navy-200 sm:mt-6 dark:border-navy-700">
          <iframe
            src={formUrl}
            title={title}
            className="h-[min(70vh,520px)] w-full sm:h-[600px]"
            loading="lazy"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-dashed border-gold-500/40 bg-gold-500/5 p-8 text-center sm:p-12">
      <FileText className="mx-auto h-12 w-12 text-gold-500" />
      <h2 className="mt-4 font-display text-xl font-bold text-navy-900 sm:text-2xl dark:text-white">{title}</h2>
      <p className="mt-3 text-sm text-navy-600 sm:text-base dark:text-navy-300">{description}</p>
      <p className="mt-6 inline-block rounded-full bg-navy-900 px-6 py-3 text-sm font-semibold text-gold-400 dark:bg-navy-800">
        Consultation form coming soon
      </p>
      <p className="mt-4 text-sm text-navy-500">
        Use our online consultation page or contact us on WhatsApp in the meantime.
      </p>
    </section>
  );
}
