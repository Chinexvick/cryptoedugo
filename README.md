# CrypEduGo

Crypto & blockchain education platform. Two separate static front-ends sharing one Supabase backend.

```
public-site/   → the student-facing website (deploy publicly)
admin/         → the admin dashboard (deploy to its own private URL)
```

Both are plain static HTML/CSS/JS. **No build step, no dependencies.**

---

## Deploying to Vercel

Create **two separate Vercel projects** from this one repository.

### 1. Public site

| Setting | Value |
|---|---|
| Root Directory | `public-site` |
| Framework Preset | **Other** |
| Build Command | *(leave empty)* |
| Output Directory | *(leave empty)* |

Attach your main domain here (e.g. `crypedugo.com`).

### 2. Admin dashboard

| Setting | Value |
|---|---|
| Root Directory | `admin` |
| Framework Preset | **Other** |
| Build Command | *(leave empty)* |
| Output Directory | *(leave empty)* |

Use a separate domain or subdomain (e.g. `admin.crypedugo.com`). The admin app is
set to `noindex` and `Disallow: /` so it never appears in search results.

> **Important:** do not point both projects at the repository root — each project
> must use its own Root Directory, or the wrong `index.html` will be served.

---

## One config value to set

In `admin/assets/js/admin-config.js`, set the public site URL:

```js
window.PUBLIC_SITE_URL = 'https://your-public-domain.com';
```

This only affects the "View live site" link inside the admin.

---

## Backend

Supabase provides the database, auth, storage and Edge Functions. It is already
configured and live — nothing in this repo needs to change to connect to it.

- Row Level Security is enabled on every table
- Payment secrets live in Supabase Vault, readable only by Edge Functions
- Two Edge Functions handle payments: `flutterwave-checkout` and `flutterwave-webhook`

The Supabase publishable key in `assets/js/supabase-client.js` is **safe to commit**.
It is designed for browser use; access is enforced server-side by Row Level Security.

**Never commit** the Supabase service-role key or any Flutterwave secret key.
Neither appears anywhere in this repository.

---

## Admin access

The admin dashboard lives at the root of the admin deployment (`/`).
Only accounts with `role = 'admin'` in the `profiles` table can sign in;
everyone else is rejected with a deliberately generic error.

To add another admin: **Admin → Settings → Team → Invite teammate**.

---

## Post-deploy checklist

- [ ] Set `PUBLIC_SITE_URL` in `admin/assets/js/admin-config.js`
- [ ] In Supabase → Authentication → URL Configuration, set **Site URL** to the
      public domain and add `https://your-domain.com/**` to Redirect URLs
      (otherwise email confirmation links break)
- [ ] Confirm the Flutterwave webhook points at the `flutterwave-webhook` function URL
- [ ] Run one real test purchase end to end
