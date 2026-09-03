const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const supabase = require('../supabaseClient');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();
const BUCKET = 'patient-reports';

const ALLOWED_TYPES = new Set(['application/pdf', 'image/jpeg', 'image/png']);

// Vercel rejects any serverless request body over 4.5MB before it ever reaches
// this code, and the platform's error is an opaque 413 the client can't explain
// to the patient. Capping just under that ceiling means multer catches it first
// and returns a message the upload form can actually display.
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_TYPES.has(file.mimetype)) {
      return cb(new Error('Only PDF, JPG, and PNG files are allowed.'));
    }
    cb(null, true);
  },
});

router.use(requireAuth);

// POST /api/reports — upload a report file
router.post('/', (req, res) => {
  upload.single('file')(req, res, async (uploadError) => {
    if (uploadError) {
      const message =
        uploadError.code === 'LIMIT_FILE_SIZE'
          ? 'That file is larger than 4MB. Please upload a smaller file or split it into parts.'
          : uploadError.message;
      return res.status(400).json({ error: message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file was uploaded.' });
    }

    const safeName = req.file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const storagePath = `${req.userId}/${crypto.randomUUID()}-${safeName}`;

    const { error: uploadFailure } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, req.file.buffer, { contentType: req.file.mimetype });

    if (uploadFailure) {
      return res.status(500).json({ error: uploadFailure.message });
    }

    const { data, error } = await supabase
      .from('reports')
      .insert({
        user_id: req.userId,
        file_name: req.file.originalname,
        storage_path: storagePath,
        note: req.body.note || null,
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data);
  });
});

// GET /api/reports — list the logged-in patient's own reports
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('reports')
    .select('id, file_name, note, uploaded_at')
    .eq('user_id', req.userId)
    .order('uploaded_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// GET /api/reports/:id/download — a short-lived link to fetch the file
router.get('/:id/download', async (req, res) => {
  const { data: report, error } = await supabase
    .from('reports')
    .select('storage_path')
    .eq('id', req.params.id)
    .eq('user_id', req.userId)
    .single();

  if (error || !report) {
    return res.status(404).json({ error: 'Report not found.' });
  }

  const { data, error: signError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(report.storage_path, 60);

  if (signError) {
    return res.status(500).json({ error: signError.message });
  }

  res.json({ url: data.signedUrl });
});

// DELETE /api/reports/:id
router.delete('/:id', async (req, res) => {
  const { data: report, error } = await supabase
    .from('reports')
    .select('storage_path')
    .eq('id', req.params.id)
    .eq('user_id', req.userId)
    .single();

  if (error || !report) {
    return res.status(404).json({ error: 'Report not found.' });
  }

  await supabase.storage.from(BUCKET).remove([report.storage_path]);
  await supabase.from('reports').delete().eq('id', req.params.id);

  res.json({ success: true });
});

module.exports = router;
