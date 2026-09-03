const { Resend } = require('resend');

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Every field below is text a stranger typed into a public form. Dropped into
// the email markup as-is, a submission containing tags would render as markup
// in the team's inbox — at best mangling the alert, at worst smuggling a
// convincing phishing link into a message that looks like it came from us.
function escapeHtml(value) {
  if (value === null || value === undefined || value === '') return '—';

  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Emails the care team when a new enquiry comes in. If no Resend key is
// configured yet, this just logs instead of sending — the enquiry itself is
// already saved in the database either way, so a missing/broken email
// integration should never block a patient's submission.
async function notifyNewInquiry(inquiry) {
  if (!resend) {
    console.log(`(Email notifications off — no RESEND_API_KEY) New enquiry from ${inquiry.full_name} <${inquiry.email}>`);
    return;
  }

  try {
    const { error } = await resend.emails.send({
      from: process.env.NOTIFY_FROM_EMAIL || 'Mend Sure <onboarding@resend.dev>',
      to: process.env.NOTIFY_TO_EMAIL,
      subject: `New enquiry: ${String(inquiry.full_name || '').slice(0, 80)}`,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(inquiry.full_name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(inquiry.email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(inquiry.phone)}</p>
        <p><strong>Country:</strong> ${escapeHtml(inquiry.country)}</p>
        <p><strong>Treatment:</strong> ${escapeHtml(inquiry.treatment_interested)}</p>
        <p><strong>Message:</strong> ${escapeHtml(inquiry.message)}</p>
      `,
    });

    // The Resend SDK doesn't throw on a failed send — it resolves with
    // { data: null, error } instead, so this has to be checked explicitly
    // or failures (like an unverified sending domain) go unnoticed.
    if (error) {
      console.error('Failed to send new-enquiry notification email:', error.message);
    }
  } catch (err) {
    console.error('Failed to send new-enquiry notification email:', err.message);
  }
}

module.exports = { notifyNewInquiry };
