# Vercel — environment variables

Add these in **Vercel → Project → Settings → Environment Variables**.  
Use **no `NEXT_PUBLIC_` prefix** — secrets stay on the server.

After changing variables, **Redeploy**.

## Required

| Variable | Where to get it |
|----------|-----------------|
| `SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `SUPABASE_ANON_KEY` | Supabase → `anon` public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → `service_role` secret |
| `FORMSUBMIT_EMAIL` | `darboiconsults@gmail.com` |
| `GOOGLE_FORM_URL` | Your `forms.gle` link |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password |
| `ADMIN_SESSION_SECRET` | Long random string (32+ chars) |

## Recommended

| Variable | Example |
|----------|---------|
| `SITE_URL` | `https://travel-tours-eight.vercel.app` |
| `PAYSTACK_PUBLIC_KEY` | Paystack public key |
| `FLUTTERWAVE_PUBLIC_KEY` | Flutterwave public key |

## Optional

| Variable | Purpose |
|----------|---------|
| `SHOW_PRICING` | `true` to show prices on the site |
| `GA_MEASUREMENT_ID` | Google Analytics (server-only reference) |

## Remove from Vercel (old / unused)

Delete any of these if still present:

- `NEXT_PUBLIC_SUPABASE_URL` → use `SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → use `SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_FORMSUBMIT_EMAIL` → use `FORMSUBMIT_EMAIL`
- `NEXT_PUBLIC_ADMIN_EMAIL`
- `NEXT_PUBLIC_GOOGLE_FORM_URL` → use `GOOGLE_FORM_URL`
- `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` → use `PAYSTACK_PUBLIC_KEY`
- `NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY` → use `FLUTTERWAVE_PUBLIC_KEY`
- `NEXT_PUBLIC_EMAILJS_*`, `NEXT_PUBLIC_FORMSPREE_*`

## After deploy

1. Run Supabase SQL: `schema.sql` → `v2` → `v3` → `v4`
2. Submit Contact form once → activate FormSubmit email
3. Login at `/admin/login`
4. Admin → Services → Import defaults (first time)
5. Admin → Payment methods → save bank details
