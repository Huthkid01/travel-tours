import { getSiteUrl } from "@/lib/env.server";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/formsubmit-ok"],
    },
    sitemap: `${base}/sitemap.xml`,
    host: new URL(base).host,
  };
}
