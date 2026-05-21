import { SITE_CONFIG } from "@/lib/constants";

export function MapEmbed() {
  return (
    <div className="overflow-hidden rounded-2xl border border-navy-100 shadow-lg dark:border-navy-800">
      <iframe
        title={`${SITE_CONFIG.name} location`}
        src={SITE_CONFIG.mapEmbedUrl}
        width="100%"
        height="320"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full"
      />
    </div>
  );
}
