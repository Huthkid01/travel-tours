import { FEATURED_VIDEO } from "@/data/featured-video";
import type { MediaShowcaseItem } from "@/types";

export const mediaShowcaseItems: MediaShowcaseItem[] = [
  {
    id: "1",
    type: "image",
    title: "Travel Consultation",
    category: "travel",
    src: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80",
  },
  {
    id: "2",
    type: "image",
    title: "Documentation Success",
    category: "documents",
    src: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80",
  },
  {
    id: "3",
    type: "image",
    title: "Client Journey",
    category: "success",
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
  },
  {
    id: "4",
    type: "video",
    title: "Travel Highlights",
    category: "travel",
    src: "https://images.unsplash.com/photo-1469854523086-cc02afe5c88d?w=600&q=80",
    externalUrl: "/#video",
  },
  {
    id: "5",
    type: "image",
    title: "Visa Preparation",
    category: "documents",
    src: "https://images.unsplash.com/photo-1436491865339-9a109c8a40d8?w=600&q=80",
  },
  {
    id: "6",
    type: "image",
    title: "Social Preview",
    category: "social",
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80",
    externalUrl: "https://instagram.com",
  },
];
