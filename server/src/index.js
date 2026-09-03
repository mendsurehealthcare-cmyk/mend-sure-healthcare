// Local development entry point. It starts a long-running HTTP server, which
// is exactly what you want on your machine and exactly what you must not do on
// Vercel — there, api/[...path].js imports the same app as a serverless
// function instead. All the route wiring lives in app.js so both share it.
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Mend Sure API running on http://localhost:${PORT}`);
});
