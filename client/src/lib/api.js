import { getSession } from './auth';

// Submits the "get a free quote" form. Used by the Contact page and the
// ConsultationForm component shown across the site.
//
// Logging in isn't required — but when the patient happens to be logged in we
// send their token along, so the API links the enquiry to their account and it
// shows up under "Your Quote Requests".
export async function submitInquiry(formData) {
  const session = getSession();
  const headers = { 'Content-Type': 'application/json' };

  if (session?.access_token) {
    headers.Authorization = `Bearer ${session.access_token}`;
  }

  const response = await fetch('/api/inquiries', {
    method: 'POST',
    headers,
    body: JSON.stringify(formData),
  });

  // Not every failure comes back as our JSON: a platform timeout or gateway
  // error answers with an HTML page, and calling .json() on that throws
  // "Unexpected token '<'" — which is what the patient would then see instead
  // of anything useful. Fall back to a message they can act on.
  const data = await response.json().catch(() => null);

  if (!response.ok || !data) {
    throw new Error(
      data?.error || "We couldn't submit your request just now. Please try again in a moment."
    );
  }

  return data;
}
