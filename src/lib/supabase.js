import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || '';

const isValidHttpUrl = (value) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
};

/**
 * True when both VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are configured
 * with non-placeholder values. Allows the app to run in local demo mode until
 * real project credentials are supplied in .env.local.
 */
export const isSupabaseConfigured =
  isValidHttpUrl(supabaseUrl) &&
  !supabaseUrl.includes('your-project-ref') &&
  supabaseAnonKey.length > 20 &&
  !supabaseAnonKey.includes('your-anon-public-key');

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.info(
    '[Supabase] Credentials not configured yet. Running in local demo mode. ' +
    'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local to connect.'
  );
}

/**
 * Singleton Supabase browser client.
 * Returns null if credentials are not yet configured so callers can fail gracefully
 * or fall back to local mode.
 */
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'notech_supabase_auth',
    },
    global: {
      headers: {
        'x-application-name': 'notech-hvac-admin',
      },
    },
  })
  : null;

/**
 * Verifies connectivity to Supabase Auth / PostgREST.
 * @returns {Promise<{ ok: boolean, message: string }>}
 */
export async function checkSupabaseConnection() {
  if (!supabase) {
    return { ok: false, message: 'Supabase credentials are not configured in .env.local' };
  }

  try {
    const { error } = await supabase.auth.getSession();
    if (error) {
      return { ok: false, message: error.message };
    }
    return { ok: true, message: 'Connected to Supabase' };
  } catch (err) {
    return { ok: false, message: err?.message || 'Unable to reach Supabase' };
  }
}

/**
 * Signs in an admin/operator with email & password.
 */
export async function signInWithEmail(email, password) {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add credentials to .env.local.');
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) throw error;
  return data;
}

/**
 * Signs out the current Supabase user.
 */
export async function signOutFromSupabase() {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Fetches the authenticated user's row from `public.users`.
 * Returns null if no user row exists yet or Supabase is not configured.
 */
export async function fetchUserProfile(userId) {
  if (!supabase || !userId) return null;
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.warn('[Supabase] Failed to fetch profile:', error.message);
    return null;
  }
  return data;
}
