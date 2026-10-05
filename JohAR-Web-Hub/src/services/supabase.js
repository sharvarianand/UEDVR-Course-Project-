import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = "https://zxtliiedkohmsxwlnxux.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4dGxpaWVka29obXN4d2xueHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2MTQyMDksImV4cCI6MjA5OTE5MDIwOX0.SKBNe-P6D5_ogibp_BX093HLFbD9-oYvmVn3SbLmNGc";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});
