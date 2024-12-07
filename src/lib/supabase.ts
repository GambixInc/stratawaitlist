import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://xnjcoexivndpcmjapzbl.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuamNvZXhpdm5kcGNtamFwemJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2MTA2OTMsImV4cCI6MjA0OTE4NjY5M30.g-D8Uw3-EWFGfskFpUXVhfeoAdoziVuHCifHQx9pQ10";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);