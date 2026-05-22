# Admin dashboard setup

## What Supabase SQL tables are for

| Table | Purpose |
|-------|---------|
| **applications** | Service/consultation forms — names, contact, documents, payment status |
| **visitor_activity** | Public site visits & clicks only (`/admin` is excluded). Clear via Admin → Site visits → **Clear all visit data**, or SQL: `delete from public.visitor_activity;` |
| **featured_programs** | Travel programs shown on home & `/programs` (editable in admin) |
| **announcements** | Top banner messages on the site |
| **testimonials** | Homepage “What Our Clients Say” carousel |
| **services** | All services on the site (editable in admin) |
| **payment_settings** | Bank transfer details & Paystack/Flutterwave toggles |
| **Storage `documents`** | Uploaded passport/files from application forms |

**FormSubmit email** is separate — it sends copies to your inbox immediately. Supabase stores the data permanently.

## Run SQL

1. `schema.sql` — applications + file storage  
2. `schema-v2.sql` — programs, announcements, visitor tracking  
3. `schema-v3-services.sql` — services (editable in admin)  
4. `schema-v4-payment-settings.sql` — payment methods & bank details  
5. `schema-v5-form-submissions.sql` — contact form records (dashboard counts)  
6. `schema-v6-program-flyers.sql` — **program flyer uploads** (Storage bucket `program-flyers`; uses `featured_programs` only — safe if you did not run schema-v3)  
7. `schema-v7-testimonials.sql` — client testimonials on homepage

## Environment variables (Vercel)

See **`VERCEL.md`** in the project root for the full checklist.

Minimum for admin:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
```

Get **service_role** from Supabase → Project Settings → API (server-only, never `NEXT_PUBLIC_`).

## Login

Open: **https://your-site.vercel.app/admin/login**

## What you can manage

### Sidebar — Overview
- **Dashboard** — total site visits, **total forms submitted**, services, applications

### Sidebar — Website content
- **Services** — all services (like product list): add, edit, delete, featured flag  
- **Programs** — travel programs on home & `/programs` (use **Import all site programs** if the list is empty)  
- **Announcements** — banner/ticker messages (use **Import site announcements** if the list is empty)  
- **Testimonials** — homepage client reviews (use **Import defaults** if the list is empty)  
- **Payment methods** — bank account, fee label, Paystack/Flutterwave on/off  

### Sidebar — Activity
- **Site visits** — who visited which pages  
- **Applications** — client form submissions  

### First-time services setup
1. Open **Admin → Services**  
2. Click **Import site defaults** (loads all services from the site into Supabase)  
3. Edit any service — changes go live on the public website  
