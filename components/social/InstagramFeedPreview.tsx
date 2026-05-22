"use client";

import { SOCIAL_LINKS } from "@/lib/constants";
import { useLeadTrackerContext } from "@/components/providers/LeadTrackerProvider";
import { ScrollRevealScale } from "@/components/motion/ScrollRevealScale";
import { ExternalLink, Instagram } from "lucide-react";
import { RemoteImage } from "@/components/ui/RemoteImage";

const previewPosts = [
  { id: "1", image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80", alt: "Travel consultation" },
  { id: "2", image: "https://images.unsplash.com/photo-1436491865339-9a109c8a40d8?w=400&q=80", alt: "Documentation services" },
  { id: "3", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80", alt: "Client success" },
  { id: "4", image: "https://images.unsplash.com/photo-1469854523086-cc02afe5c88d?w=400&q=80", alt: "Travel programs" },
];

export function InstagramFeedPreview() {
  const track = useLeadTrackerContext();

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {previewPosts.map((post, i) => (
          <ScrollRevealScale
            as="a"
            key={post.id}
            index={i}
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track({ actionType: "social_click", service: "instagram", source: "feed_preview" })}
            className="interactive-card group relative aspect-square overflow-hidden rounded-xl"
          >
            <RemoteImage src={post.image} alt={post.alt} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="200px" />
            <div className="absolute inset-0 flex items-center justify-center bg-navy-950/0 transition-colors group-hover:bg-navy-950/40">
              <Instagram className="h-8 w-8 text-white opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </ScrollRevealScale>
        ))}
      </div>
      <a
        href={SOCIAL_LINKS.instagram}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track({ actionType: "social_click", service: "instagram", source: "view_more" })}
        className="mt-6 inline-flex items-center gap-2 font-semibold text-gold-500 transition-colors hover:text-gold-400"
      >
        <Instagram className="h-5 w-5" />
        View More on Instagram
        <ExternalLink className="h-4 w-4" />
      </a>
      <p className="mt-2 text-sm text-navy-500">{SOCIAL_LINKS.instagramHandle}</p>
    </div>
  );
}
