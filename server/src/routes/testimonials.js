const express = require('express');
const supabase = require('../supabaseClient');

const router = express.Router();

// GET /api/testimonials
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

module.exports = router;
