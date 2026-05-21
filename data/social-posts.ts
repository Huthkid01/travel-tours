import { FEATURED_VIDEO } from "@/data/featured-video";
import { SOCIAL_LINKS } from "@/lib/constants";
import type { SocialPostPreview } from "@/types";

/** TikTok previews only — Instagram/Facebook removed */
export const socialPostPreviews: SocialPostPreview[] = [
  {
    id: "tt-1",
    platform: "tiktok",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80",
    caption: "Darboi Consults — watch our latest",
    url: FEATURED_VIDEO.tiktokUrl,
  },
  {
    id: "tt-2",
    platform: "tiktok",
    image: "https://images.unsplash.com/photo-1519832979-6fa567a88e4a?w=400&q=80",
    caption: "Visa & travel opportunities",
    url: SOCIAL_LINKS.tiktok,
  },
];
