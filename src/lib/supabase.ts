import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const MISSING_ENV_MESSAGE =
  'Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env (veja .env.example).';

export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey);
}

export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;
