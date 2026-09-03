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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong. Please try again.');
  }

  return data;
}
