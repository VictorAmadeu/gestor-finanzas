// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";

// 1. Creamos el contexto
export const AuthContext = createContext();

// 2. Componente proveedor (envuelve la App)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Usuario actual (o null)
  const [loading, setLoading] = useState(true); // Estado de carga (para evitar flashes)

  useEffect(() => {
    // Al cargar, intentamos recuperar la sesión guardada (por si ya estaba logueado)
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user ?? null);
      setLoading(false);
    });

    // Nos suscribimos a los cambios de auth (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Limpieza al desmontar el componente
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Proveemos el usuario y los métodos a los hijos
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
