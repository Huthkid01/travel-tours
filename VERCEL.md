# Deploy to Vercel (Client Demo — No Env Variables)

You can deploy **without adding any environment variables**. The site uses built-in demo defaults.

## Steps

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New Project**
3. Import: `Huthkid01/travel-tours`
4. Leave all settings as default (Vercel detects Next.js automatically)
5. **Environment Variables:** skip — leave empty
6. Click **Deploy**

Wait ~2 minutes. Your live URL will look like: `https://travel-tours-xxx.vercel.app`

## What works in demo mode (no env)

| Feature | Demo behavior |
|---------|----------------|
| All pages | Full navigation works |
| Tour packages | All 6 tours + detail pages |
| Prices | Nigerian Naira (₦) |
| Reservation form | Shows success, then opens WhatsApp |
| Contact form | Shows success message |
| Payments | Demo popup (no real charge) |
| Dark mode | Works |
| Images | Load from Unsplash |

## Vercel settings (confirm these)

| Setting | Value |
|---------|--------|
| Framework Preset | **Next.js** |
| Root Directory | `.` (leave blank) |
| Build Command | `npm run build` |
| Output Directory | *(leave default)* |
| Install Command | `npm install` |
| Node.js Version | 20.x (default) |

## Optional — add later for production

Only add these when the client goes live:

- `NEXT_PUBLIC_WHATSAPP_NUMBER` — real WhatsApp
- `NEXT_PUBLIC_FORMSPREE_RESERVATION_ID` — real emails
- `NEXT_PUBLIC_FORMSPREE_CONTACT_ID`
- `NEXT_PUBLIC_SITE_URL` — your custom domain
- Payment keys for Flutterwave / Paystack

## Redeploy after GitHub push

Every push to `main` auto-deploys on Vercel if connected.
