# Owner email notifications

Applications and contact forms save to **Supabase** and email **darboiconsults@gmail.com**.

## Important: FormSubmit 403 from Vercel

FormSubmit **blocks** requests from Vercel/server (`403 Forbidden`). You will **not** get activation emails from **Admin → Test owner email** (server).

| Where email is sent from | Works? |
|--------------------------|--------|
| **Gmail** (`GMAIL_APP_PASSWORD` in Vercel) | Yes — use this for applications & admin test |
| **Browser** (contact form, admin browser test) | Yes — can trigger FormSubmit activation link |
| **Vercel server** → FormSubmit ajax | No (403) |

## Required for reliable email (recommended)

In **Vercel → Environment Variables** (Production):

```env
FORMSUBMIT_EMAIL=darboiconsults@gmail.com
GMAIL_APP_PASSWORD=your-google-app-password
SMTP_USER=darboiconsults@gmail.com
```

Create App Password: https://myaccount.google.com/apppasswords (needs 2-Step Verification).

**Redeploy** after adding variables.

## FormSubmit URLs (reference)

| Use case | URL |
|----------|-----|
| Plain HTML form | `https://formsubmit.co/darboiconsults@gmail.com` |
| Browser / AJAX (contact form) | `https://formsubmit.co/ajax/darboiconsults@gmail.com` |

## Activate FormSubmit (optional)

Only if you want FormSubmit in addition to Gmail:

1. On the live site, submit the **Contact** form once (from Chrome on your phone/PC).
2. Check **darboiconsults@gmail.com** for FormSubmit’s **confirmation link** and click it.

Or in Admin → Applications → **Test owner email** (tries Gmail first, then browser FormSubmit).

## What sends email

| Form | How |
|------|-----|
| Contact | Browser FormSubmit, then Gmail backup via API |
| Consultation (after payment) | Gmail server |
| Lead popup | Gmail server |
| Admin test | Gmail server, then browser FormSubmit fallback |

## Troubleshooting

- **403 FormSubmit** — expected on server; set `GMAIL_APP_PASSWORD`.
- **Admin test fails** — `GMAIL_APP_PASSWORD` missing on Vercel (not only `.env.local`).
- **No mail at all** — check spam; verify App Password; Admin → Test owner email.
