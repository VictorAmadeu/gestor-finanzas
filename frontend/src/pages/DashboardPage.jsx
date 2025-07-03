// src/pages/DashboardPage.jsx
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Función para logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // Seguridad: si no hay usuario, no debería estar aquí
  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">
        Bienvenido, {user.email || "usuario"}!
      </h1>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Cerrar sesión
      </button>
      {/* Aquí irá el resto de tu dashboard */}
    </div>
  );
}
