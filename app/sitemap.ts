import { programs } from "@/data/programs";
import { services } from "@/data/services";
import { getSiteUrl } from "@/lib/env.server";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();

  const staticPages = ["", "/services", "/programs", "/consultation", "/announcements", "/about", "/contact", "/success"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const programPages = programs.map((p) => ({
    url: `${base}/programs/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const servicePages = services.flatMap((s) => [
    {
      url: `${base}/services/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${base}/services/${s.slug}/apply`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ]);

  return [...staticPages, ...programPages, ...servicePages];
}
