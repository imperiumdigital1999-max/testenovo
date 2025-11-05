import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gocinoldywywiproxpxz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvY2lub2xkeXd5d2lwcm94cHh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzOTQwMDUsImV4cCI6MjA2ODk3MDAwNX0.hfWm5-VdfgOihzJZU25oqUkmOk6hLwszEN6oPDvDBLs';

// Create Supabase client with error handling
let supabase = null;

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
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
  } else {
    console.warn('Supabase URL or Anon Key not configured properly');
  }
} catch (error) {
  console.warn('Failed to initialize Supabase client:', error.message);
}

// Export the client (may be null if initialization failed)
export { supabase };

// Helper function to check if Supabase is available
export const isSupabaseAvailable = () => {
  return supabase !== null;
};

// Helper function to safely execute Supabase operations
export const safeSupabaseOperation = async (operation, fallback = null) => {
  if (!isSupabaseAvailable()) {
    console.warn('Supabase not available, using fallback');
    return fallback;
  }
  
  try {
    return await operation(supabase);
  } catch (error) {
    console.warn('Supabase operation failed:', error.message);
    return fallback;
  }
};