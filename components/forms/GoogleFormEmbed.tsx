import { FileText } from "lucide-react";

export interface GoogleFormEmbedProps {
  formUrl?: string;
  title?: string;
  description?: string;
}

export function GoogleFormEmbed({
  formUrl,
  title = "Consultation Form",
  description = "Complete our consultation form to get started with your application.",
}: GoogleFormEmbedProps) {
  if (formUrl) {
    return (
      <section className="rounded-2xl border border-navy-100 bg-white p-6 shadow-xl dark:border-navy-800 dark:bg-navy-900">
        <h2 className="font-display text-2xl font-bold text-navy-900 dark:text-white">{title}</h2>
        {description && <p className="mt-2 text-navy-600 dark:text-navy-300">{description}</p>}
        <div className="mt-6 overflow-hidden rounded-xl border border-navy-200 dark:border-navy-700">
          <iframe
            src={formUrl}
            title={title}
            className="h-[600px] w-full"
            loading="lazy"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-dashed border-gold-500/40 bg-gold-500/5 p-12 text-center">
      <FileText className="mx-auto h-12 w-12 text-gold-500" />
      <h2 className="mt-4 font-display text-2xl font-bold text-navy-900 dark:text-white">{title}</h2>
      <p className="mt-3 text-navy-600 dark:text-navy-300">{description}</p>
      <p className="mt-6 inline-block rounded-full bg-navy-900 px-6 py-3 text-sm font-semibold text-gold-400 dark:bg-navy-800">
        Consultation form coming soon
      </p>
      <p className="mt-4 text-sm text-navy-500">
        Use our online consultation page or contact us on WhatsApp in the meantime.
      </p>
    </section>
  );
}
