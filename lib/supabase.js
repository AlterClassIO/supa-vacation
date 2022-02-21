import { createClient } from '@supabase/supabase-js';

export const supabase =
  global.supabase ||
  createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

if (process.env.NODE_ENV !== 'production') {
  global.supabase = supabase;
}
