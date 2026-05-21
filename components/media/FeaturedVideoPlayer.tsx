"use client";

import { FEATURED_VIDEO } from "@/data/featured-video";
import { SOCIAL_LINKS } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import { ExternalLink } from "lucide-react";
import { useCallback, useRef, useState } from "react";

/** Self-hosted MP4 — first frame visible; no HEAD check (reliable on Vercel) */
export function FeaturedVideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const src = FEATURED_VIDEO.localSrc;

  const showFirstFrame = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.readyState < 1) return;
    try {
      if (video.currentTime < 0.05) {
        video.currentTime = 0.01;
      }
    } catch {
      /* some browsers block seek before enough data */
    }
  }, []);

  return (
    <div className="mx-auto w-full max-w-sm sm:max-w-md">
      <div className="overflow-hidden rounded-2xl border border-navy-200 bg-navy-950 shadow-xl dark:border-navy-800">
        {!videoError ? (
          <video
            ref={videoRef}
            key={src}
            className="aspect-[9/16] max-h-[min(70vh,420px)] w-full bg-navy-900 object-contain sm:max-h-[480px]"
            playsInline
            preload="auto"
            controls
            controlsList="nodownload"
            poster="/branding/logo.png"
            onLoadedMetadata={showFirstFrame}
            onLoadedData={showFirstFrame}
            onError={() => setVideoError(true)}
            onPlay={() => trackEvent({ eventType: "button_click", element: "featured_video_play" })}
          >
            <source src={src} type="video/mp4" />
            Your browser does not support video playback.
          </video>
        ) : (
          <div className="flex aspect-[9/16] max-h-[min(70vh,420px)] flex-col items-center justify-center gap-3 bg-navy-900 p-6 text-center sm:max-h-[480px]">
            <p className="text-sm text-navy-300">
              Video could not load. Ensure{" "}
              <code className="text-gold-400">public/video/featured.mp4</code> is deployed, or watch on
              TikTok.
            </p>
            <a
              href={FEATURED_VIDEO.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-500 hover:underline"
            >
              Watch on TikTok
            </a>
          </div>
        )}
        <p className="px-3 py-2 text-center text-xs text-navy-400">
          Tap the play button on the video to watch
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <a
          href={FEATURED_VIDEO.tiktokUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent({ eventType: "tiktok_click", element: "featured_video_tiktok" })}
          className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 px-4 py-2 text-sm font-medium text-gold-600 transition hover:bg-gold-500/10"
        >
          Also on TikTok
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
        <a
          href={SOCIAL_LINKS.tiktok}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-navy-500 hover:text-gold-600 dark:text-navy-400"
        >
          {SOCIAL_LINKS.tiktokHandle}
        </a>
      </div>
    </div>
  );
}
