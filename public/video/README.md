# Site videos

Optional self-hosted videos for the homepage player.

## Featured video (optional)

Save your exported TikTok or promo clip as:

```
featured.mp4
```

The site will try to play this file first. If it is missing, the TikTok embed from your share link is shown instead.

## Supported formats

- `.mp4` (recommended)
- `.webm`

Recommended: 1080×1920 (9:16) or 720×1280, under 50 MB for fast loading.

## TikTok link

The live TikTok video is configured in `data/featured-video.ts` and `NEXT_PUBLIC_TIKTOK_VIDEO_URL` in `.env`.
