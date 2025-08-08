// frontend/src/services/supabaseClient.js

import { createClient } from "@supabase/supabase-js";

// Carga las variables desde el archivo .env del frontend
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Creamos y exportamos el cliente de Supabase listo para usar en toda la app
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/*
 * Notas:
 * - Asegúrate de que las variables en .env (REACT_APP_SUPABASE_URL y REACT_APP_SUPABASE_ANON_KEY)
 *   tengan los nombres exactos y estén bien definidas.
 * - Nunca pongas aquí la service_role_key (es solo para backend).
 */
