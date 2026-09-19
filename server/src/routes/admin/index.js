const asyncRouter = require('../../lib/asyncRouter');
const supabase = require('../../supabaseClient');
const requireAuth = require('../../middleware/requireAuth');
const requireAdmin = require('../../middleware/requireAdmin');
const doctorsRouter = require('./doctors');
const hospitalsRouter = require('./hospitals');

const router = asyncRouter();

// Every route under /api/admin needs a logged-in admin. This is the real
// enforcement — the dashboard's client-side route guard only improves the
// experience for everyone else by not showing them a dashboard they can't
// use.
router.use(requireAuth, requireAdmin);

// Buckets a list of rows into one count per day over a trailing window
// ending today, so a day with zero rows still renders as a zero point/bar
// instead of vanishing from the chart.
function bucketByDay(rows, dateField, days) {
  const today = new Date();
  const buckets = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const day = new Date(today);
    day.setUTCDate(today.getUTCDate() - i);
    buckets.push({ date: day.toISOString().slice(0, 10), count: 0 });
  }

  const index = new Map(buckets.map((bucket, i) => [bucket.date, i]));
  for (const row of rows) {
    const key = new Date(row[dateField]).toISOString().slice(0, 10);
    const i = index.get(key);
    if (i !== undefined) buckets[i].count += 1;
  }
  return buckets;
}

function daysAgoIso(days) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - (days - 1));
  date.setUTCHours(0, 0, 0, 0);
  return date.toISOString();
}

// GET /api/admin/overview — stats, trends, and recent activity for the
// dashboard landing page. Every number here comes from a real table
// (hospitals, doctors, patient profiles, uploaded reports, enquiries) —
// nothing is fabricated to fill out the layout.
router.get('/overview', async (req, res) => {
  const since30 = daysAgoIso(30);
  const since7 = daysAgoIso(7);

  const [
    doctors,
    hospitals,
    patients,
    newPatients,
    reports,
    recentDoctors,
    recentHospitals,
    recentReports,
    recentInquiries,
    registrations,
    inquiriesWeek,
  ] = await Promise.all([
    supabase.from('doctors').select('id', { count: 'exact', head: true }),
    supabase.from('hospitals').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'patient'),
    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'patient')
      .gte('created_at', since30),
    supabase.from('reports').select('id', { count: 'exact', head: true }),
    supabase
      .from('doctors')
      .select('id, name, slug, specialty, image_url, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('hospitals')
      .select('id, name, slug, city, image_url, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('reports')
      .select('id, file_name, uploaded_at')
      .order('uploaded_at', { ascending: false })
      .limit(5),
    supabase
      .from('inquiries')
      .select('id, full_name, treatment_interested, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase.from('profiles').select('created_at').eq('role', 'patient').gte('created_at', since30),
    supabase.from('inquiries').select('created_at').gte('created_at', since7),
  ]);

  const firstError = [
    doctors,
    hospitals,
    patients,
    newPatients,
    reports,
    recentDoctors,
    recentHospitals,
    recentReports,
    recentInquiries,
    registrations,
    inquiriesWeek,
  ].find((result) => result.error);

  if (firstError) {
    return res.status(500).json({ error: firstError.error.message });
  }

  const activity = [
    ...recentDoctors.data.map((d) => ({
      type: 'doctor',
      label: `${d.name} was added to the doctor directory`,
      at: d.created_at,
      icon: 'stethoscope',
    })),
    ...recentHospitals.data.map((h) => ({
      type: 'hospital',
      label: `${h.name} was added to the hospital directory`,
      at: h.created_at,
      icon: 'local_hospital',
    })),
    ...recentReports.data.map((r) => ({
      type: 'report',
      label: `A patient uploaded a report: ${r.file_name}`,
      at: r.uploaded_at,
      icon: 'description',
    })),
    ...recentInquiries.data.map((i) => ({
      type: 'inquiry',
      label: `New enquiry from ${i.full_name}${i.treatment_interested ? ` about ${i.treatment_interested}` : ''}`,
      at: i.created_at,
      icon: 'mail',
    })),
  ]
    .sort((a, b) => new Date(b.at) - new Date(a.at))
    .slice(0, 6);

  res.json({
    counts: {
      hospitals: hospitals.count ?? 0,
      doctors: doctors.count ?? 0,
      patients: patients.count ?? 0,
      newPatients: newPatients.count ?? 0,
      reports: reports.count ?? 0,
    },
    registrationsByDay: bucketByDay(registrations.data, 'created_at', 30),
    inquiriesByDay: bucketByDay(inquiriesWeek.data, 'created_at', 7),
    recentDoctors: recentDoctors.data,
    recentHospitals: recentHospitals.data,
    activity,
  });
});

router.use('/doctors', doctorsRouter);
router.use('/hospitals', hospitalsRouter);

module.exports = router;
