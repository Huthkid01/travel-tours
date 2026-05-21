# Da Boi Consults Limited — Business Portal

Premium multi-service documentation and travel consultation portal.

**Address:** 24, Olowu Street, Ikeja, Lagos, Nigeria

## Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion
- **Forms:** React Hook Form + Zod
- **Database & Storage:** Supabase
- **Email:** EmailJS
- **Payments:** Paystack & Flutterwave (demo keys included)

## Features

- 16 professional services with search & category filters
- Dynamic application forms with drag-and-drop document upload
- Supabase Storage (`documents/{service}/{application-id}/`)
- Automatic email notifications to admin (EmailJS)
- Paystack / Flutterwave payments (booking fee, deposit, full)
- WhatsApp redirect after successful submission
- Dark mode, SEO, floating WhatsApp, sticky navbar

## Demo Mode

Works without environment variables:

- Applications stored in `sessionStorage`
- Email logged to console
- Payment shows demo alerts

## Setup

```bash
npm install
npm run dev
```

### Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL Editor
3. Add env vars from `.env.example`

### EmailJS

1. Create templates per `supabase/emailjs-template.md`
2. Add service ID, template IDs, and public key to `.env.local`

### Payments

Replace demo keys with live Paystack/Flutterwave public keys.

## Client logo

Add files to **`public/branding/`** (see `public/branding/README.md`):

- `logo.png` — main logo (recommended)
- Optional: `logo-light.png`, `logo-dark.png` for different navbar backgrounds

## Project Structure

```
public/branding/  Client logo files (PNG/SVG)
app/              Pages (home, services, apply, payment, success, about, contact)
components/       UI, forms, upload, payment, layout
data/             Services, FAQs, testimonials, stats
lib/              Constants, validations, utils
services/         Supabase applications, storage, email, payment
supabase/         SQL schema, setup guides
types/            TypeScript interfaces
```

## Flow

1. User selects a service → `/services/[slug]`
2. Applies → form + document upload
3. Pays → Paystack or Flutterwave
4. Data saved to Supabase → EmailJS notification → WhatsApp redirect

No admin dashboard — fully automated client-facing portal.
