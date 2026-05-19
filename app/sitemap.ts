import { SITE_CONFIG } from "@/lib/constants";
import { tours } from "@/data/tours";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_CONFIG.url;

  const staticPages = ["", "/about", "/tours", "/reservation", "/payment", "/contact"].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })
  );

  const tourPages = tours.map((tour) => ({
    url: `${base}/tour/${tour.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...tourPages];
}
