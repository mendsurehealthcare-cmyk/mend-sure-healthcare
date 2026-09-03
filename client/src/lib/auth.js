/*
  Patient session handling.

  The API hands back a Supabase access token (valid ~1 hour) plus a refresh
  token. We keep both in localStorage so a patient stays logged in across
  reloads, and `authFetch` transparently swaps an expired access token for a
  fresh one rather than kicking them out mid-upload.
*/

const STORAGE_KEY = 'mendsure.session';

export function getSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    // Private browsing / blocked storage — treat as logged out.
    return null;
  }
}

function setSession(session) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Nothing we can do; the session just won't survive a reload.
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore.
  }
}

/*
  Supabase's auth errors are written for developers, not patients — e.g.
  `Email address "x@y.co" is invalid` (its way of saying the domain has no
  MX records). Rewrite the ones a patient can actually trigger into something
  that tells them what to do about it; anything unrecognised passes through.
*/
function friendlyAuthError(message = '') {
  if (/is invalid/i.test(message) && /email/i.test(message)) {
    return "We couldn't verify that email address. Please check the spelling — especially the part after the @.";
  }

  if (/already registered|already exists/i.test(message)) {
    return 'An account with that email already exists. Try logging in instead.';
  }

  if (/password/i.test(message) && /short|least|weak/i.test(message)) {
    return 'Please choose a password of at least 8 characters.';
  }

  // Supabase's own outbound email quota, not ours. The account isn't created
  // when this fires, so retrying later genuinely works.
  if (/email rate limit|rate limit exceeded/i.test(message)) {
    return "We couldn't send your confirmation email just now. Please try again in a few minutes — your account hasn't been created yet.";
  }

  return message;
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

    throw new Error(friendlyAuthError(data.error) || 'Something went wrong. Please try again.');
  }

  return data ?? {};
}

function postJson(path, body) {
  return fetch(`/api${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function signup(email, password) {
  const data = await parse(await postJson('/auth/signup', { email, password }));

  // When email confirmation is switched on in Supabase, signup returns a
  // { message } instead of tokens — the patient has to confirm first.
  if (data.access_token) setSession(data);

  return data;
}

export async function login(email, password) {
  const data = await parse(await postJson('/auth/login', { email, password }));
  setSession(data);
  return data;
}

export async function forgotPassword(email) {
  return parse(await postJson('/auth/forgot-password', { email }));
}

export function logout() {
  clearSession();
}

async function refreshSession() {
  const session = getSession();
  if (!session?.refresh_token) return null;

  const response = await postJson('/auth/refresh', { refresh_token: session.refresh_token });

  if (!response.ok) {
    clearSession();
    return null;
  }

  // A 200 that isn't JSON means something upstream answered instead of the API
  // — a platform error page, say. Treat that as a failed refresh and make the
  // patient log in again, rather than throwing a JSON parse error at them.
  const data = await response.json().catch(() => null);
  if (!data?.access_token) {
    clearSession();
    return null;
  }

  setSession(data);
  return data;
}

/*
  Calls the API as the logged-in patient. On a 401 it tries the refresh token
  once and replays the request, so an expired access token is invisible to the
  caller. Pass a FormData body for uploads — the Content-Type header is left
  alone so the browser can set the multipart boundary itself.
*/
export async function authFetch(path, options = {}) {
  const session = getSession();
  if (!session) throw new Error('Please log in first.');

  const send = (token) => {
    const headers = { ...options.headers, Authorization: `Bearer ${token}` };

    if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    return fetch(`/api${path}`, { ...options, headers });
  };

  let response = await send(session.access_token);

  if (response.status === 401) {
    const refreshed = await refreshSession();
    if (!refreshed) throw new Error('Your session has expired. Please log in again.');
    response = await send(refreshed.access_token);
  }

  return parse(response);
}
