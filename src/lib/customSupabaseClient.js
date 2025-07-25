import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gocinoldywywiproxpxz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvY2lub2xkeXd5d2lwcm94cHh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzOTQwMDUsImV4cCI6MjA2ODk3MDAwNX0.hfWm5-VdfgOihzJZU25oqUkmOk6hLwszEN6oPDvDBLs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
});