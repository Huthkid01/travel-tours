# FormSubmit (owner email notifications)

All main site forms send a copy to **darboiconsults@gmail.com** via [FormSubmit](https://formsubmit.co). Data is also saved in **Supabase** where applicable.

## Vercel / `.env.local`

```env
FORMSUBMIT_EMAIL=darboiconsults@gmail.com
```

Optional (if FormSubmit gives you an access key for AJAX):

```env
FORMSUBMIT_ACCESS_KEY=your-access-key
```

## First-time activation (required once)

1. Submit the **Contact** form once on the live site (or any application form).
2. FormSubmit emails you a **confirmation link** — click it so future messages are delivered.
3. Add the same `FORMSUBMIT_EMAIL` in **Vercel → Settings → Environment Variables** (Production).

## What sends email to the owner

| Form | FormSubmit subject | Also saved in Supabase |
|------|-------------------|------------------------|
| **Contact** page | `Contact: {subject}` | `contact_submissions` |
| **Consultation** (general) | `New application submitted: …` | `applications` |
| **Consultation** (program `?program=`) | `New application submitted: …` | `applications` |
| **Service apply** (`/services/.../apply`) | `New application submitted: …` | `applications` |
| **After bank payment** (Done) | `Payment received: …` | `applications` (updated) |
| **Lead popup** (“Stay Connected”) | `New lead inquiry: …` | `leads` |

Application emails include: name, email, phone, country, address, purpose, notes, application ID, file links (and file attachments when uploaded).

## Consultation form flow

1. User clicks **Submit** → saved to Supabase.
2. `notifyOwnerOnApplicationSubmit` → FormSubmit email to owner.
3. Success toast → WhatsApp opens (even if email fails; form data is still in Supabase).

If email fails, check Vercel logs for `[notifyOwnerOnApplicationSubmit]` and confirm FormSubmit is activated.

## Google Form embed

The embedded Google Form on Home/Contact is separate — responses go to Google, not FormSubmit. Use the on-site consultation/application forms for FormSubmit + Supabase.
