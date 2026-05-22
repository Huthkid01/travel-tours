# Owner email notifications

Applications and contact forms save to **Supabase** and email **darboiconsults@gmail.com**.

## FormSubmit URL (two formats — same service)

| Use case | URL |
|----------|-----|
| Plain HTML form in a static page | `https://formsubmit.co/darboiconsults@gmail.com` |
| Next.js / React / AJAX (this site) | `https://formsubmit.co/ajax/darboiconsults@gmail.com` |

The contact form sends from the **visitor’s browser** to the **ajax** URL (like FormSubmit’s docs for SPAs). Application forms use the **server** ajax URL after payment.

**Your email** is `darboiconsults@gmail.com` — set in `FORMSUBMIT_EMAIL` in Vercel, not `your@email.com`.

## Vercel / `.env.local`

```env
FORMSUBMIT_EMAIL=darboiconsults@gmail.com
```

**Recommended (reliable on Vercel):**

```env
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
SMTP_USER=darboiconsults@gmail.com
```

Create an App Password: Google Account → Security → 2-Step Verification → App passwords.

Optional FormSubmit AJAX key:

```env
FORMSUBMIT_ACCESS_KEY=your-access-key
```

## Activate FormSubmit (once)

1. Admin → **Applications** → **Test owner email**, or submit Contact on the live site.
2. Check **darboiconsults@gmail.com** (and spam) for FormSubmit’s **confirmation link** — click it.
3. Without activation, emails fail silently (`emailSent: false` in logs) but data still appears in Admin.

## Gmail fallback

If FormSubmit fails (common on server-side submits), the app automatically sends via Gmail when `GMAIL_APP_PASSWORD` is set.

## What sends email

| Form | Subject |
|------|---------|
| Contact | `Contact: {subject}` |
| Consultation / apply | `New application submitted: …` |
| After payment | `Payment received: …` |
| Lead popup | `New lead inquiry: …` |

Emails include applicant details and **links to uploaded files** in Supabase (files are not attached — avoids FormSubmit size limits).

## Troubleshooting

- Vercel logs: `[notifyOwnerOnApplicationSubmit]` or `[FormSubmit]`
- Admin → Applications → **Test owner email**
- Confirm `FORMSUBMIT_EMAIL` + `GMAIL_APP_PASSWORD` in Vercel Production → Redeploy
