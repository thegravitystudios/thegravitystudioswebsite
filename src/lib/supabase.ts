import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://idvvtjppunmwtwjkldih.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_enOZbZ44no3dD8TrZoZXzw_m2RlstLW";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
