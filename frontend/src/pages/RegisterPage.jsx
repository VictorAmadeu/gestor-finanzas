// src/pages/RegisterPage.jsx
import { useState, useContext } from "react";
import { supabase } from "../services/supabaseClient";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Estados para los campos y mensajes
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  // Función para registrar usuario
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    // Llama a Supabase Auth para crear el usuario
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message); // Muestra el error al usuario
    } else {
      // Registro exitoso: redirige a dashboard o muestra aviso
      navigate("/dashboard");
    }
  };

  // Si ya está logueado, redirige automáticamente
  if (user) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="max-w-sm mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Crear Cuenta</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Correo electrónico"
          className="border p-2 w-full mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="border p-2 w-full mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
        {error && <div className="text-red-500 mb-3">{error}</div>}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 w-full rounded"
        >
          Registrarse
        </button>
      </form>
      <div className="mt-2">
        ¿Ya tienes cuenta?{" "}
        <a href="/login" className="text-blue-500 underline">
          Iniciar sesión
        </a>
      </div>
    </div>
  );
}
