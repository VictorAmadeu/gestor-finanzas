import { useState, useContext, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
// Iconos
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

  // Redirección segura si el usuario ya está logueado
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        {/* CARD con sombra y bordes suaves */}
        <div className="max-w-sm w-full mx-auto mt-8 p-8 bg-white rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-center">Crear Cuenta</h2>
          <form onSubmit={handleRegister} autoComplete="on">
            {/* Input nombre con label e icono */}
            <div className="relative mb-4">
              <label htmlFor="register-name" className="sr-only">
                Nombre
              </label>
              <span className="absolute left-3 top-2.5">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </span>
              <input
                id="register-name"
                name="name"
                type="text"
                placeholder="Nombre"
                className={`border ${
                  error ? "border-red-500" : "border-gray-300"
                } p-2 w-full pl-10 rounded transition focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
                autoComplete="name"
              />
            </div>
            {/* Input email con label e icono */}
            <div className="relative mb-4">
              <label htmlFor="register-email" className="sr-only">
                Correo electrónico
              </label>
              <span className="absolute left-3 top-2.5">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              </span>
              <input
                id="register-email"
                name="email"
                type="email"
                placeholder="Correo electrónico"
                className={`border ${
                  error ? "border-red-500" : "border-gray-300"
                } p-2 w-full pl-10 rounded transition focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            {/* Input password con label e icono */}
            <div className="relative mb-2">
              <label htmlFor="register-password" className="sr-only">
                Contraseña
              </label>
              <span className="absolute left-3 top-2.5">
                <LockClosedIcon className="h-5 w-5 text-gray-400" />
              </span>
              <input
                id="register-password"
                name="password"
                type="password"
                placeholder="Contraseña"
                className={`border ${
                  error ? "border-red-500" : "border-gray-300"
                } p-2 w-full pl-10 rounded transition focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
                autoComplete="new-password"
              />
            </div>
            {/* Mensaje de error destacado */}
            {error && (
              <div className="text-red-600 mb-4 text-sm font-medium px-2">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="bg-primary text-white py-2 px-4 w-full rounded font-semibold shadow hover:bg-primary-light transition"
            >
              Registrarse
            </button>
          </form>
          <div className="mt-3 text-center">
            ¿Ya tienes cuenta?{" "}
            <a href="/login" className="text-primary underline font-semibold">
              Iniciar sesión
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
