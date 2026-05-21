# Supabase Storage Setup

## 1. Create bucket

In Supabase Dashboard → **Storage** → **New bucket**:

| Setting | Value |
|---------|-------|
| Name | `documents` |
| Public | **No** (private) |

Or run the SQL in `schema.sql` which creates the bucket automatically.

## 2. Folder structure

Files are uploaded to:

```
documents/{service-slug}/{application-id}/{filename}
```

Example:

```
documents/marriage-certificate/a1b2c3d4-.../passport.jpg
```

## 3. Environment variables

Add to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 4. CORS (if needed)

Supabase Storage allows uploads from your site domain by default when using the anon key from the browser.

## 5. Demo mode

Without env variables, the portal runs in **demo mode**: applications are stored in `sessionStorage` and uploads are simulated with local object URLs.
