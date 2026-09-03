require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { missingEnv } = require('./lib/config');

const treatmentsRouter = require('./routes/treatments');
const hospitalsRouter = require('./routes/hospitals');
const doctorsRouter = require('./routes/doctors');
const testimonialsRouter = require('./routes/testimonials');
const inquiriesRouter = require('./routes/inquiries');
const authRouter = require('./routes/auth');
const reportsRouter = require('./routes/reports');

const app = express();

// On Vercel every request arrives through their edge proxy, so the client's
// real IP is only in X-Forwarded-For. Without this, express-rate-limit refuses
// to start (it can't tell a spoofed IP from a proxied one) and the auth and
// inquiry routes fail with a 500.
app.set('trust proxy', 1);

// In production the React app and this API are served from the same Vercel
// domain, so the browser never sends a cross-origin request and CORS is a
// no-op. It still matters in local dev, where Vite runs on :5173.
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    exposedHeaders: ['X-Total-Count'],
  })
);
app.use(express.json());

// Useful for checking a deployment is alive without touching the database.
// It also reports whether the API is actually configured, so a broken deploy
// can be diagnosed from a single curl rather than from the function logs.
function health(req, res) {
  const missing = missingEnv();

  if (missing.length > 0) {
    return res.status(503).json({
      status: 'misconfigured',
      missingEnvVars: missing,
      hint: 'Add these under Vercel -> Project Settings -> Environment Variables, then redeploy.',
    });
  }

  res.json({ status: 'ok' });
}

app.get('/api/health', health);
app.get('/health', health);

// Every data route needs Supabase. Answering with a clear 503 up front beats
// letting each route fail on its own with a confusing message, and keeps the
// response JSON so the client shows its normal error state rather than
// choking on an HTML error page.
app.use('/api', (req, res, next) => {
  const missing = missingEnv();

  if (missing.length > 0) {
    console.error(`Refusing request: missing env ${missing.join(', ')}`);
    return res.status(503).json({
      error: 'The API is not configured yet. Please try again shortly.',
    });
  }

  next();
});

app.use('/api/treatments', treatmentsRouter);
app.use('/api/hospitals', hospitalsRouter);
app.use('/api/doctors', doctorsRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/inquiries', inquiriesRouter);
app.use('/api/auth', authRouter);
app.use('/api/reports', reportsRouter);

// Anything else under /api is a genuinely unknown endpoint. Answer in JSON so
// the client's `response.json()` doesn't choke on an HTML error page.
app.use('/api', (req, res) => {
  res.status(404).json({ error: `No API route matches ${req.method} ${req.path}` });
});

// Same reasoning for thrown errors: without this Express replies with an HTML
// stack trace, which surfaces in the UI as an unhelpful JSON parse error.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

module.exports = app;
