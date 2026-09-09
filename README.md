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

## Patient accounts: emailed links

Confirmation and password-reset emails are sent by Supabase, and the link in
them comes back to `/auth/callback` on this site. Three settings have to agree,
or the link opens somewhere useless:

| Where | Setting | Value |
| --- | --- | --- |
| Vercel env vars | `PUBLIC_SITE_URL` | `https://www.mendsure.com` |
| Supabase → Authentication → URL Configuration | Site URL | `https://www.mendsure.com` |
| Same page | Redirect URLs | `https://www.mendsure.com/auth/callback` and `http://localhost:5173/auth/callback` |

**Supabase validates every redirect against that allow-list.** If the address
isn't on it, Supabase ignores what the API asked for and silently falls back to
its own Site URL — which defaults to `http://localhost:3000`. A link opening a
dead localhost tab on a patient's machine means this list, not the code.

Environment variables only apply to builds made after they were set, so
redeploy after changing `PUBLIC_SITE_URL`.

### What the callback does

`/auth/callback` reads the tokens Supabase returns in the URL *hash* — never
the query string, so they are never sent to the server or written to an access
log — and clears them from the address bar immediately so they can't be
bookmarked or screenshotted.

- **Confirmation links** verify the address, sign the patient in, and forward
  them to `/account`.
- **Recovery links** show a set-new-password form instead. They deliberately do
  not grant a session on their own: the link only proves the holder can read
  that inbox, so it buys exactly one action.

Completing a reset calls `POST /api/auth/update-password`, which applies the
change as that user via `setSession` rather than with the service-role key, so
Supabase enforces its own rules and admin credentials never overwrite anyone's
password.

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
   | `RESEND_API_KEY` | no | without it, new enquiries log instead of emailing |
   | `NOTIFY_TO_EMAIL` | no | inbox for new-enquiry alerts |
   | `NOTIFY_FROM_EMAIL` | no | must be a Resend-verified sender |

   `CLIENT_ORIGIN` and `PORT` are only for local development — leave them out.
   The API refuses to start without the two Supabase values and says so plainly
   in the function logs.
3. Deploy, then check `https://<your-domain>/api/health`:

   - `200 {"status":"ok"}` — the API is up and configured.
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
  auth-schema.sql     Patient accounts, profiles, reports, and the storage bucket
  schema-updates.sql  Links enquiries to accounts; extra hospital fields
```





