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

### The doctor directory: designation, department, hospital & experience

`server/db/doctors.json` is the source of truth for the doctor directory —
`npm run load:doctors` upserts it into Supabase, matched on slug, so editing
the file and re-running the script is how the directory is corrected.

Running it needs `server/db/doctors-schema.sql` applied first, in the Supabase
SQL editor — it adds `designation`, `department`, `hospital_name` and
`is_priority`, none of which exist on a database created from `schema.sql`
alone. Until that migration runs, `load:doctors` still loads everything else
(name, specialty, hospital link, bio, experience) and says so plainly; the
listing works, just without job titles, the hospital-as-text fallback, or
featured sorting.

**Where the bios and experience figures came from.** The source spreadsheet
(`images/hospital/Doctors list Top.xlsx`) gives each doctor's name,
designation, department, hospital and specialty — not their years of
experience or a biography, which is what a patient actually reads before
choosing a specialist. Neither can be guessed, so both were researched
individually against each doctor's own hospital profile page. Seven doctors'
profile pages state no single experience figure (conflicting figures across
aggregator sites, or a career history implying a range rather than a number);
those are left without `experience_years` rather than estimated, and their
cards simply omit the "+ years" badge.

Two doctors' current online profiles place them at a different hospital than
the spreadsheet does (Dr. Harit Kumar Chaturvedi — Max Healthcare, not
Indraprastha Apollo; Dr. Saurabh Pokhriyal — Max Super Speciality Hospital, not
BLK-Max). The spreadsheet's hospital was kept in both cases, on the view that
it reflects where they see Mend Sure's patients specifically — worth
confirming directly if that matters for referrals.

### Listing filters, sorting & pagination

`GET /api/treatments`, `/api/hospitals`, and `/api/doctors` all accept
`?page=` and `?pageSize=` (default 20, max 100) — the total number of
matching rows comes back in the `X-Total-Count` response header. They also
accept:
- Treatments: `?specialty=`, `?sort=name|price_min_usd`, `?order=asc|desc`
- Hospitals: `?city=`, `?sort=name|city`, `?order=asc|desc`
- Doctors: `?hospital=`, `?specialty=`, `?sort=name|experience_years`, `?order=asc|desc`

## Patient accounts (Clerk)

Signing up, logging in, verifying the email address and ending a session are
all handled by [Clerk](https://clerk.com). **No password exists anywhere in
this system** — a patient types their email, Clerk emails a six-digit code, and
that code is the whole of authentication. Nothing to forget, no reset flow, and
no credential for this codebase to store or leak.

There is no separate sign-up. An address Clerk has never seen gets an account
instead of a session, which is why the first button says "Continue" rather than
either. It is all one page, `/login`.

### The two keys

| Variable | Where it goes | Notes |
| --- | --- | --- |
| `VITE_CLERK_PUBLISHABLE_KEY` | Vercel **and** `client/.env.local` | Public. Vite inlines it into the bundle at build time, so it must be present wherever the build runs — setting it only at runtime does nothing. |
| `CLERK_SECRET_KEY` | Vercel **and** `server/.env` | Server-side only. Never commit it and never expose it to the browser. |

Both are in the Clerk dashboard under **API Keys**. Copy `client/.env.example`
to `client/.env.local` for local development; both files are gitignored.

**The keys that ship in a fresh Clerk project are `pk_test_`/`sk_test_`, which
belong to Clerk's *development* instance.** That instance is meant for
localhost and preview builds: it carries a user cap and shows development
banners. Before real patients use `www.mendsure.com`, create a production
instance in Clerk, point it at that domain, and replace both variables with the
`pk_live_`/`sk_live_` pair.

**Environment variables only apply to builds made after they were set**, so
redeploy after changing either one.

### What happens if a key is missing

Deliberately, not much — and never a blank site.

- **No publishable key:** the app mounts without `ClerkProvider`, everyone is
  treated as logged out, and `/login` says accounts are unavailable and points
  at the enquiry form. Every public page still works.
- **No secret key:** `/api/health` answers `200` with `"accounts":
  "unavailable"` and names the variable, and the logged-in routes answer `503`.
  They deliberately do **not** answer `401` — that would log the patient out
  and bounce them to a login page that signs them straight back in, a loop with
  nothing in it naming the cause. The public content routes are untouched,
  because the treatment, hospital and doctor listings do not care who is
  asking.

### How a request is authorised

The browser asks Clerk for a session token and sends it as
`Authorization: Bearer <token>`. `server/src/middleware/requireAuth.js` verifies
it (`server/src/lib/verifyToken.js`) and attaches the Clerk user id as
`req.userId`; every profile, report and enquiry query is filtered by it.

Verification is local — Clerk signs tokens with a key pair and the public half
is fetched once and cached — so this is not a network round-trip per request.
Tokens are pinned to this site with `authorizedParties`, so a token minted for
another app on the same Clerk instance is refused.

The email address is never read from the token. Clerk does not put one there
unless the instance is configured to add it as a custom claim, and the browser
already has the live address from Clerk's own session — so the client supplies
it for display and the API keys everything on the id alone. A copy stored in
our database would go stale the moment someone changed their address.

### Routes

- `GET /api/auth/me`, `PATCH /api/auth/me` — the profile (name, phone,
  country). These are *ours*, not Clerk's, because the care team reads them
  next to an enquiry. `GET` creates the row on first sight: Clerk accounts live
  outside the database, so there is no `auth.users` insert for a trigger to
  fire on any more.
- `POST /api/reports` (upload), `GET /api/reports` (list),
  `GET /api/reports/:id/download` (short-lived signed link),
  `DELETE /api/reports/:id`
- `GET /api/inquiries/mine` — the patient's own past quote requests

All of them require the `Authorization` header. Files are PDF, JPG or PNG up to
4MB each — the cap is just under Vercel's 4.5MB request-body limit, so the
upload form can show a real message instead of an opaque platform `413`.

### Migrating the database

Run `server/db/clerk-auth-schema.sql` in the Supabase SQL editor. A Clerk user
id is a string like `user_2abc…`, not a uuid, so `profiles.id`,
`reports.user_id` and `inquiries.user_id` change type and lose their foreign
key to `auth.users`.

That file also drops the old row-level security policies. They compared each
row against `auth.uid()`, which reads the Supabase JWT — and there is no
Supabase JWT any more, so under Clerk every one of them would deny every row
while still looking like protection. RLS stays *enabled with no policies*,
which is what `schema.sql` already does for the public tables: anon and
authenticated keys are refused outright, and the only way in is the
service-role key the API holds. The real check is `requireAuth` plus the
`user_id` filter on every query.

## Logo & brand assets

The master artwork lives in `images/logo/` — a transparent PNG and a
white-background PNG, both over 1MB. Those are **masters, not web assets**.
`npm run build:logo` crops them to their real content, resizes, and writes the
optimised files the site loads into `client/public/`:

| File | Built from | Used for |
| --- | --- | --- |
| `logo-mark.png` | transparent | The roundel alone — navbar |
| `logo-lockup.png` | transparent | Full stacked lockup — footer |
| `favicon-32.png`, `favicon-192.png` | transparent | Browser tab |
| `apple-touch-icon.png` | white background | iOS home screen |
| `og-image.jpg` | white background | Social share preview |

The outputs are committed, so neither a deploy nor `sharp` is needed at build
time. Re-run the script only if the artwork changes.

**The wordmark is navy, so it only works on light backgrounds.** The footer sits
on `surface-container-low` and the navbar on `surface`, so both are fine. If you
ever put the lockup on the navy `bg-primary` band, the "MENDSURE" text will
disappear into it — use `logo-mark.png` with white type beside it instead, which
is what the navbar does.

The navbar sets its wordmark in type rather than using the lockup image,
because the master is a stacked lockup — roundel above the name — and is far
too tall for a 64px bar. The two-line treatment there mirrors the artwork:
`MENDSURE` in `text-primary`, `HEALTHCARE SERVICES` in `text-secondary`.

iOS composites home-screen icons onto an opaque tile, which is why
`apple-touch-icon.png` is built from the white-background master — a
transparent source would come out sitting on black.

## Doctor & hospital photographs

The photographs as supplied live in `images/doctors/` and `images/hospital/` —
whatever size, shape and format each hospital's own site published them at,
from a 220px thumbnail to a 6000px camera frame. Like the logo artwork, those
are **masters, not web assets**. `npm run build:images` normalises them and
writes the files the cards load into `client/public/images/`:

| Output | Shape | Notes |
| --- | --- | --- |
| `images/doctors/<slug>.webp` | 600 × 600 | Square, because these are headshots |
| `images/hospitals/<slug>.webp` | 1200 × 800 | 3:2, matching the wide facility shots |

The outputs are committed, so neither a deploy nor `sharp` is needed at build
time. Install `sharp` (`npm install --no-save sharp`) only when re-running the
script.

**Adding a photograph** is a matter of dropping the file into the folder named
after the doctor or hospital and re-running the script. It slugifies the
filename and matches that against each record's slug and its name, so
`Dr. Ashok Seth.jpg` finds `dr-ashok-seth` on its own. Files that match nothing
are listed at the end of the run instead of being silently dropped, and so are
records still without a photograph.

Two treatments, chosen per file:

- **Photographs** are cropped to fill the frame. Portraits crop from the top,
  because the head is what has to survive — a centred crop on a standing
  full-length shot lands on the chest.
- **Cut-outs** — the subject masked out onto a transparent background, ten of
  the doctor photographs — get a white background put behind them and are
  fitted whole rather than cropped, since a cut-out puts the head close to the
  top edge and cropping it square would take the head off. Detection needs a
  real share of the frame to be transparent: a photograph saved with rounded
  corners has an alpha channel too, and it wants cropping like any other.

**Where the cards get the path.** The script also writes
`client/src/data/directory-images.json`, a slug-to-path map, from the files it
actually wrote — so it cannot drift from what is on disk.
`client/src/lib/directoryImages.js` reads it. A row's own `image_url` still
wins whenever it is set, so a photograph loaded into Supabase overrides the
built file; a record with neither falls back to `CardMedia`'s tinted panel,
which is by design rather than broken.

Both `/images` and `/scripts` in `.vercelignore` are anchored with a leading
slash. Unanchored they match at any depth, which would take
`client/public/images` out of the deploy along with every photograph.

## City & country autocomplete

The "City in India" field in the hero search and the "Country" field in the
consultation form suggest as you type, via `client/src/components/Autocomplete.jsx`.

The lists come from
[dr5hn/countries-states-cities-database](https://github.com/dr5hn/countries-states-cities-database),
trimmed to what the site needs and committed under `client/src/data/`:

| File | Contents | Size |
| --- | --- | --- |
| `countries.json` | 250 countries, with ISO code and flag emoji | ~12 KB |
| `india-cities.json` | 4,079 Indian cities | ~45 KB |

To pick up upstream corrections:

```bash
npm run build:locations
```

That re-downloads and regenerates both files. The outputs are committed
deliberately, so a Vercel build never depends on GitHub being reachable. The
full upstream dataset is ~44MB — never import it directly into the client.

**Attribution:** the dataset is licensed ODbL, which requires attribution if you
publish or redistribute it. Crediting dr5hn in your site footer or a
`/licenses` page covers this.

### Two behaviours worth knowing

**Alternate names.** The dataset carries only current official names, but
patients writing from the US, UK, and Gulf overwhelmingly use the older ones.
`CITY_ALIASES` and `COUNTRY_ALIASES` in `client/src/lib/locations.js` map the
names people actually type — Bangalore, Bombay, Madras, Calcutta, Gurgaon,
Trivandrum, USA, UK, UAE — onto the dataset's entries, and the dropdown shows
an "also called" hint when a match came through one. Note the direction: the
key must be the name **as the dataset spells it**, which is not always the
current official spelling (Kochi is filed as "Cochin", Kalaburagi as
"Kalaburgi"). `npm run build:locations` doesn't validate these — if you add an
alias for a name the dataset doesn't have, it silently never matches.

**Hospital cities rank first.** The hero field is passed the cities we actually
have partner hospitals in; those sort above equally good matches and get a
"Partner hospitals" badge, because picking a city with no hospitals dead-ends
on an empty results page. It stays a free-text field either way — a patient can
type a town that isn't listed and still submit.

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
   | `VITE_CLERK_PUBLISHABLE_KEY` | for accounts | Clerk → API Keys. Read at **build** time, so a redeploy is required after adding it |
   | `CLERK_SECRET_KEY` | for accounts | Clerk → API Keys. Server-side only |
   | `RESEND_API_KEY` | no | without it, new enquiries log instead of emailing |
   | `NOTIFY_TO_EMAIL` | no | inbox for new-enquiry alerts |
   | `NOTIFY_FROM_EMAIL` | no | must be a Resend-verified sender |

   `CLIENT_ORIGIN` and `PORT` are only for local development — leave them out.
   The API refuses to start without the two Supabase values and says so plainly
   in the function logs. Without the two Clerk values it still serves the whole
   public site and only the account pages go dark — see **What happens if a key
   is missing** above.
3. Deploy, then check `https://<your-domain>/api/health`:

   - `200 {"status":"ok"}` — the API is up and configured.
   - `200 {"status":"ok","accounts":"unavailable",...}` — content is fine, but
     patient login is not configured. The response names the missing variable.
   - `503 {"status":"misconfigured","missingEnvVars":[...]}` — the deploy
     worked, but step 2 didn't. The response names exactly which variables are
     missing. Add them and redeploy.
   - `500 FUNCTION_INVOCATION_FAILED` — the function itself crashed; check the
     runtime logs in the Vercel dashboard.

   While the API is unconfigured, every `/api` route returns a 503 and the
   listing pages (Doctors, Hospitals, Treatments) show their "couldn't load"
   state with no cards. The home page hides those sections entirely when they
   have no data, so it can look fine while the rest of the site has no content
   — check `/api/health` before assuming the frontend is at fault.

### Deployment gotchas already handled

- **`app.listen()` doesn't run on Vercel.** Route wiring lives in
  `server/src/app.js`; `server/src/index.js` only starts a listener locally.
- **`trust proxy` is on.** Requests arrive via Vercel's edge proxy, and without
  it `express-rate-limit` throws and 500s the enquiry route.
- **A commit is not a deploy.** Vercel builds what is on `origin/main`. Work
  that is committed locally but never pushed will not appear on the site, and
  neither will files left untracked — `git commit -a` stages only files git is
  already tracking, so a new directory like `client/public/images/` is silently
  left behind. `git status` before assuming the deploy is at fault.
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
      `Hospitals.jsx`, `HowItWorks.jsx`, and `About.jsx`) with your own hosted
      photos. The one on About is the most worth replacing — it sits beside the
      opening statement at full size, and a real photograph of the care team or
      a partner facility carries far more weight there than stock imagery
- [ ] Delete or update any row still marked `is_placeholder = true`

## Project structure

```
client/src/
  index.css     The design system — all colors, spacing, and type tokens
                live in the @theme block. One place for any theme change.
  components/   Reusable UI pieces (Navbar, Footer, cards, forms, etc.)
  pages/        One file per route (Home, Treatments, Contact, etc.)
  lib/          Small helpers: API calls, the useApi() fetch hook, formatting,
                locations.js — autocomplete search, ranking, and name aliases
  data/         Generated country/city lists (see npm run build:locations) and
                directory-images.json (see npm run build:images)
client/public/
  images/       Built doctor and hospital photographs (see npm run build:images)

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
  auth-schema.sql     Profiles, reports, and the storage bucket (Supabase-auth era)
  schema-updates.sql  Links enquiries to accounts; extra hospital fields
  doctors-schema.sql  Designation, department, hospital_name, is_priority
  clerk-auth-schema.sql  Re-keys profiles/reports/inquiries to Clerk user ids
  hospitals-delhi-ncr.sql  The real partner hospitals

Run them in that order. clerk-auth-schema.sql supersedes the account half of
auth-schema.sql — see "Patient accounts (Clerk)".
```





