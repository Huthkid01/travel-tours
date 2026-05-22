# FormSubmit (replaces EmailJS)

Contact and application emails go to **darboiconsults@gmail.com** via [FormSubmit](https://formsubmit.co).

## Vercel / `.env.local`

```env
FORMSUBMIT_EMAIL=darboiconsults@gmail.com
```

## First-time activation

1. Submit the **Contact** form once on the live site (or send a test from the dashboard).
2. FormSubmit emails you a confirmation link — click it so future messages are delivered.

## What sends email

| Action | Function |
|--------|----------|
| Contact page | `sendContactForm` |
| After payment | `sendApplicationForm` (includes Supabase file links) |

Uploaded files are linked in the email body (from Supabase storage), not attached unless you pass `files` in options.

## Google Form

Set `GOOGLE_FORM_URL` to your `forms.gle` link. The form embeds on Home and Contact automatically.
