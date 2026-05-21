/** Featured TikTok / homepage video */

export const FEATURED_VIDEO = {
  /** Share link from @darboiconsults */
  tiktokUrl:
    process.env.NEXT_PUBLIC_TIKTOK_VIDEO_URL || "https://www.tiktok.com/t/ZP8p44v1g/",
  /** Optional self-hosted file in /public/video/ */
  localSrc: process.env.NEXT_PUBLIC_FEATURED_VIDEO_SRC || "/video/featured.mp4",
  title: "Darboi Consults — Latest on TikTok",
  description: "Visa tips, job openings, and success stories from Darboi Consults Limited.",
} as const;
