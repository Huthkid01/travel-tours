"use client";

import { SITE_CONFIG } from "@/lib/constants";
import { MapPin } from "lucide-react";
import { useState } from "react";

const { lat, lng } = SITE_CONFIG.mapCenter;

/** Lightweight static preview — shows instantly while Google iframe loads */
const STATIC_MAP_URL = `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=16&size=640x320&maptype=mapnik&markers=${lat},${lng},red-pushpin`;

export function MapEmbed() {
  const [previewReady, setPreviewReady] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);

  return (
    <div className="relative h-[320px] w-full overflow-hidden rounded-2xl border border-navy-100 shadow-lg dark:border-navy-800">
      {/* Lightweight preview — visible in ~1s while Google iframe loads */}
      <img
        src={STATIC_MAP_URL}
        alt="Map showing Darboi Consults office location in Ikeja, Lagos"
        width={640}
        height={320}
        decoding="async"
        fetchPriority="high"
        onLoad={() => setPreviewReady(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
          iframeReady ? "opacity-0" : "opacity-100"
        }`}
      />

      {!previewReady && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-navy-100 dark:bg-navy-800"
          aria-hidden
        >
          <div className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-navy-800 shadow-md dark:bg-navy-900/95 dark:text-navy-100">
            <MapPin className="h-4 w-4 animate-pulse text-gold-500" />
            Loading map…
          </div>
        </div>
      )}

      <iframe
        title={`${SITE_CONFIG.name} location`}
        src={SITE_CONFIG.mapEmbedUrl}
        width="100%"
        height="320"
        style={{ border: 0 }}
        allowFullScreen
        loading="eager"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setIframeReady(true)}
        className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${
          iframeReady ? "opacity-100" : "opacity-0"
        }`}
      />

      <a
        href={SITE_CONFIG.mapOpenUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-3 bottom-3 z-10 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-semibold text-navy-900 shadow-md hover:bg-white dark:bg-navy-900/95 dark:text-white"
      >
        Open in Google Maps
      </a>
    </div>
  );
}
