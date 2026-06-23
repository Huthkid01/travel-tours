import { SITE_CONFIG } from "@/lib/constants";
import { getSiteUrl } from "@/lib/env.server";
import type { Metadata } from "next";

const siteUrl = getSiteUrl();
const defaultOgImage = `${siteUrl}/branding/logo.png`;

/** Google Search Console — HTML tag verification (public, visible in page source) */
const GOOGLE_SITE_VERIFICATION_CODE = "O0J-YJ_IRPkluzgrmCt5F6-_1gc2-MU73vtCDkzpZhQ";

const googleVerification =
  process.env.GOOGLE_SITE_VERIFICATION?.trim() || GOOGLE_SITE_VERIFICATION_CODE;

interface PageSeoOptions {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
}

export function buildPageMetadata({
  title,
  description = SITE_CONFIG.description,
  path = "",
  image = defaultOgImage,
  keywords = [],
  noIndex = false,
}: PageSeoOptions): Metadata {
  const url = `${siteUrl}${path}`;
  const fullTitle = title.includes(SITE_CONFIG.name) ? title : `${title} | ${SITE_CONFIG.name}`;

  return {
    title,
    description,
    keywords: [
      "Darboi Consults",
      "documentation Lagos",
      "travel consultation Nigeria",
      ...keywords,
    ],
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "en_NG",
      url,
      siteName: SITE_CONFIG.name,
      title: fullTitle,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: SITE_CONFIG.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
    alternates: { canonical: url },
  };
}

const base = buildPageMetadata({
  title: SITE_CONFIG.name,
  description: SITE_CONFIG.description,
  path: "/",
});

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...base,
  title: {
    default: `${SITE_CONFIG.name} | Documentation & Travel Consultation`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  ...(googleVerification ? { verification: { google: googleVerification } } : {}),
};
