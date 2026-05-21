"use client";

import { FEATURED_VIDEO } from "@/data/featured-video";
import { SOCIAL_LINKS } from "@/lib/constants";
import Script from "next/script";
import { useEffect, useId } from "react";

interface TikTokEmbedProps {
  url?: string;
  className?: string;
}

/** Official TikTok embed — plays in-page without leaving the site */
export function TikTokEmbed({ url = FEATURED_VIDEO.tiktokUrl, className }: TikTokEmbedProps) {
  const embedId = useId().replace(/:/g, "");

  useEffect(() => {
    const win = window as Window & { tiktokEmbed?: { lib?: { render: () => void } } };
    win.tiktokEmbed?.lib?.render?.();
  }, [url]);

  return (
    <div className={className}>
      <blockquote
        className="tiktok-embed mx-auto"
        cite={url}
        data-video-id={embedId}
        style={{ maxWidth: "605px", minWidth: "325px" }}
      >
        <section>
          <a target="_blank" rel="noopener noreferrer" href={url}>
            View on TikTok
          </a>
        </section>
      </blockquote>
      <Script src="https://www.tiktok.com/embed.js" strategy="lazyOnload" />
      <p className="mt-4 text-center text-sm text-navy-500 dark:text-navy-400">
        Video hosted by{" "}
        <a
          href={SOCIAL_LINKS.tiktok}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-gold-600 hover:underline"
        >
          {SOCIAL_LINKS.tiktokHandle}
        </a>
      </p>
    </div>
  );
}
