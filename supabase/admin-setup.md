# Admin dashboard setup

## What Supabase SQL tables are for

| Table | Purpose |
|-------|---------|
| **applications** | Service/consultation forms — names, contact, documents, payment status |
| **visitor_activity** | Site visits & clicks (page views, WhatsApp clicks, etc.) |
| **featured_programs** | Travel programs shown on home & `/programs` (editable in admin) |
| **announcements** | Top banner messages on the site |
| **Storage `documents`** | Uploaded passport/files from application forms |

**FormSubmit email** is separate — it sends copies to your inbox immediately. Supabase stores the data permanently.

## Run SQL

1. `schema.sql` — applications + file storage  
2. `schema-v2.sql` — programs, announcements, visitor tracking  

## Environment variables

```env
ADMIN_EMAIL=darboiconsults@gmail.com
ADMIN_PASSWORD=your-secure-password
ADMIN_SESSION_SECRET=any-long-random-string
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Get **service_role** from Supabase → Project Settings → API (keep secret; server-only).

## Login

Open: **https://your-site.vercel.app/admin/login**

## What you can manage

- **Dashboard** — total visits, visits today, applications  
- **Programs** — add/edit/delete (updates website)  
- **Announcements** — top bar messages  
- **Applications** — all form submissions  
- **Site Visits** — activity log  

**Services list** (Marriage Certificate, NDLEA, etc.) is still in `data/services.ts` — contact developer to add new services or we can move them to Supabase in a future update.
