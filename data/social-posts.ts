import { SOCIAL_LINKS } from "@/lib/constants";
import type { SocialPostPreview } from "@/types";

export const socialPostPreviews: SocialPostPreview[] = [
  {
    id: "ig-1",
    platform: "instagram",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80",
    caption: "Professional travel consultation",
    url: SOCIAL_LINKS.instagram,
  },
  {
    id: "ig-2",
    platform: "instagram",
    image: "https://images.unsplash.com/photo-1436491865339-9a109c8a40d8?w=400&q=80",
    caption: "Visa documentation tips",
    url: SOCIAL_LINKS.instagram,
  },
  {
    id: "ig-3",
    platform: "instagram",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80",
    caption: "Client success stories",
    url: SOCIAL_LINKS.instagram,
  },
  {
    id: "tt-1",
    platform: "tiktok",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80",
    caption: "Proof of funds guide",
    url: SOCIAL_LINKS.tiktok,
  },
  {
    id: "tt-2",
    platform: "tiktok",
    image: "https://images.unsplash.com/photo-1519832979-6fa567a88e4a?w=400&q=80",
    caption: "Canada travel tips",
    url: SOCIAL_LINKS.tiktok,
  },
];
