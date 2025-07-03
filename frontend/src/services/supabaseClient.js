// src/services/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// Leer las variables desde el .env
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
