# Darboi Consults Limited — Business Portal

Premium multi-service documentation and travel consultation portal.

**Address:** Head Office, 24 Olowu Road, Ikeja, Lagos, Nigeria  
**Phone / WhatsApp:** 08038178843  
**Email:** darboiconsults@gmail.com  
**Live site:** [travel-tours-eight.vercel.app](https://travel-tours-eight.vercel.app)

## Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion
- **Forms:** React Hook Form + Zod
- **Database & storage:** Supabase (applications, CMS content, document uploads)
- **Owner email:** [FormSubmit](https://formsubmit.co) (browser AJAX — see `supabase/formsubmit-setup.md`)
- **Payments:** Bank transfer (primary flow) · optional Paystack / Flutterwave keys
- **Admin:** Password-protected dashboard at `/admin`

## Features

### Public site

- Homepage hero with one-time welcome loading animation (first visit per browser)
- 16+ services with search and category filters
- Travel programs with flyer images
- Dynamic application and consultation forms with document upload
- Bank transfer payment step → WhatsApp redirect after payment
- Contact form, lead popup, announcements ticker, testimonials carousel
- Dark mode, SEO, floating WhatsApp, sticky navbar

### Admin dashboard (`/admin`)

- **Dashboard** — visits, applications, and quick links
- **Services** — add, edit, publish, import site defaults
- **Programs** — featured programs and flyer uploads
- **Announcements** — banner and ticker messages
- **Testimonials** — homepage carousel reviews
- **Applications** — view submissions and test owner email (FormSubmit)
- **Payment settings** — booking fee and bank details
- **Site visits** — visitor activity log

## Application flow

1. User selects a service or program → applies online
2. Completes the form and uploads documents
3. Makes payment by **bank transfer** (details shown in the form)
4. After confirming payment → **redirected to WhatsApp** with application details
5. Data saved to the database; owner notified by **FormSubmit email** (from the visitor’s browser)

## Setup

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

### Environment variables

Copy `.env.example` to `.env.local`. For production, add the same keys in **Vercel** — see `VERCEL.md`.

| Variable | Purpose |
|----------|---------|
| `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Database, storage, admin API |
| `FORMSUBMIT_EMAIL` | Owner inbox for form notifications |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` | Admin login |
| `SITE_URL` | Canonical site URL |
| `PAYSTACK_PUBLIC_KEY`, `FLUTTERWAVE_PUBLIC_KEY` | Optional card/checkout keys |

### Database

1. Create a project at [supabase.com](https://supabase.com)
2. Run SQL in order: `supabase/schema.sql` → `schema-v2` … → `schema-v7-testimonials.sql`
3. Configure storage per `supabase/storage-setup.md`
4. Admin setup: `supabase/admin-setup.md`

### FormSubmit (owner email)

1. Set `FORMSUBMIT_EMAIL=darboiconsults@gmail.com` in `.env.local` and Vercel
2. On the **live site**, submit the Contact form once and click FormSubmit’s activation link in the inbox
3. Details: `supabase/formsubmit-setup.md`

Optional: `GMAIL_APP_PASSWORD` for server-side email fallback (not required if FormSubmit is activated).

### Demo mode

Without Supabase configured, the site still runs with limited persistence (e.g. session-based fallbacks). Configure env vars for full production behaviour.

## Client logo

Add files to **`public/branding/`** (see `public/branding/README.md`):

- `logo.png` — main logo (recommended)
- Optional: `logo-light.png`, `logo-dark.png` for different navbar backgrounds

## Project structure

```
app/              Pages (home, services, programs, apply, admin, contact, …)
app/admin/        Admin dashboard (services, programs, applications, …)
app/api/          REST routes (applications, contact, admin CRUD, …)
components/       UI, forms, payment, layout, admin modals
data/             Services, FAQs, testimonials, stats (seed / fallback)
lib/              Constants, validations, FormSubmit client, WhatsApp helpers
services/         Server-side data, storage, email, CMS
supabase/         SQL schemas and setup guides
types/            TypeScript interfaces
public/branding/  Client logo assets
```

## Deploy

Push to `main` on GitHub; Vercel deploys automatically if the repo is connected. Full deploy checklist: `VERCEL.md`.

## License

Private — Darboi Consults Limited.
