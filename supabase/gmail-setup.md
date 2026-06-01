# Owner email via Gmail (Nodemailer)

All forms send email through your server using **Gmail SMTP**:

| Variable | Example | Role |
|----------|---------|------|
| `SMTP_USER` | `darboiconsults717@gmail.com` | Sends the email |
| `GMAIL_APP_PASSWORD` | 16-char app password | Auth for sender |
| `OWNER_INBOX_EMAIL` | `darboiconsults@gmail.com` | Receives form notifications |

Create an app password: https://myaccount.google.com/apppasswords (for the **sender** account).

Add all three in **Vercel → Environment Variables → Production**, then redeploy.

## What sends when

| Form | When |
|------|------|
| Contact | On submit |
| Lead popup | On submit |
| Application / consultation | After “I've made payment” |

## Application attachments

When a user pays, the owner email includes **attached files** (images/PDFs uploaded with the application), downloaded from Supabase storage. Links are also listed in the email body.

Limits: up to 10 files, ~20 MB total (Gmail limit).

## Local development

Copy `.env.example` to `.env.local` and fill in the same values. Never commit real passwords to GitHub.
