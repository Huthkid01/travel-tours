# Owner email via FormSubmit (browser only)

All forms email **darboiconsults@gmail.com** using the **real FormSubmit endpoint** from the visitor’s browser:

`https://formsubmit.co/darboiconsults@gmail.com`

We use a normal HTML `<form method="POST">` in a **popup window** (top-level navigation). FormSubmit **blocks hidden iframes** (`X-Frame-Options: sameorigin`). We do **not** use `/ajax/` or `fetch()`.

**Allow popups** on `travel-tours-eight.vercel.app` when submitting a form.

Server requests from Vercel to FormSubmit are **not** used (403). Optional Gmail backup: `GMAIL_APP_PASSWORD`.

## Vercel env

```env
FORMSUBMIT_EMAIL=darboiconsults@gmail.com
NEXT_PUBLIC_FORMSUBMIT_EMAIL=darboiconsults@gmail.com
```

Optional access key (from formsubmit.co dashboard):

```env
NEXT_PUBLIC_FORMSUBMIT_ACCESS_KEY=your-key
```

Optional Gmail backup:

```env
GMAIL_APP_PASSWORD=your-16-char-app-password
SMTP_USER=darboiconsults@gmail.com
```

## Activate FormSubmit (once)

1. On the **live site**, open **Contact** and send a test message.
2. Check **darboiconsults@gmail.com** and **spam** for email from FormSubmit.
3. Click the **activation link** in that email.
4. After that, all forms can deliver to your inbox.

## What sends when

| Form | When email sends |
|------|------------------|
| Contact | On submit |
| Lead popup | On submit |
| Service / program / consultation apply | **Only** after “I've made payment” (then WhatsApp opens) |

Data is always saved in the admin dashboard even if email fails.

## Application documents in email

Emails include **links** to uploaded files in Supabase (`uploaded_documents` field). Open links in the email or use Admin → Applications.

## If email still fails

- Confirm activation link was clicked.
- Submit from `travel-tours-eight.vercel.app` (not only localhost).
- Check spam.
- Add `GMAIL_APP_PASSWORD` in Vercel for automatic backup via `/api/owner-notify`.
