# Voyage Elite Travel — Premium Travel & Tour Agency

A modern travel agency website built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- Luxury travel UI with dark/light mode
- Tour packages, reservations, payments (Flutterwave & Paystack demo)
- Formspree email + WhatsApp redirect workflow
- Mobile-responsive navigation
- Prices in Nigerian Naira (₦)

## Quick Start

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your details
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

1. Push this project to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your GitHub repository
4. Add environment variables from `.env.example`
5. Click **Deploy**

Vercel auto-detects Next.js. No extra config required.

### Required environment variables (Vercel)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Your live URL e.g. `https://your-app.vercel.app` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number (country code, no +) |
| `NEXT_PUBLIC_ADMIN_EMAIL` | Business email |
| `NEXT_PUBLIC_ADMIN_PHONE` | Display phone |
| `NEXT_PUBLIC_FORMSPREE_RESERVATION_ID` | Formspree form ID |
| `NEXT_PUBLIC_FORMSPREE_CONTACT_ID` | Formspree contact form ID |
| `NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY` | Flutterwave public key (optional demo) |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Paystack public key (optional demo) |

## Build locally

```bash
npm run build
npm start
```

## Tech Stack

- Next.js 15 (App Router)
- React 19 · TypeScript · Tailwind CSS v4
- Framer Motion · React Hook Form · Zod
- Formspree · Lucide Icons

## License

MIT
