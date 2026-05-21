"use client";

import { TikTokEmbed } from "@/components/media/TikTokEmbed";
import { FEATURED_VIDEO } from "@/data/featured-video";
import { SOCIAL_LINKS } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * TikTok plays in-page via embed. Optional file at public/video/featured.mp4 plays above when present.
 */
export function FeaturedVideoPlayer() {
  const [hasLocalVideo, setHasLocalVideo] = useState(false);

  useEffect(() => {
    fetch(FEATURED_VIDEO.localSrc, { method: "HEAD" })
      .then((res) => setHasLocalVideo(res.ok))
      .catch(() => setHasLocalVideo(false));
  }, []);

  return (
    <div className="mx-auto max-w-xl">
      {hasLocalVideo && (
        <div className="mb-8 overflow-hidden rounded-2xl border border-navy-200 bg-navy-950 shadow-xl dark:border-navy-800">
          <video
            className="aspect-[9/16] max-h-[min(80vh,720px)] w-full object-contain"
            controls
            playsInline
            preload="metadata"
            onPlay={() =>
              trackEvent({ eventType: "button_click", element: "featured_video_local_play" })
            }
          >
            <source src={FEATURED_VIDEO.localSrc} type="video/mp4" />
          </video>
          <p className="bg-navy-900 px-3 py-2 text-center text-xs text-navy-400">Self-hosted copy</p>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-navy-200 bg-white p-4 sm:p-6 dark:border-navy-800 dark:bg-navy-900">
        <TikTokEmbed />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <a
          href={FEATURED_VIDEO.tiktokUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent({ eventType: "tiktok_click", element: "featured_video_open_tiktok" })}
          className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-950 transition hover:bg-gold-400"
        >
          Open in TikTok
          <ExternalLink className="h-4 w-4" />
        </a>
        <a
          href={SOCIAL_LINKS.tiktok}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-navy-600 hover:text-gold-600 dark:text-navy-300"
        >
          Follow {SOCIAL_LINKS.tiktokHandle}
        </a>
      </div>
    </div>
  );
}
