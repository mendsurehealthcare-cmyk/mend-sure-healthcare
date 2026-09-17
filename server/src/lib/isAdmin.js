const supabase = require('../supabaseClient');

// Single source of truth for "is this Clerk user an admin" — used by
// requireAdmin and anywhere else that needs the same check. Reading
// profiles.role directly rather than trusting anything the client sends.
async function isAdmin(userId) {
  if (!userId) return false;

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('isAdmin check failed:', error);
    return false;
  }

  return data?.role === 'admin';
}

module.exports = isAdmin;
