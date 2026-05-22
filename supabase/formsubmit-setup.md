# Owner email via FormSubmit

All forms email **darboiconsults@gmail.com** using FormSubmit from the **visitor’s browser**:

`https://formsubmit.co/ajax/darboiconsults@gmail.com`

(This is the AJAX version of `https://formsubmit.co/darboiconsults@gmail.com` from their docs.)

Server requests from Vercel are **not** used (FormSubmit returns 403).

## Vercel env

```env
FORMSUBMIT_EMAIL=darboiconsults@gmail.com
```

Gmail (`GMAIL_APP_PASSWORD`) is optional — not required if you use FormSubmit only.

## Activate FormSubmit (once)

1. On the **live site**, open **Contact** and send a test message (use Chrome, not a preview iframe).
2. Check **darboiconsults@gmail.com** and **spam** for email from FormSubmit.
3. Click the **activation link** in that email.
4. After that, contact, consultation, and lead forms will deliver to your inbox.

Or: **Admin → Applications → Test owner email** (sends from your browser the same way).

## What sends when

| Form | When email sends |
|------|------------------|
| Contact | On submit (browser FormSubmit) |
| Consultation | After “I've made payment” (browser FormSubmit) |
| Lead popup | On submit (browser FormSubmit) |
| Service apply | On submit + after payment (browser FormSubmit) |

Data is always saved in the admin dashboard even if email fails.

## If email still fails

- Confirm activation link was clicked.
- Submit from the real URL `travel-tours-eight.vercel.app`, not localhost only.
- Check spam folder.
- Try **Admin → Test owner email** while logged into admin on the live site.
