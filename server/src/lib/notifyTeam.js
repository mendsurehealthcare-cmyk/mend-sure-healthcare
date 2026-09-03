const { Resend } = require('resend');

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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
      subject: `New enquiry: ${inquiry.full_name}`,
      html: `
        <p><strong>Name:</strong> ${inquiry.full_name}</p>
        <p><strong>Email:</strong> ${inquiry.email}</p>
        <p><strong>Phone:</strong> ${inquiry.phone}</p>
        <p><strong>Country:</strong> ${inquiry.country || '—'}</p>
        <p><strong>Treatment:</strong> ${inquiry.treatment_interested || '—'}</p>
        <p><strong>Message:</strong> ${inquiry.message || '—'}</p>
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
