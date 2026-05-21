"use client";

import { FEATURED_VIDEO } from "@/data/featured-video";
import { SOCIAL_LINKS } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import { ExternalLink, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Self-hosted video with play/pause controls. Falls back to TikTok link only if file missing.
 */
export function FeaturedVideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasLocalVideo, setHasLocalVideo] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetch(FEATURED_VIDEO.localSrc, { method: "HEAD" })
      .then((res) => setHasLocalVideo(res.ok))
      .catch(() => setHasLocalVideo(false));
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setIsPlaying(true);
      trackEvent({ eventType: "button_click", element: "featured_video_play" });
    } else {
      video.pause();
      setIsPlaying(false);
      trackEvent({ eventType: "button_click", element: "featured_video_pause" });
    }
  };

  if (!hasLocalVideo) {
    return (
      <div className="mx-auto max-w-md text-center">
        <p className="text-navy-600 dark:text-navy-300">
          Video file not found. Add <code className="text-gold-600">public/video/featured.mp4</code>
        </p>
        <a
          href={FEATURED_VIDEO.tiktokUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-gold-600 hover:underline"
        >
          Watch on TikTok
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-sm sm:max-w-md">
      <div className="overflow-hidden rounded-2xl border border-navy-200 bg-navy-950 shadow-xl dark:border-navy-800">
        <div className="relative bg-navy-950">
          <video
            ref={videoRef}
            className="mx-auto max-h-[min(50vh,320px)] w-full object-contain sm:max-h-[400px]"
            playsInline
            preload="metadata"
            controls
            controlsList="nodownload"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          >
            <source src={FEATURED_VIDEO.localSrc} type="video/mp4" />
            Your browser does not support video playback.
          </video>
          <button
            type="button"
            onClick={togglePlay}
            className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-navy-950/85 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/20 backdrop-blur-sm transition hover:bg-gold-500 hover:text-navy-950 sm:hidden"
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>
        <p className="px-3 py-2 text-center text-xs text-navy-400">
          Tap play to watch · Use controls to pause
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
