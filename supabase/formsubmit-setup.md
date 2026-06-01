# Owner email via FormSubmit

All forms email **darboiconsults@gmail.com**.

**Recommended on Vercel:** Gmail SMTP via `GMAIL_APP_PASSWORD` (same-origin `/api/owner-notify` — no CORS issues).

**Optional:** FormSubmit from the browser (hidden form POST if `fetch` to `/ajax/` is blocked by CORS or error 521).

## Vercel env

```env
FORMSUBMIT_EMAIL=darboiconsults@gmail.com
NEXT_PUBLIC_FORMSUBMIT_EMAIL=darboiconsults@gmail.com
```

**Required for reliable email on Vercel** (create at https://myaccount.google.com/apppasswords):

```env
GMAIL_APP_PASSWORD=your-16-char-app-password
SMTP_USER=darboiconsults@gmail.com
```

## Activate FormSubmit (once)

1. On the **live site**, open **Contact** and send a test message (use Chrome, not a preview iframe).
2. Check **darboiconsults@gmail.com** and **spam** for email from FormSubmit.
3. Click the **activation link** in that email.
4. After that, contact, consultation, and lead forms will deliver to your inbox.

## What sends when

| Form | When email sends |
|------|------------------|
| Contact | On submit (browser FormSubmit) |
| Lead popup | On submit (browser FormSubmit) |
| Service / program / consultation apply | **Only** after “I've made payment” (then WhatsApp opens) |

Data is always saved in the admin dashboard even if email fails.

## Application documents in email

Application and consultation forms **attach uploaded files** to the FormSubmit email (same as a normal HTML file upload), not only Supabase links. Gmail shows them under **attachments** — open or preview images/PDFs there.

If an attachment is missing, check FormSubmit size limits (~5MB per file) and confirm files uploaded successfully in Admin → Applications.

## If email still fails

- Confirm activation link was clicked.
- Submit from the real URL `travel-tours-eight.vercel.app`, not localhost only.
- Check spam folder.
- Submit the **Contact** form on the live site once to activate FormSubmit.
- If you see an error toast on submit, add `GMAIL_APP_PASSWORD` in Vercel and redeploy (backup email via `/api/owner-notify`).
- Past rows in Admin → Applications were saved to the database even when email failed; they are not resent automatically.
