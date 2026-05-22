"use client";

import { trackEvent } from "@/lib/analytics";
import { SOCIAL_LINKS } from "@/lib/constants";
import type { SocialPostPreview } from "@/types";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { ScrollRevealScale } from "@/components/motion/ScrollRevealScale";
import { ExternalLink, Instagram, Play } from "lucide-react";
import { RemoteImage } from "@/components/ui/RemoteImage";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z" />
    </svg>
  );
}

export interface SocialGalleryProps {
  instagramUrl?: string;
  tiktokUrl?: string;
  postPreview: SocialPostPreview[];
}

export function SocialGallery({
  instagramUrl = SOCIAL_LINKS.instagram,
  tiktokUrl = SOCIAL_LINKS.tiktok,
  postPreview,
}: SocialGalleryProps) {
  const instagramPosts = postPreview.filter((p) => p.platform === "instagram");
  const tiktokPosts = postPreview.filter((p) => p.platform === "tiktok");

  const trackSocial = (platform: string, id: string) => {
    trackEvent({
      eventType: platform === "instagram" ? "instagram_click" : "tiktok_click",
      element: id,
      metadata: { platform },
    });
  };

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <div>
        <h3 className="mb-4 flex items-center gap-2 font-display text-xl font-semibold text-gold-400">
          <Instagram className="h-5 w-5" />
          Instagram
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {instagramPosts.map((post, i) => (
            <ScrollRevealScale
              as="a"
              key={post.id}
              index={i}
              href={post.url || instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackSocial("instagram", post.id)}
              className="interactive-card group relative aspect-square overflow-hidden rounded-xl"
            >
              <RemoteImage src={post.image} alt={post.caption} fill className="object-cover transition-transform group-hover:scale-110" sizes="200px" />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-navy-950/80 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="line-clamp-2 text-xs text-white">{post.caption}</p>
              </div>
            </ScrollRevealScale>
          ))}
        </div>
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackSocial("instagram", "view_more")}
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold-500 hover:text-gold-400"
        >
          View More on Instagram
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div>
        <h3 className="mb-4 flex items-center gap-2 font-display text-xl font-semibold text-gold-400">
          <TikTokIcon className="h-5 w-5" />
          TikTok
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {tiktokPosts.map((post, i) => (
            <ScrollReveal
              as="article"
              key={post.id}
              index={i}
              className="interactive-card group overflow-hidden rounded-xl border border-navy-800 bg-navy-900"
            >
              <a
                href={post.url || tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackSocial("tiktok", post.id)}
                className="block"
              >
              <div className="relative aspect-[9/14]">
                <RemoteImage src={post.image} alt={post.caption} fill className="object-cover opacity-90" sizes="250px" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-500 text-navy-950 shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="h-5 w-5 fill-current" />
                  </span>
                </div>
              </div>
              <p className="p-3 text-sm text-navy-300">{post.caption}</p>
              </a>
            </ScrollReveal>
          ))}
        </div>
        <a
          href={tiktokUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackSocial("tiktok", "watch_more")}
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold-500 hover:text-gold-400"
        >
          Watch on TikTok
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
