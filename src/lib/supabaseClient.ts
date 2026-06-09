import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Prevent crashing at build time or when variables are missing, 
// just warn the user.
export const supabase = createClient<Database>(
  supabaseUrl || "https://placeholder.supabase.co", 
  supabaseAnonKey || "placeholder-anon-key"
);
