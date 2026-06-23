import { programs } from "@/data/programs";
import { services } from "@/data/services";
import { getSiteUrl } from "@/lib/env.server";
import type { MetadataRoute } from "next";

/** Public pages only — admin and API routes are excluded via robots.txt */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const staticPageDefs: {
    path: string;
    priority: number;
    changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/services", priority: 0.9, changeFrequency: "weekly" },
    { path: "/programs", priority: 0.9, changeFrequency: "weekly" },
    { path: "/consultation", priority: 0.85, changeFrequency: "weekly" },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
    { path: "/announcements", priority: 0.7, changeFrequency: "weekly" },
    { path: "/success", priority: 0.3, changeFrequency: "yearly" },
  ];

  const staticPages: MetadataRoute.Sitemap = staticPageDefs.map(({ path, priority, changeFrequency }) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  const programPages = programs.map((p) => ({
    url: `${base}/programs/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const servicePages = services.flatMap((s) => [
    {
      url: `${base}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${base}/services/${s.slug}/apply`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    },
  ]);

  return [...staticPages, ...programPages, ...servicePages];
}
