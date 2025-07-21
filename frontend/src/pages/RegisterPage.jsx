import { useState, useContext } from "react";
import { supabase } from "../services/supabaseClient";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
// Importamos iconos
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

export default function RegisterPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Estados para los campos del formulario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  // Función que se ejecuta al enviar el formulario de registro
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    // Llamada a Supabase para registrar, pasando el nombre en user_metadata
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      navigate("/dashboard");
    }
  };

  // Si el usuario ya está logueado, redirige al dashboard
  if (user) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-sm w-full mx-auto mt-8 p-6 bg-white rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Crear Cuenta</h2>
          <form onSubmit={handleRegister}>
            {/* Input nombre con icono */}
            <div className="relative mb-3">
              <span className="absolute left-3 top-2.5">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Nombre"
                className="border p-2 w-full pl-10"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            {/* Input email con icono */}
            <div className="relative mb-3">
              <span className="absolute left-3 top-2.5">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="email"
                placeholder="Correo electrónico"
                className="border p-2 w-full pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {/* Input password con icono */}
            <div className="relative mb-3">
              <span className="absolute left-3 top-2.5">
                <LockClosedIcon className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="password"
                placeholder="Contraseña"
                className="border p-2 w-full pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
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
      </main>
      <Footer />
    </div>
  );
}
