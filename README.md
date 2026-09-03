# Mend Sure

Medical tourism website connecting patients from the US/UK with affordable,
high-quality treatment in India.

- `client/` — React + Vite + Tailwind CSS frontend
- `server/` — Node.js + Express API
- Database — Supabase (Postgres)

## 1. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. In your project, open the **SQL Editor**, paste in the contents of
   [server/db/schema.sql](server/db/schema.sql), and run it. This creates all
   the tables.
3. Run [server/db/seed.sql](server/db/seed.sql) the same way. This adds
   sample treatments, hospitals, doctors, and testimonials so the site isn't
   empty during development.
4. Run [server/db/auth-schema.sql](server/db/auth-schema.sql) the same way.
   This sets up patient accounts (on top of Supabase's built-in login system)
   and a private storage bucket for uploaded medical reports.
5. Run [server/db/schema-updates.sql](server/db/schema-updates.sql) the same
   way. This links enquiries to a patient's account and adds a few extra
   hospital fields (bed count, departments, photo gallery).
6. Go to **Project Settings -> API** and copy the **Project URL** and the
   **service_role** key (not the `anon` key — the server needs the
   service_role key to read/write data).

## 2. Configure and run the server

```bash
cd server
cp .env.example .env
# open .env and paste in your Supabase URL + service_role key
npm install
npm run dev
```

The API runs at `http://localhost:5000`. Check it worked:
`curl http://localhost:5000/api/treatments` should return the seeded
treatments as JSON.

## 3. Run the client

In a separate terminal:

```bash
cd client
npm install
npm run dev
```

The site runs at `http://localhost:5173`. It's already configured to talk to
the API on port 5000 during development.

## Managing content

There's no admin panel — treatments, hospitals, doctors, and testimonials are
managed directly in the Supabase dashboard (**Table Editor**), which works
like a spreadsheet. Leads submitted through the "Get a Free Quote" form land
in the `inquiries` table, where you can track their `status` (new / contacted
/ converted). If the patient was logged in when they submitted it, the row
is linked to their account (`user_id`) — if not, it's still saved as a guest
enquiry, just unlinked.

### Getting notified about new enquiries

Every new enquiry can email your team automatically, using
[Resend](https://resend.com):

1. Sign up at resend.com (free) and grab an API key.
2. Put it in `server/.env` as `RESEND_API_KEY`, along with `NOTIFY_TO_EMAIL`
   (where alerts should go) and `NOTIFY_FROM_EMAIL`.
3. Until you verify your own sending domain in Resend's dashboard, you can
   only send from their sandbox address (`onboarding@resend.dev`) and only
   to your own Resend account's email — fine for testing, not for real use.

Until `RESEND_API_KEY` is set, nothing breaks — new enquiries just get
logged to the server console instead of emailed.

### Listing filters, sorting & pagination

`GET /api/treatments`, `/api/hospitals`, and `/api/doctors` all accept
`?page=` and `?pageSize=` (default 20, max 100) — the total number of
matching rows comes back in the `X-Total-Count` response header. They also
accept:
- Treatments: `?specialty=`, `?sort=name|price_min_usd`, `?order=asc|desc`
- Hospitals: `?city=`, `?sort=name|city`, `?order=asc|desc`
- Doctors: `?hospital=`, `?specialty=`, `?sort=name|experience_years`, `?order=asc|desc`

## Patient accounts & report uploads

Patients can create an account, log in, and upload/retrieve their own
medical reports (PDF, JPG, or PNG, up to 20MB each). Files are stored
privately in Supabase Storage — only the uploading patient can access their
own files. There's no frontend for this yet (API only):

- `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/refresh`,
  `POST /api/auth/forgot-password`
- `GET /api/auth/me`, `PATCH /api/auth/me` — profile (name/phone/country)
- `POST /api/reports` (upload), `GET /api/reports` (list), `GET
  /api/reports/:id/download` (get a link to the file), `DELETE
  /api/reports/:id`
- `GET /api/inquiries/mine` — the logged-in patient's own past "get a quote"
  submissions

All of the `/api/reports`, `/api/auth/me`, and `/api/inquiries/mine` routes
require an `Authorization: Bearer <access_token>` header, using the token
returned from login/signup.

## Deploying to Vercel

The whole app — React frontend and Express API — deploys as **one Vercel
project on one domain**. That's why the client can call `fetch('/api/...')`
with no base URL and no CORS setup in production.

How it fits together:

- `vercel.json` builds the client into `client/dist` and serves it as static
  files, falling back to `index.html` for any non-`/api` path so client-side
  routes survive a hard refresh.
- `api/[...path].js` is a catch-all serverless function. Every `/api/*` request
  goes to it, and it hands the request to the same Express app used locally
  (`server/src/app.js`).
- The root `package.json` holds the API's runtime dependencies, because Vercel
  installs from the repo root and the function resolves its imports from there.

### Steps

1. In Vercel, import the GitHub repo. Leave **Root Directory** as the repo root
   — do *not* point it at `client/` or `server/`, since one project needs both.
   Framework Preset should be **Other**; `vercel.json` supplies the build.
2. Under **Settings → Environment Variables**, add the same values that are in
   `server/.env`, for the Production, Preview, and Development environments:

   | Variable | Required | Notes |
   | --- | --- | --- |
   | `SUPABASE_URL` | yes | Supabase → Settings → API |
   | `SUPABASE_SERVICE_ROLE_KEY` | yes | the `service_role` key, never the anon key |
   | `RESEND_API_KEY` | no | without it, new enquiries log instead of emailing |
   | `NOTIFY_TO_EMAIL` | no | inbox for new-enquiry alerts |
   | `NOTIFY_FROM_EMAIL` | no | must be a Resend-verified sender |

   `CLIENT_ORIGIN` and `PORT` are only for local development — leave them out.
   The API refuses to start without the two Supabase values and says so plainly
   in the function logs.
3. Deploy, then check `https://<your-domain>/api/health`. It should return
   `{"status":"ok"}`. If that works but a page doesn't, the problem is data or
   env, not deployment.

### Deployment gotchas already handled

- **`app.listen()` doesn't run on Vercel.** Route wiring lives in
  `server/src/app.js`; `server/src/index.js` only starts a listener locally.
- **`trust proxy` is on.** Requests arrive via Vercel's edge proxy, and without
  it `express-rate-limit` throws and 500s the auth and enquiry routes.
- **Report uploads are capped at 4MB**, because Vercel rejects serverless
  request bodies over 4.5MB before your code sees them. If you need larger
  files, upload straight from the browser to Supabase Storage with a signed
  upload URL, bypassing the function entirely.
- **Rate limits are per-instance.** `express-rate-limit` keeps counters in
  memory, and serverless instances come and go, so the limits are softer in
  production than locally. Move them to a shared store if that matters.

## Before You Launch

The seed data in `server/db/seed.sql` is **placeholder content** — fake
hospital names, fake doctor profiles, and fake testimonials, each marked
`is_placeholder = true`. Before going live:

- [ ] Replace placeholder hospitals with real, verified partner hospitals
- [ ] Replace placeholder doctors with real, consented doctor profiles
- [ ] Replace placeholder testimonials with real, consented patient stories
- [ ] Double-check every treatment price against current, accurate figures
- [ ] Add real `image_url` values for hospitals, doctors, treatments, and
      testimonials — cards fall back to a tinted icon panel without them
- [ ] Replace the decorative hero/section background images (hard-coded
      `lh3.googleusercontent.com` URLs at the top of `Home.jsx`,
      `Hospitals.jsx`, and `HowItWorks.jsx`) with your own hosted photos
- [ ] Delete or update any row still marked `is_placeholder = true`

## Project structure

```
client/src/
  index.css     The design system — all colors, spacing, and type tokens
                live in the @theme block. One place for any theme change.
  components/   Reusable UI pieces (Navbar, Footer, cards, forms, etc.)
  pages/        One file per route (Home, Treatments, Contact, etc.)
  lib/          Small helpers: API calls, the useApi() fetch hook, formatting

server/src/
  routes/       One file per resource (treatments, hospitals, doctors, ...)
  middleware/   requireAuth.js — checks the login token on protected routes
  lib/          pagination.js, notifyTeam.js — small shared helpers
  supabaseClient.js
  app.js        Builds and exports the Express app (shared by both entries)
  index.js      Local dev entry — starts a listener on PORT

api/
  [...path].js  Vercel serverless entry — wraps the same Express app

vercel.json     Build + routing config for the single-project deployment
package.json    Root: API runtime deps and the client build command

server/db/
  schema.sql          Creates the public content tables (treatments, hospitals, ...)
  seed.sql            Adds placeholder sample data
  auth-schema.sql     Patient accounts, profiles, reports, and the storage bucket
  schema-updates.sql  Links enquiries to accounts; extra hospital fields
```





