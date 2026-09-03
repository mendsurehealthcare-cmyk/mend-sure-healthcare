require('dotenv').config();
const express = require('express');
const cors = require('cors');

const treatmentsRouter = require('./routes/treatments');
const hospitalsRouter = require('./routes/hospitals');
const doctorsRouter = require('./routes/doctors');
const testimonialsRouter = require('./routes/testimonials');
const inquiriesRouter = require('./routes/inquiries');
const authRouter = require('./routes/auth');
const reportsRouter = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    exposedHeaders: ['X-Total-Count'],
  })
);
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/treatments', treatmentsRouter);
app.use('/api/hospitals', hospitalsRouter);
app.use('/api/doctors', doctorsRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/inquiries', inquiriesRouter);
app.use('/api/auth', authRouter);
app.use('/api/reports', reportsRouter);

app.listen(PORT, () => {
  console.log(`Mend Sure API running on http://localhost:${PORT}`);
});
