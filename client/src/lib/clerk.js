/*
  Clerk's publishable key, and whether we have one at all.

  The key is public by design — it ships inside the JavaScript bundle and
  identifies the Clerk instance rather than authorising anything — but it is
  still read from the environment so the development and production instances
  can differ without a code change. Vite inlines `VITE_`-prefixed variables at
  build time, so this has to be set wherever the build runs, not just at
  runtime: locally in client/.env.local, and on Vercel under the project's
  environment variables.

  `clerkConfigured` exists so a deploy that is missing the key degrades to
  "nobody is logged in" instead of taking the whole site down. Every page here
  is public apart from the account and reports pages; mounting ClerkProvider
  without a key throws during render, which would white-screen the treatment
  listings and the enquiry form along with the login page. This value is fixed
  for the lifetime of the app, so components can safely branch on it.
*/
export const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';

export const clerkConfigured = CLERK_PUBLISHABLE_KEY.length > 0;

// Shown on the login page when the key is missing, so the failure names itself
// rather than presenting a form that cannot work.
export const CLERK_MISSING_MESSAGE =
  'Accounts are temporarily unavailable. Please use the enquiry form to reach us, or try again shortly.';
