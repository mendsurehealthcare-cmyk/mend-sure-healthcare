/*
  Calling our API as the logged-in patient.

  Clerk owns the session now. It keeps the token in its own storage, refreshes
  it before it expires, and hands out a fresh one through `getToken()` — so
  the localStorage handling, the refresh-token dance and the retry-on-401
  replay that used to live in this file are all gone, along with every
  password path.

  `getToken` is only reachable from Clerk's React hooks, and these helpers are
  called from plain functions as well as components, so AuthProvider registers
  it here once on mount.
*/

let tokenSource = async () => null;

// Called by AuthProvider. Passing null puts it back to "logged out", which is
// what a signed-out session or an unconfigured Clerk key looks like.
export function registerTokenSource(getToken) {
  tokenSource = getToken || (async () => null);
}

export async function getAuthToken() {
  try {
    return await tokenSource();
  } catch {
    // Clerk throws if the session went away mid-call. Treat it as logged out;
    // the caller turns that into a prompt to log in again.
    return null;
  }
}

// Every API error comes back as { error: "..." }, so unwrap it into a real
// Error the forms can display directly.
async function parse(response) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // A failure that isn't our JSON came from something in front of the API —
    // a platform error page, a gateway timeout, a misrouted deploy. Naming the
    // status code matters: the generic message alone gives neither the patient
    // nor whoever they report it to anything to go on.
    if (!data || !data.error) {
      throw new Error(
        `We couldn't reach the server (error ${response.status}). Please try again in a moment — if it keeps happening, let us know.`
      );
    }

    throw new Error(data.error);
  }

  return data ?? {};
}

/*
  Calls the API as the logged-in patient. Pass a FormData body for uploads —
  the Content-Type header is left alone so the browser can set the multipart
  boundary itself.
*/
export async function authFetch(path, options = {}) {
  const token = await getAuthToken();
  if (!token) throw new Error('Please log in first.');

  const headers = { ...options.headers, Authorization: `Bearer ${token}` };

  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  return parse(await fetch(`/api${path}`, { ...options, headers }));
}
