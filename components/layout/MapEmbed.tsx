import { SITE_CONFIG } from "@/lib/constants";

export function MapEmbed() {
  return (
    <div className="overflow-hidden rounded-2xl border border-navy-100 shadow-lg dark:border-navy-800">
      <iframe
        title={`${SITE_CONFIG.name} location`}
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.254!2d3.342!3d6.601!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8d8c8c8c8c8d%3A0x0!2zS2VqYSwgTGFnb3MsIE5pZ2VyaWE!5e0!3m2!1sen!2sng!4v1"
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
