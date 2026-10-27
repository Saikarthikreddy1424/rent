import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseKey && 
  !supabaseUrl.includes('placeholder') && 
  !supabaseKey.includes('placeholder')
);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

if (isSupabaseConfigured) {
  console.log('✅ Supabase Client initialized with remote database.');
} else {
  console.log('⚡ Running in Local Persistent Mode (Seed Data Ready). Add your SUPABASE_URL & SUPABASE_ANON_KEY in .env to connect to live Supabase.');
}
