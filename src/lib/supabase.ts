import { createClient } from '@supabase/supabase-js';

// Check if running in development environment
const isDevelopment = import.meta.env.DEV;

// Default to empty strings in development to prevent crashes
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || (isDevelopment ? 'http://localhost:54321' : '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || (isDevelopment ? 'dummy-key' : '');

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.error(`
    Missing Supabase environment variables. 
    To resolve this:
    1. Click on the Supabase menu in the top right corner
    2. Click "Connect to Supabase"
    3. Select your project
    
    This will automatically add the required environment variables.
  `);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);